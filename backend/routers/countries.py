from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.connections import get_redis, get_db
from database.models import University as UniversityModel
import redis.asyncio as aioredis
import json
from schemas import CountrySummary, CountryUniversitiesResponse
from routers.universities import serialize, get_latest_year

router = APIRouter(prefix="/api/countries", tags=["Countries"])


@router.get("/", response_model=List[CountrySummary])
async def get_countries(
    redis: aioredis.Redis = Depends(get_redis),
    db: AsyncSession = Depends(get_db),
):
    cache_key = "countries:list"

    try:
        cached_data = await redis.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception:
        pass

    result = await db.execute(
        select(UniversityModel.country, UniversityModel.subregion)
    )
    rows = result.all()

    country_map = {}
    for country, subregion in rows:
        if not country:
            continue
        if country not in country_map:
            country_map[country] = {
                "country": country,
                "university_count": 0,
                "subregion": subregion or "",
            }
        country_map[country]["university_count"] += 1

    result_list = sorted(
        country_map.values(),
        key=lambda x: x["university_count"],
        reverse=True
    )

    try:
        await redis.setex(cache_key, 300, json.dumps(result_list))
    except Exception:
        pass

    return result_list


@router.get("/{country_name}", response_model=CountryUniversitiesResponse)
async def get_universities_by_country(country_name: str, db: AsyncSession = Depends(get_db)):
    latest_year = await get_latest_year(db)
    prev_year = latest_year - 1

    result = await db.execute(
        select(UniversityModel).where(func.lower(UniversityModel.country) == country_name.lower())
    )
    unis = result.scalars().all()

    if not unis:
        raise HTTPException(status_code=404, detail="Country not found")

    data = []
    for uni in unis:
        current = next((rs for rs in uni.ranking_scores if rs.year == latest_year), None)
        previous = next((rs for rs in uni.ranking_scores if rs.year == prev_year), None)
        data.append(serialize(uni, current, previous))

    return {
        "country": country_name,
        "total": len(data),
        "data": data,
    }