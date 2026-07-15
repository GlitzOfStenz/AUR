from fastapi import APIRouter, Depends
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import MethodologyVersion, User
from schemas import MethodologyVersionResponse, MethodologyVersionCreate
from database.connections import get_db
from auth.middleware import require_admin
from services.notifications import create_notification

router = APIRouter(prefix="/api/methodology", tags=["Methodology"])


@router.get("/version-history", response_model=list[MethodologyVersionResponse])
async def get_version_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MethodologyVersion).order_by(MethodologyVersion.release_date.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=MethodologyVersionResponse, status_code=201)
async def publish_methodology_version(
    payload: MethodologyVersionCreate,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if payload.is_current:
        # unset any existing current version before setting the new one
        await db.execute(
            update(MethodologyVersion)
            .where(MethodologyVersion.is_current == True)
            .values(is_current=False)
        )

    new_version = MethodologyVersion(**payload.model_dump())
    db.add(new_version)

    await create_notification(
        db=db,
        title="Methodology Updated",
        description=f"Version {new_version.version} of the ranking methodology has been published.",
        category="methodology",
    )

    await db.commit()
    await db.refresh(new_version)

    return new_version