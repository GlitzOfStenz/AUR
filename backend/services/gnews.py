import os
import re
import httpx
from typing import List
from schemas import ExternalNewsItem

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")
GNEWS_BASE_URL = "https://gnews.io/api/v4/search"

# --- Topic relevance keywords ---
HIGHER_ED_KEYWORDS = [
    "university", "college", "higher education", "academic ranking",
    "campus", "faculty", "research institute", "graduate program",
    "phd", "undergraduate", "postgraduate", "vice chancellor",
    "provost", "academic", "enrollment", "admissions"
]

ASIA_KEYWORDS = [
    "china", "chinese", "india", "indian", "japan", "japanese",
    "korea", "korean", "singapore", "hong kong", "malaysia",
    "thailand", "philippines", "indonesia", "vietnam", "taiwan",
    "asia", "asian", "bangladesh", "pakistan", "sri lanka"
]

NON_ASIA_EXCLUSION_KEYWORDS = [
    "middle east", "africa", "african", "european union", "latin america",
    "united kingdom", "uk government", "north america"
]

# --- Distressing content exclusion (student safety) ---
DISTRESSING_KEYWORDS = [
    "suicide", "suicidal", "self-harm", "self harm", "kill himself",
    "kill herself", "killed himself", "killed herself",
    "took his own life", "took her own life", "found dead",
    "hanging", "overdose", "self-immolation", "assault", "rape",
    "murder", "murdered", "shooting", "shot dead", "stabbing",
    "stabbed", "sexual harassment", "sexually assaulted",
    "abuse scandal", "molest", "domestic violence", "ragging death",
    "mob lynching", "terror attack", "bomb blast"
]


def _extract_text(article: dict) -> str:
    return f"{article.get('title', '')} {article.get('description', '')}".lower()


def _matches_any(text: str, keywords: List[str]) -> bool:
    for kw in keywords:
        if re.search(r"\b" + re.escape(kw) + r"\b", text):
            return True
    return False


def is_distressing(article: dict) -> bool:
    return _matches_any(_extract_text(article), DISTRESSING_KEYWORDS)


def is_relevant(article: dict) -> bool:
    text = _extract_text(article)
    has_higher_ed = _matches_any(text, HIGHER_ED_KEYWORDS)
    has_asia = _matches_any(text, ASIA_KEYWORDS)
    has_non_asia_region = _matches_any(text, NON_ASIA_EXCLUSION_KEYWORDS)

    if has_non_asia_region and not has_asia:
        return False
    return has_higher_ed and has_asia


def filter_articles(articles: List[dict]) -> List[dict]:
    filtered = []
    for article in articles:
        if is_distressing(article):
            continue
        if is_relevant(article):
            filtered.append(article)
    return filtered


async def fetch_external_news(query: str = "higher education Asia university", limit: int = 10) -> List[ExternalNewsItem]:
    if not GNEWS_API_KEY:
        return []

    fetch_count = min(limit * 3, 25)

    params = {
        "q": query,
        "lang": "en",
        "max": fetch_count,
        "apikey": GNEWS_API_KEY,
        "in": "title,description",
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(GNEWS_BASE_URL, params=params)
            response.raise_for_status()
            payload = response.json()
    except Exception as e:
        print(f"GNEWS ERROR: {type(e).__name__}: {e}")
        return []

    raw_articles = payload.get("articles", [])
    safe_relevant_articles = filter_articles(raw_articles)

    results = []
    for article in safe_relevant_articles[:limit]:
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