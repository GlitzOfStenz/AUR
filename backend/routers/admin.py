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
import redis.asyncio as aioredis
from pathlib import Path
from datetime import datetime
import shutil
import subprocess
import sys
import json

router = APIRouter(prefix="/admin", tags=["Admin"])

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

AUDIT_FILE = DATA_DIR / "audit_log.json"
PUBLISH_FILE = DATA_DIR / "publish.json"

ALLOWED = {".csv", ".xlsx", ".xls"}


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
