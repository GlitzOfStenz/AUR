from fastapi import APIRouter, Query

from schemas import SearchResponse

router = APIRouter(prefix="/api/search", tags=["Search"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES

@router.get("/", response_model=SearchResponse)
def search_universities(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50)
):
    data = get_data()
    q_lower = q.lower()

    results = [
        u for u in data
        if q_lower in u["name"].lower() or q_lower in u["location"].lower()
    ]

    return {
        "query": q,
        "total": len(results),
        "data": results[:limit]
    }