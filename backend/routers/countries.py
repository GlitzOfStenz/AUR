from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/countries", tags=["Countries"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES

@router.get("/")
def get_countries():
    data = get_data()
    country_map = {}
    for u in data:
        c = u["location"]
        if c not in country_map:
            country_map[c] = {"country": c, "university_count": 0, "subregion": u["subregion"]}
        country_map[c]["university_count"] += 1

    return sorted(country_map.values(), key=lambda x: x["university_count"], reverse=True)

@router.get("/{country_name}")
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