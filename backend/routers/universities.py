from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from schemas import University, UniversityListResponse
from database.connections import get_db
from database.models import University as UniversityModel, RankingScore

router = APIRouter(prefix="/api/universities", tags=["Universities"])

# Universities are ranked yearly; this is the year the frontend should show
# by default. If you seed a new year later, bump this (or better, make it
# dynamic — see get_latest_year() below).
CURRENT_RANKING_YEAR = 2026


async def get_latest_year(db: AsyncSession) -> int:
    """Fall back to whatever the newest seeded ranking year actually is,
    in case CURRENT_RANKING_YEAR ever drifts out of sync with the data."""
    result = await db.execute(select(func.max(RankingScore.year)))
    year = result.scalar_one_or_none()
    return year or CURRENT_RANKING_YEAR


def serialize(uni: UniversityModel, current: RankingScore | None, previous: RankingScore | None) -> dict:
    history = []
    if current:
        history.append(current.rank)
    if previous:
        history.append(previous.rank)

    return {
        "id": str(uni.id),
        "name": uni.name,
        "location": uni.country or "",
        "subregion": uni.subregion or "",
        "rank": current.rank if current else None,
        "rank_2025": previous.rank if previous else None,
        "history": history,
        "size": uni.size or "",
        "focus": uni.focus or "",
        "research": uni.research_level or "",
        "isPublic": bool(uni.is_public) if uni.is_public is not None else True,
        "overall": current.overall_score if current else None,
        "academicReputation": current.ar_score if current else None,
        "employerReputation": current.er_score if current else None,
        "employability": current.graduate_employability_score if current else None,
        "facultyStudentRatio": current.fsr_score if current else None,
        "teaching": current.fsr_score if current else None,
        "citations": current.cpp_score if current else None,
        "intlStudents": current.isr_score if current else None,
        "intlFaculty": current.ifr_score if current else None,
        "papersPerFaculty": current.ppf_score if current else None,
        "staffWithPhd": current.swp_score if current else None,
        "intlResearchNetwork": current.irn_score if current else None,
        "inboundExchange": current.inbound_score if current else None,
        "outboundExchange": current.outbound_score if current else None,
        "subjects": [],
        "languages": [],
        "tuition": float(uni.avg_fees) if uni.avg_fees is not None else None,
        "description": uni.description,
        "programs": [],
        "campusPhoto": uni.campus_photo,
        "hasMedicine": uni.has_medicine,
        "hasScholarship": uni.has_scholarship,
    }


@router.get("/", response_model=UniversityListResponse)
async def get_all_universities(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    country: str = Query(None),
    status: str = Query(None),  # "public" or "private"
    db: AsyncSession = Depends(get_db),
):
    latest_year = await get_latest_year(db)
    prev_year = latest_year - 1

    query = select(UniversityModel)
    if country:
        query = query.where(func.lower(UniversityModel.country) == country.lower())
    if status:
        is_public = status.lower() == "public"
        query = query.where(UniversityModel.is_public == is_public)

    count_result = await db.execute(query)
    all_matched = count_result.scalars().all()
    total = len(all_matched)

    start = (page - 1) * limit
    end = start + limit
    page_unis = all_matched[start:end]

    data = []
    for uni in page_unis:
        current = next((rs for rs in uni.ranking_scores if rs.year == latest_year), None)
        previous = next((rs for rs in uni.ranking_scores if rs.year == prev_year), None)
        data.append(serialize(uni, current, previous))

    # sort by current rank (nulls last) to match expected ranking order
    data.sort(key=lambda u: (u["rank"] is None, u["rank"]))

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": data,
    }


@router.get("/directory", response_model=list[dict])
async def get_directory_universities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UniversityModel).order_by(UniversityModel.name))
    unis = result.scalars().all()
    return [{"id": str(u.id), "name": u.name} for u in unis]


@router.get("/{uni_id}", response_model=University)
async def get_university(uni_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UniversityModel).where(UniversityModel.id == uni_id))
    uni = result.scalar_one_or_none()
    if not uni:
        raise HTTPException(status_code=404, detail="University not found")

    latest_year = await get_latest_year(db)
    prev_year = latest_year - 1
    current = next((rs for rs in uni.ranking_scores if rs.year == latest_year), None)
    previous = next((rs for rs in uni.ranking_scores if rs.year == prev_year), None)

    return serialize(uni, current, previous)