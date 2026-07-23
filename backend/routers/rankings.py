from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from schemas import RankingsResponse
from database.connections import get_db
from database.models import University as UniversityModel
from routers.universities import serialize, get_latest_year

router = APIRouter(prefix="/api/rankings", tags=["Rankings"])

VALID_METRICS = [
    "overall", "citations", "employability", "teaching",
    "academicReputation", "employerReputation", "intlStudents",
    "papersPerFaculty", "staffWithPhd", "intlFaculty"
]


@router.get("/", response_model=RankingsResponse)
async def get_rankings(
    top: int = Query(100, ge=1, le=1533),
    metric: str = Query("overall"),
    country: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    latest_year = await get_latest_year(db)
    prev_year = latest_year - 1

    query = select(UniversityModel)
    if country:
        query = query.where(UniversityModel.country.ilike(country))

    result = await db.execute(query)
    unis = result.scalars().all()

    data = []
    for uni in unis:
        current = next((rs for rs in uni.ranking_scores if rs.year == latest_year), None)
        previous = next((rs for rs in uni.ranking_scores if rs.year == prev_year), None)
        data.append(serialize(uni, current, previous))

    if metric not in VALID_METRICS:
        metric = "overall"

    data = sorted(data, key=lambda u: u.get(metric) or 0, reverse=True)
    data = data[:top]

    return {
        "metric": metric,
        "total": len(data),
        "data": data,
    }