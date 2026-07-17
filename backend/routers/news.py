from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.connections import get_db
from schemas import NewsItemResponse, NewsListResponse, NewsFlashResponse
from services.gnews import fetch_external_news
from schemas import ExternalNewsResponse

router = APIRouter(
    prefix="/api/news",
    tags=["News"]
)

@router.get(
    "/flash",
    response_model=NewsFlashResponse
)
async def get_news_flash(
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns latest news for homepage.

    TODO:
    Query NewsItem table ordered by published_date DESC.
    """

    return {
        "data": []
    }

@router.get(
    "",
    response_model=NewsListResponse
)
async def get_news(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns paginated news.

    TODO:
    Replace placeholder with SQLAlchemy query.
    """

    return {
        "page": page,
        "limit": limit,
        "total": 0,
        "data": []
    }


@router.get(
    "/external",
    response_model=ExternalNewsResponse
)
async def get_external_news(
    limit: int = Query(10, ge=1, le=20),
):
    """
    Returns live external news about Asian universities, pulled from GNews.
    Always returns 200 with an empty list on any failure (missing key,
    GNews down, rate-limited, etc) — external news should never break the app.
    """
    articles = await fetch_external_news(limit=limit)
    return {"data": articles}
