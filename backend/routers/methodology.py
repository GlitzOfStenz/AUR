from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import MethodologyVersion
from schemas import MethodologyVersionResponse
from database.connections import get_db

router = APIRouter(prefix="/api/methodology", tags=["Methodology"])


@router.get("/version-history", response_model=list[MethodologyVersionResponse])
async def get_version_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MethodologyVersion).order_by(MethodologyVersion.release_date.desc())
    )
    return result.scalars().all()