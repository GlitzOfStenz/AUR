import os
import httpx
from typing import List
from schemas import ExternalNewsItem

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")
GNEWS_BASE_URL = "https://gnews.io/api/v4/search"


async def fetch_external_news(query: str = "higher education Asia", limit: int = 10) -> List[ExternalNewsItem]:
    """
    Calls GNews and returns a clean list of ExternalNewsItem.
    Never raises — on any failure (missing key, timeout, bad response),
    returns an empty list so the app keeps working.
    """
    if not GNEWS_API_KEY:
        return []

    params = {
        "q": query,
        "lang": "en",
        "max": limit,
        "apikey": GNEWS_API_KEY,
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(GNEWS_BASE_URL, params=params)
            response.raise_for_status()
            payload = response.json()
    except Exception:
        return []

    articles = payload.get("articles", [])
    results = []
    for article in articles:
        try:
            results.append(
                ExternalNewsItem(
                    title=article.get("title", ""),
                    description=article.get("description"),
                    url=article.get("url", ""),
                    source=(article.get("source") or {}).get("name"),
                    published_at=article.get("publishedAt"),
                    image=article.get("image"),
                )
            )
        except Exception:
            continue

    return results