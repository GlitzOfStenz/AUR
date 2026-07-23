from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.connections import get_redis, get_db
from database.models import University as UniversityModel, RankingScore
import redis.asyncio as aioredis
import json

from schemas import (
    SummaryResponse,
    CountryCount,
    TopUniversity,
    SubregionCount,
    CountryAverageScore,
    TopMover
)
from routers.universities import get_latest_year

router = APIRouter(prefix="/api/insights", tags=["Insights"])


@router.get("/summary", response_model=SummaryResponse)
async def get_summary(
    redis: aioredis.Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db),
):
    cache_key = "analytics:summary"

    try:
        cached_data = await redis.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception:
        pass

    count_result = await db.execute(select(func.count(UniversityModel.id)))
    total = count_result.scalar_one()

    result = {"total_universities": total}

    try:
        await redis.setex(cache_key, 300, json.dumps(result))
    except Exception:
        pass

    return result


@router.get("/by-country", response_model=list[CountryCount])
async def by_country(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UniversityModel.country, func.count(UniversityModel.id))
        .where(UniversityModel.country.isnot(None))
        .group_by(UniversityModel.country)
        .order_by(func.count(UniversityModel.id).desc())
    )
    return [{"country": country, "count": count} for country, count in result.all()]


@router.get("/countries/top", response_model=list[CountryCount])
async def top_countries(limit: int = 10, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UniversityModel.country, func.count(UniversityModel.id))
        .where(UniversityModel.country.isnot(None))
        .group_by(UniversityModel.country)
        .order_by(func.count(UniversityModel.id).desc())
        .limit(limit)
    )
    return [{"country": country, "count": count} for country, count in result.all()]


@router.get("/top-universities", response_model=list[TopUniversity])
async def top_universities(limit: int = 10, db: AsyncSession = Depends(get_db)):
    latest_year = await get_latest_year(db)

    result = await db.execute(
        select(UniversityModel, RankingScore)
        .join(RankingScore, RankingScore.university_id == UniversityModel.id)
        .where(RankingScore.year == latest_year)
        .order_by(RankingScore.overall_score.desc())
        .limit(limit)
    )

    return [
        {
            "rank": rs.rank,
            "name": uni.name,
            "country": uni.country,
            "overall": rs.overall_score,
        }
        for uni, rs in result.all()
    ]


@router.get("/by-subregion", response_model=list[SubregionCount])
async def by_subregion(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UniversityModel.subregion, func.count(UniversityModel.id))
        .where(UniversityModel.subregion.isnot(None))
        .group_by(UniversityModel.subregion)
        .order_by(func.count(UniversityModel.id).desc())
    )
    return [{"subregion": subregion, "count": count} for subregion, count in result.all()]


@router.get("/country-average-score", response_model=list[CountryAverageScore])
async def country_average_score(db: AsyncSession = Depends(get_db)):
    latest_year = await get_latest_year(db)

    result = await db.execute(
        select(UniversityModel.country, func.avg(RankingScore.overall_score))
        .join(RankingScore, RankingScore.university_id == UniversityModel.id)
        .where(RankingScore.year == latest_year, RankingScore.overall_score.isnot(None))
        .group_by(UniversityModel.country)
        .order_by(func.avg(RankingScore.overall_score).desc())
    )

    return [
        {"country": country, "average_score": round(float(avg), 2)}
        for country, avg in result.all()
    ]


@router.get("/top-movers", response_model=list[TopMover])
async def top_movers(limit: int = 10, db: AsyncSession = Depends(get_db)):
    latest_year = await get_latest_year(db)
    prev_year = latest_year - 1

    result = await db.execute(select(UniversityModel))
    unis = result.scalars().all()

    movers = []
    for uni in unis:
        current = next((rs for rs in uni.ranking_scores if rs.year == latest_year), None)
        previous = next((rs for rs in uni.ranking_scores if rs.year == prev_year), None)

        if current and previous and current.rank is not None and previous.rank is not None:
            improvement = previous.rank - current.rank
            movers.append({
                "id": str(uni.id),
                "name": uni.name,
                "country": uni.country,
                "rank_2026": current.rank,
                "rank_2025": previous.rank,
                "improvement": improvement,
            })

    movers.sort(key=lambda x: x["improvement"], reverse=True)
    return movers[:limit]