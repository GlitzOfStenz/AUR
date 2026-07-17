import uuid
import shutil
from pathlib import Path
from datetime import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.connections import get_db
from database.models import FacultyStudentNomination, University, User
from auth.middleware import get_current_user, require_admin
from schemas import NominationResponse

router = APIRouter(prefix="/api/faculty-student-awards", tags=["Faculty & Student Awards"])

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "data" / "nominations"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/nominate", response_model=NominationResponse, status_code=201)
async def submit_nomination(
    nominee_name: str = Form(...),
    nominee_email: str = Form(...),
    category: str = Form(...),
    department: str = Form(...),
    university_id: uuid.UUID = Form(...),
    justification: str = Form(...),
    files: list[UploadFile] = File(default=[]),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(University).where(University.id == university_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="University not found")

    saved_paths = []
    for f in files:
        dest = UPLOAD_DIR / f"{dt.now().strftime('%Y%m%d%H%M%S')}_{f.filename}"
        with open(dest, "wb") as out:
            shutil.copyfileobj(f.file, out)
        saved_paths.append(str(dest.relative_to(BASE_DIR)))

    nomination = FacultyStudentNomination(
        submitted_by_user_id=current_user.id,
        nominee_name=nominee_name,
        nominee_email=nominee_email,
        category=category,
        department=department,
        university_id=university_id,
        justification=justification,
        documents=saved_paths,
    )
    db.add(nomination)
    await db.commit()
    await db.refresh(nomination)
    return nomination


@router.get("/nominations/{nomination_id}", response_model=NominationResponse)
async def get_nomination_status(
    nomination_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(FacultyStudentNomination).where(FacultyStudentNomination.id == nomination_id)
    )
    nomination = result.scalar_one_or_none()
    if not nomination:
        raise HTTPException(status_code=404, detail="Nomination not found")
    if nomination.submitted_by_user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this nomination")
    return nomination


@router.get("/nominations", response_model=list[NominationResponse])
async def list_all_nominations(
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(FacultyStudentNomination))
    return result.scalars().all()