from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from schemas import University, UniversityListResponse
from database.connections import get_db
from database.models import University as UniversityModel

router = APIRouter(prefix="/api/universities", tags=["Universities"])

def get_data():
    from data_loader import UNIVERSITIES
    return UNIVERSITIES

@router.get("/", response_model=UniversityListResponse)
def get_all_universities(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    country: str = Query(None),
    status: str = Query(None),  # "public" or "private"
):
    data = get_data()

    if country:
        data = [u for u in data if u["location"].lower() == country.lower()]
    if status:
        is_public = status.lower() == "public"
        data = [u for u in data if u["isPublic"] == is_public]

    total = len(data)
    start = (page - 1) * limit
    end = start + limit

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": data[start:end]
    }

@router.get("/directory", response_model=list[dict])
async def get_directory_universities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UniversityModel).order_by(UniversityModel.name))
    unis = result.scalars().all()
    return [{"id": str(u.id), "name": u.name} for u in unis]

@router.get("/{uni_id}", response_model=University)
def get_university(uni_id: str):
    data = get_data()
    uni = next((u for u in data if u["id"] == uni_id), None)
    if not uni:
        raise HTTPException(status_code=404, detail="University not found")
    return uni
