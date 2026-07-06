from fastapi import APIRouter, Query

from schemas import RankingsResponse

router = APIRouter(prefix="/api/rankings", tags=["Rankings"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES

@router.get("/", response_model=RankingsResponse)
def get_rankings(
    top: int = Query(100, ge=1, le=1533),
    metric: str = Query("overall"),  # overall, citations, employability, etc.
    country: str = Query(None),
):
    data = get_data()

    if country:
        data = [u for u in data if u["location"].lower() == country.lower()]

    # Sort by chosen metric
    valid_metrics = [
        "overall", "citations", "employability", "teaching",
        "academicReputation", "employerReputation", "intlStudents",
        "papersPerFaculty", "staffWithPhd", "intlFaculty"
    ]
    if metric not in valid_metrics:
        metric = "overall"

    data = sorted(data, key=lambda u: u.get(metric) or 0, reverse=True)

    return {
        "metric": metric,
        "total": len(data[:top]),
        "data": data[:top]
    }