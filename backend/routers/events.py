import json
import shutil
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.connections import get_db
from database.models import Event, Application, JudgeScore, User, University
from auth.middleware import require_admin
from schemas import (
    EventCreate, EventResponse,
    ApplicationResponse,
    JudgeScoreCreate,
    FinalScoreResponse,
)

router = APIRouter(prefix="/api/events-awards", tags=["Events & Awards"])

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "data" / "applications"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

WEIGHTS_FILE = BASE_DIR / "engine" / "award_weights.json"
WEIGHTS = json.loads(WEIGHTS_FILE.read_text())["weights"]


@router.get("/", response_model=list[EventResponse])
async def list_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).order_by(Event.deadline.asc()))
    return result.scalars().all()


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/", response_model=EventResponse, status_code=201)
async def create_event(
    payload: EventCreate,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    event = Event(**payload.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


@router.post("/applications", response_model=ApplicationResponse, status_code=201)
async def submit_application(
    event_id: str = Form(...),
    university_id: str = Form(...),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    if not result.scalar_one_or_none():
      raise HTTPException(status_code=404, detail="Event not found")

    result = await db.execute(select(University).where(University.id == university_id))
    if not result.scalar_one_or_none():
      raise HTTPException(status_code=404, detail="University not found")

    saved_paths = []
    for f in files:
        dest = UPLOAD_DIR / f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{f.filename}"
        with open(dest, "wb") as out:
            shutil.copyfileobj(f.file, out)
        saved_paths.append(str(dest.relative_to(BASE_DIR)))

    application = Application(
        event_id=event_id,
        university_id=university_id,
        documents=saved_paths,
        status="submitted",
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/applications/{application_id}", response_model=ApplicationResponse)
async def get_application_status(application_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.post("/applications/{application_id}/score", status_code=201)
async def submit_judge_score(
    application_id: str,
    payload: JudgeScoreCreate,
    current_admin: User = Depends(require_admin),   # admin enters scores on judges' behalf
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Application).where(Application.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    score = JudgeScore(application_id=application_id, **payload.model_dump())
    db.add(score)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=400, detail="This judge already scored this application")
    await db.refresh(score)

    application.status = "under_review"
    await db.commit()
    return score


@router.get("/applications/{application_id}/final-score", response_model=FinalScoreResponse)
async def get_final_score(application_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(JudgeScore).where(JudgeScore.application_id == application_id)
    )
    scores = result.scalars().all()
    if not scores:
        raise HTTPException(status_code=404, detail="No scores submitted yet")

    total = 0.0
    for s in scores:
        for field, cfg in WEIGHTS.items():
            total += float(getattr(s, field)) * cfg["weight"]
    final = total / len(scores)

    return FinalScoreResponse(
        application_id=application_id,
        final_score=round(final, 2),
        judges_count=len(scores),
    )


@router.patch("/applications/{application_id}/publish", response_model=ApplicationResponse)
async def publish_result(
    application_id: str,
    is_winner: bool,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Application).where(Application.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.status = "winner" if is_winner else "rejected"
    await db.commit()
    await db.refresh(application)
    return application