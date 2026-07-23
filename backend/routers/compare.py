from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from schemas import CompareResponse
from database.connections import get_db
from database.models import University as UniversityModel
from routers.universities import serialize, get_latest_year

router = APIRouter(prefix="/api/compare", tags=["Compare"])


@router.get("/", response_model=CompareResponse)
async def compare_universities(
    ids: str = Query(..., description="Comma separated university UUIDs"),
    db: AsyncSession = Depends(get_db),
):
    id_list = [i.strip() for i in ids.split(",")]

    if len(id_list) < 2:
        raise HTTPException(status_code=422, detail="Please provide at least 2 university IDs")

    if len(id_list) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 universities can be compared at once")

    latest_year = await get_latest_year(db)
    prev_year = latest_year - 1

    result = await db.execute(
        select(UniversityModel).where(UniversityModel.id.in_(id_list))
    )
    unis = result.scalars().all()
    found_ids = {str(u.id) for u in unis}
    not_found = [i for i in id_list if i not in found_ids]

    if not_found:
        raise HTTPException(status_code=404, detail=f"Universities not found: {', '.join(not_found)}")

    results = []
    for uni_id in id_list:
        uni = next(u for u in unis if str(u.id) == uni_id)
        current = next((rs for rs in uni.ranking_scores if rs.year == latest_year), None)
        previous = next((rs for rs in uni.ranking_scores if rs.year == prev_year), None)
        results.append(serialize(uni, current, previous))

    return {
        "count": len(results),
        "universities": results,
    }