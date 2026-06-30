from fastapi import APIRouter
from collections import Counter

router = APIRouter(prefix="/api/insights", tags=["Insights"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES


@router.get("/summary")
def get_summary():
    data = get_data()

    return {
        "total_universities": len(data)
    }

@router.get("/by-country")
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

@router.get("/countries/top")
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

@router.get("/top-universities")
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

@router.get("/by-subregion")
def by_subregion():
    data = get_data()

    result = {}

    for uni in data:
        region = uni.get("subregion")

        if region not in result:
            result[region] = 0

        result[region] += 1

    return result

@router.get("/country-average-score")
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