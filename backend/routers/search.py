from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from schemas import SearchResponse
from database.connections import get_db
from database.models import University as UniversityModel
from routers.universities import serialize, get_latest_year

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("/", response_model=SearchResponse)
async def search_universities(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    latest_year = await get_latest_year(db)
    prev_year = latest_year - 1

    pattern = f"%{q}%"
    result = await db.execute(
        select(UniversityModel)
        .where(
            or_(
                UniversityModel.name.ilike(pattern),
                UniversityModel.country.ilike(pattern),
            )
        )
        .limit(limit)
    )
    unis = result.scalars().all()

    data = []
    for uni in unis:
        current = next((rs for rs in uni.ranking_scores if rs.year == latest_year), None)
        previous = next((rs for rs in uni.ranking_scores if rs.year == prev_year), None)
        data.append(serialize(uni, current, previous))

    return {
        "query": q,
        "total": len(data),
        "data": data,
    }