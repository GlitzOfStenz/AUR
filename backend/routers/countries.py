from typing import List
from fastapi import APIRouter, HTTPException, Depends
from database.connections import get_redis
import redis.asyncio as aioredis
import json
from schemas import CountrySummary, CountryUniversitiesResponse

router = APIRouter(prefix="/api/countries", tags=["Countries"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES

@router.get("/", response_model=List[CountrySummary])
async def get_countries(
    redis: aioredis.Redis = Depends(get_redis),
):
    cache_key = "countries:list"

    try:
        cached_data = await redis.get(cache_key)

        if cached_data:
            return json.loads(cached_data)
    except Exception:
        pass

    data = get_data()
    country_map = {}

    for u in data:
        c = u["location"]
        if c not in country_map:
            country_map[c] = {
                "country": c,
                "university_count": 0,
                "subregion": u["subregion"]
            }
        country_map[c]["university_count"] += 1

    result = sorted(
        country_map.values(),
        key=lambda x: x["university_count"],
        reverse=True
    )
    try:
        await redis.setex(
            cache_key,
            300,
            json.dumps(result)
        )
    except Exception:
        pass

    return result

@router.get("/{country_name}", response_model=CountryUniversitiesResponse)
def get_universities_by_country(country_name: str):
    data = get_data()
    results = [u for u in data if u["location"].lower() == country_name.lower()]

    if not results:
        raise HTTPException(status_code=404, detail="Country not found")

    return {
        "country": country_name,
        "total": len(results),
        "data": results
    }
