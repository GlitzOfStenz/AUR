"""
Admin Router for AUR
NOTE:
This implementation matches the current project structure as closely as possible.
Some assignment features (published dataset persistence and DB audit table)
are implemented with JSON/file fallbacks because the current models do not
contain Dataset/Audit tables.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Body, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.connections import get_db, get_redis
from database.models import User, University, RankingScore, UniversityMetric
from auth.middleware import require_admin
from auth.middleware import get_current_user
import redis.asyncio as aioredis
from pathlib import Path
from datetime import datetime
from sqlalchemy import select
from database.models import User, University, RankingScore
from schemas import UniversityRegisterRequest
from database.connections import get_db
from fastapi import Depends, HTTPException
import shutil
import subprocess
import sys
import json
import bcrypt
from services.cloudinary import upload_university_logo, upload_campus_photo
from uuid import UUID as PyUUID

from database.models import (
    Event,
    Application,
    JudgeScore,
)

from schemas import (
    EventCreate,
    EventResponse,
    AdminLoginRequest,
    AdminLoginResponse,
    AdminVerifyResponse,
)

from typing import List

from typing import List
from uuid import UUID

from schemas import (
    ApplicationResponse,
)

from schemas import (
    JudgeScoreCreate,
    FinalScoreResponse,
)

from auth.jwt import (
    create_access_token,
    create_refresh_token,
)

router = APIRouter(prefix="/admin", tags=["Admin"])

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

AUDIT_FILE = DATA_DIR / "audit_log.json"
PUBLISH_FILE = DATA_DIR / "publish.json"

ALLOWED = {".csv", ".xlsx", ".xls"}

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(
    body: AdminLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.email == body.email)
    )
    user = result.scalar_one_or_none()

    if not user or not bcrypt.checkpw(
        body.password.encode(),
        user.password_hash.encode()
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access only",
        )

    access_token = create_access_token(
        {"sub": str(user.id), "role": user.role}
    )
    refresh_token = await create_refresh_token(user.id)

    return AdminLoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )

@router.get("/verify", response_model=AdminVerifyResponse)
async def verify_admin(
    current_admin: User = Depends(require_admin),
):
    return AdminVerifyResponse(
        id=current_admin.id,
        first_name=current_admin.first_name,
        last_name=current_admin.last_name,
        email=current_admin.email,
        role=current_admin.role,
    )

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    current_admin: User = Depends(require_admin),
    redis: aioredis.Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db),
):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED:
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = f"dataset_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
    filepath = DATA_DIR / filename

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        subprocess.run([sys.executable, "-m", "database.seed"], check=True)
    except Exception:
        pass

    try:
        await redis.delete("countries:list")
        await redis.delete("analytics:summary")
    except Exception:
        pass
    return {
        "status": "success",
        "filename": filename,
        "uploaded_by": current_admin.email,
        "universities_loaded": 0,
        "universities_skipped": 0,
        "errors": []
    }


@router.patch("/university/{university_id}")
async def update_university(
    university_id: str,
    payload: dict = Body(...),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(University).where(University.id == university_id)
    )
    university = result.scalar_one_or_none()

    if university is None:
        raise HTTPException(status_code=404, detail="University not found")

    audit = []
    score_fields = {
        "placement_percentage",
    }

    for field, value in payload.items():
        if not hasattr(university, field):
            continue

        old = getattr(university, field)

        if field in score_fields and value is not None:
            if float(value) < 0 or float(value) > 100:
                raise HTTPException(
                    status_code=422,
                    detail=f"{field} must be between 0 and 100"
                )

        setattr(university, field, value)

        audit.append({
            "user": current_admin.email,
            "action": "UPDATE",
            "university": university.name,
            "field": field,
            "old_value": str(old),
            "new_value": str(value),
            "timestamp": datetime.now().isoformat()
        })

    await db.commit()
    await db.refresh(university)

    logs = []
    if AUDIT_FILE.exists():
        try:
            logs = json.loads(AUDIT_FILE.read_text())
        except Exception:
            logs = []

    logs.extend(audit)
    AUDIT_FILE.write_text(json.dumps(logs, indent=4))

    return university


@router.post("/publish")
async def publish_dataset(
    current_admin: User = Depends(require_admin),
    redis: aioredis.Redis = Depends(get_redis),
):
    files = sorted(DATA_DIR.glob("dataset_*"))

    if not files:
        raise HTTPException(status_code=404, detail="No dataset uploaded")

    latest = files[-1]

    info = {
        "status": "published",
        "dataset": latest.name,
        "published_at": datetime.now().isoformat()
    }

    PUBLISH_FILE.write_text(json.dumps(info, indent=4))

    # Clear Redis cache after publishing a new dataset
    try:
        await redis.delete("countries:list")
        await redis.delete("analytics:summary")
    except Exception:
        pass

    return info


@router.get("/audit-log")
async def audit_log(
    user: str | None = Query(None),
    current_admin: User = Depends(require_admin),
):
    if not AUDIT_FILE.exists():
        return []

    logs = json.loads(AUDIT_FILE.read_text())

    if user:
        logs = [x for x in logs if x["user"] == user]

    return logs


@router.get("/data-quality")
async def data_quality(
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    overall_null = await db.scalar(
        select(func.count()).select_from(RankingScore).where(
            RankingScore.overall_score.is_(None)
        )
    )

    research_null = await db.scalar(
        select(func.count()).select_from(UniversityMetric).where(
            UniversityMetric.research_score.is_(None)
        )
    )

    placement_null = await db.scalar(
        select(func.count()).select_from(UniversityMetric).where(
            UniversityMetric.placement_score.is_(None)
        )
    )

    faculty_null = await db.scalar(
        select(func.count()).select_from(UniversityMetric).where(
            UniversityMetric.faculty_score.is_(None)
        )
    )

    return {
        "overall_score_nulls": overall_null,
        "research_score_nulls": research_null,
        "placement_score_nulls": placement_null,
        "faculty_score_nulls": faculty_null,
    }

#Events & Awards

VALID_EVENT_TYPES = {"event", "award"}
VALID_EVENT_STATUS = {"open", "closed", "archived"}


async def get_event_or_404(
    event_id,
    db: AsyncSession,
):
    result = await db.execute(
        select(Event).where(Event.id == event_id)
    )

    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    return event
# CREATE EVENT / AWARD

@router.post(
    "/events",
    response_model=EventResponse,
)
async def create_event(
    payload: EventCreate,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if payload.type.lower() not in VALID_EVENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="type must be either 'event' or 'award'",
        )

    event = Event(
        title=payload.title,
        description=payload.description,
        type=payload.type.lower(),
        eligibility_criteria=payload.eligibility_criteria,
        deadline=payload.deadline,
        status="open",
    )

    db.add(event)

    await db.commit()

    await db.refresh(event)

    return event

# LIST EVENTS

@router.get(
    "/events",
    response_model=List[EventResponse],
)
async def list_events(
    type: str | None = Query(None),
    status: str | None = Query(None),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(Event)

    if type:
        query = query.where(Event.type == type.lower())

    if status:
        query = query.where(Event.status == status.lower())

    query = query.order_by(Event.created_at.desc())

    result = await db.execute(query)

    return result.scalars().all()

# UPDATE EVENT

@router.patch(
    "/events/{event_id}",
    response_model=EventResponse,
)
async def update_event(
    event_id,
    payload: EventCreate,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    event = await get_event_or_404(
        event_id,
        db,
    )

    if payload.type.lower() not in VALID_EVENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid event type",
        )

    event.title = payload.title
    event.description = payload.description
    event.type = payload.type.lower()
    event.eligibility_criteria = payload.eligibility_criteria
    event.deadline = payload.deadline

    await db.commit()

    await db.refresh(event)

    return event

# DELETE EVENT

@router.delete(
    "/events/{event_id}",
)
async def delete_event(
    event_id,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    event = await get_event_or_404(
        event_id,
        db,
    )

    await db.delete(event)

    await db.commit()

    return {
        "status": "success",
        "message": "Event deleted successfully",
    }
    
# APPLICATION HELPERS

VALID_APPLICATION_STATUS = {
    "submitted",
    "under_review",
    "shortlisted",
    "winner",
    "rejected",
}


async def get_application_or_404(
    application_id: UUID,
    db: AsyncSession,
):
    result = await db.execute(
        select(Application).where(
            Application.id == application_id
        )
    )

    application = result.scalar_one_or_none()

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application

# LIST APPLICATIONS

@router.get(
    "/applications",
    response_model=List[ApplicationResponse],
)
async def list_applications(
    status: str | None = Query(None),
    event_id: UUID | None = Query(None),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(Application)

    if status:
        query = query.where(
            Application.status == status
        )

    if event_id:
        query = query.where(
            Application.event_id == event_id
        )

    query = query.order_by(
        Application.submitted_at.desc()
    )

    result = await db.execute(query)

    return result.scalars().all()


# APPLICATION DETAILS

@router.get(
    "/applications/{application_id}",
    response_model=ApplicationResponse,
)
async def get_application(
    application_id: UUID,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await get_application_or_404(
        application_id,
        db,
    )
    
# UPDATE APPLICATION STATUS

@router.patch(
    "/applications/{application_id}/status",
    response_model=ApplicationResponse,
)
async def update_application_status(
    application_id: UUID,
    status: str = Body(...),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    application = await get_application_or_404(
        application_id,
        db,
    )

    status = status.lower()

    if status not in VALID_APPLICATION_STATUS:
        raise HTTPException(
            status_code=400,
            detail="Invalid application status",
        )

    application.status = status

    await db.commit()

    await db.refresh(application)

    return application


# FINAL SCORE CALCULATION

async def calculate_application_score(
    application_id: UUID,
    db: AsyncSession,
):
    result = await db.execute(
        select(JudgeScore).where(
            JudgeScore.application_id == application_id
        )
    )

    scores = result.scalars().all()

    if not scores:
        return None, 0

    judge_totals = []

    for score in scores:
        average = (
            score.academic_score +
            score.research_score +
            score.outcomes_score +
            score.impact_score +
            score.collaboration_score +
            score.governance_score
        ) / 6

        judge_totals.append(average)

    final_score = sum(judge_totals) / len(judge_totals)

    return round(final_score, 2), len(judge_totals)


# JUDGE SCORE SUBMISSION

@router.post(
    "/applications/{application_id}/judge-score",
)
async def submit_judge_score(
    application_id: UUID,
    payload: JudgeScoreCreate,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    application = await get_application_or_404(
        application_id,
        db,
    )

    existing = await db.execute(
        select(JudgeScore).where(
            JudgeScore.application_id == application.id,
            JudgeScore.judge_id == payload.judge_id,
        )
    )

    already = existing.scalar_one_or_none()

    if already:
        raise HTTPException(
            status_code=400,
            detail="Judge has already scored this application",
        )

    score = JudgeScore(
        application_id=application.id,
        judge_id=payload.judge_id,
        academic_score=payload.academic_score,
        research_score=payload.research_score,
        outcomes_score=payload.outcomes_score,
        impact_score=payload.impact_score,
        collaboration_score=payload.collaboration_score,
        governance_score=payload.governance_score,
    )

    db.add(score)

    await db.commit()

    await db.refresh(score)

    return {
        "status": "success",
        "message": "Judge score submitted successfully",
    }
    
# CALCULATE FINAL SCORE

@router.post(
    "/applications/{application_id}/calculate",
    response_model=FinalScoreResponse,
)
async def calculate_final_score(
    application_id: UUID,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    application = await get_application_or_404(
        application_id,
        db,
    )

    final_score, judges = await calculate_application_score(
        application.id,
        db,
    )

    if final_score is None:
        raise HTTPException(
            status_code=400,
            detail="No judge scores submitted",
        )

    return {
        "application_id": application.id,
        "final_score": final_score,
        "judges_count": judges,
    }
    
# VIEW FINAL SCORE

@router.get(
    "/applications/{application_id}/final-score",
    response_model=FinalScoreResponse,
)
async def view_final_score(
    application_id: UUID,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    application = await get_application_or_404(
        application_id,
        db,
    )

    final_score, judges = await calculate_application_score(
        application.id,
        db,
    )

    if final_score is None:
        raise HTTPException(
            status_code=400,
            detail="No judge scores available",
        )

    return {
        "application_id": application.id,
        "final_score": final_score,
        "judges_count": judges,
    }
    
    
@router.patch(
    "/applications/{application_id}/publish",
)
async def publish_application_result(
    application_id: UUID,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    application = await get_application_or_404(
        application_id,
        db,
    )

    final_score, judges = await calculate_application_score(
        application.id,
        db,
    )

    if final_score is None:
        raise HTTPException(
            status_code=400,
            detail="Cannot publish without judge scores.",
        )

    if application.status not in {"winner", "rejected"}:
        raise HTTPException(
            status_code=400,
            detail="Application must be marked as winner or rejected before publishing.",
        )

    return {
        "status": "published",
        "application_id": application.id,
        "final_score": final_score,
        "judges_count": judges,
        "published_at": datetime.utcnow().isoformat(),
    }
    
@router.get("/events/dashboard")
async def events_dashboard(
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    total_events = await db.scalar(
        select(func.count()).select_from(Event)
    )

    open_events = await db.scalar(
        select(func.count())
        .select_from(Event)
        .where(Event.status == "open")
    )

    total_applications = await db.scalar(
        select(func.count()).select_from(Application)
    )

    submitted = await db.scalar(
        select(func.count())
        .select_from(Application)
        .where(Application.status == "submitted")
    )

    review = await db.scalar(
        select(func.count())
        .select_from(Application)
        .where(Application.status == "under_review")
    )

    shortlisted = await db.scalar(
        select(func.count())
        .select_from(Application)
        .where(Application.status == "shortlisted")
    )

    winners = await db.scalar(
        select(func.count())
        .select_from(Application)
        .where(Application.status == "winner")
    )

    rejected = await db.scalar(
        select(func.count())
        .select_from(Application)
        .where(Application.status == "rejected")
    )

    return {
        "total_events": total_events,
        "open_events": open_events,
        "applications": total_applications,
        "submitted": submitted,
        "under_review": review,
        "shortlisted": shortlisted,
        "winners": winners,
        "rejected": rejected,
    }

@router.post("/university/register", status_code=201)
async def register_university(
    payload: UniversityRegisterRequest,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    # Check if university already exists
    existing = await db.execute(
        select(University).where(
            University.name == payload.name
        )
    )

    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="University already exists"
        )

    # Generate slug
    slug = payload.name.lower().replace(" ", "-")

    # Create University
    university = University(
        slug=slug,
        name=payload.name,
        country="Unknown",
        description=payload.description,
    )

    db.add(university)
    await db.commit()
    await db.refresh(university)

    # Store ranking score
    ranking = RankingScore(
        university_id=university.id,
        year=datetime.now().year,
        overall_score=payload.ranking_score,
    )

    db.add(ranking)
    await db.commit()

    return {
        "status": "success",
        "message": "University registered successfully",
        "university_id": str(university.id),
    }
# Image upload endpoints

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/svg+xml"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
 
 
@router.post("/universities/{university_id}/logo", tags=["admin", "images"])
async def upload_logo(
    university_id: PyUUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_admin),
):

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Use JPEG, PNG, WebP, or SVG.")
 
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 5MB.")
 
    result = await db.execute(select(University).where(University.id == university_id))
    uni = result.scalar_one_or_none()
    if not uni:
        raise HTTPException(status_code=404, detail="University not found.")
 
    try:
        url = upload_university_logo(contents, uni.slug, file.filename or uni.slug)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {str(e)}")
 
    uni.logo_url = url
    await db.commit()
 
    return {"university_id": str(university_id), "logo_url": url}
 
 
@router.post("/universities/{university_id}/campus-photo", tags=["admin", "images"])
async def upload_campus_photo_endpoint(
    university_id: PyUUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(require_admin),
):

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}.")
 
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 5MB.")
 
    result = await db.execute(select(University).where(University.id == university_id))
    uni = result.scalar_one_or_none()
    if not uni:
        raise HTTPException(status_code=404, detail="University not found.")
 
    try:
        url = upload_campus_photo(contents, uni.slug)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {str(e)}")
 
    uni.campus_photo = url
    await db.commit()
 
    return {"university_id": str(university_id), "campus_photo_url": url}

