from fastapi import APIRouter, Depends
from collections import Counter
from database.connections import get_redis
import redis.asyncio as aioredis
import json

from schemas import (
    SummaryResponse,
    CountryCount,
    TopUniversity,
    SubregionCount,
    CountryAverageScore
)

router = APIRouter(prefix="/api/insights", tags=["Insights"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES

@router.get("/summary", response_model=SummaryResponse)
async def get_summary(
    redis: aioredis.Redis = Depends(get_redis),
):
    cache_key = "analytics:summary"

    try:
        cached_data = await redis.get(cache_key)

        if cached_data:
            return json.loads(cached_data)
    except Exception:
        pass

    data = get_data()

    result = {
        "total_universities": len(data)
    }

    try:
        await redis.setex(
            cache_key,
            300,
            json.dumps(result)
        )
    except Exception:
        pass

    return result

@router.get("/by-country", response_model=list[CountryCount])
def by_country():
    data = get_data()

    country_count = Counter()

    for uni in data:
        country = uni.get("location")

        if country:
            country_count[country] += 1

    return sorted(
        [
            {
                "country": country,
                "count": count
            }
            for country, count in country_count.items()
        ],
        key=lambda x: x["count"],
        reverse=True
    )

@router.get("/countries/top", response_model=list[CountryCount])
def top_countries(limit: int = 10):
    data = get_data()

    country_count = Counter()

    for uni in data:
        country = uni.get("location")

        if country:
            country_count[country] += 1

    return [
        {
            "country": country,
            "count": count
        }
        for country, count in country_count.most_common(limit)
    ]

@router.get("/top-universities", response_model=list[TopUniversity])
def top_universities(limit: int = 10):
    data = get_data()

    sorted_data = sorted(
        data,
        key=lambda x: float(x.get("overall", 0) or 0),
        reverse=True
    )

    return [
        {
            "rank": uni.get("rank"),
            "name": uni.get("name"),
            "country": uni.get("location"),
            "overall": uni.get("overall")
        }
        for uni in sorted_data[:limit]
    ]

@router.get("/by-subregion", response_model=list[SubregionCount])
def by_subregion():
    data = get_data()

    result = {}

    for uni in data:
        subregion = uni.get("subregion")

        if not subregion:
            continue

        result[subregion] = result.get(subregion, 0) + 1

    return sorted(
        [
            {
                "subregion": subregion,
                "count": count
            }
            for subregion, count in result.items()
        ],
        key=lambda x: x["count"],
        reverse=True
    )

@router.get("/country-average-score", response_model=list[CountryAverageScore])
def country_average_score():
    data = get_data()

    scores = {}

    for uni in data:
        country = uni.get("location")
        score = uni.get("overall")

        if score is None:
            continue

        try:
            score = float(score)
        except:
            continue

        if country not in scores:
            scores[country] = []

        scores[country].append(score)

    result = []

    for country, values in scores.items():
        result.append({
            "country": country,
            "average_score": round(sum(values) / len(values), 2)
        })

    return sorted(
        result,
        key=lambda x: x["average_score"],
        reverse=True
    )