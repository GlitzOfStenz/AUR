# Weights are loaded from engine/weights.json — not hardcoded here

import json
import os
from dataclasses import dataclass, field
from typing import Optional
 
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
 
from database.models import RankingScore, University


# weights config
_WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "weights.json")
with open(_WEIGHTS_PATH) as f:
    _CONFIG = json.load(f)
 
WEIGHTS: dict[str, float] = {k: v["weight"] for k, v in _CONFIG["weights"].items()}
METRIC_LABELS: dict[str, str] = {k: v["label"] for k, v in _CONFIG["weights"].items()}
METRIC_DESCRIPTIONS: dict[str, str] = {k: v["description"] for k, v in _CONFIG["weights"].items()}
WEIGHTS_VERSION: str = _CONFIG["version"]

# Data classes
@dataclass
class UniversityScore:
    university_id:  object
    name:           str
    slug:           str
    country:        str
    subregion:      Optional[str]
    overall_score:  Optional[float]
    asia_rank:      Optional[str]
    country_rank:   Optional[str]
    subregion_rank: Optional[str]
    metric_scores:  dict[str, Optional[float]] = field(default_factory=dict)
    percentiles:    dict[str, Optional[float]] = field(default_factory=dict)


# Weighted score calculator
def compute_weighted_score(
    metric_scores: dict[str, Optional[float]],
    weights: dict[str, float] = WEIGHTS,
) -> Optional[float]:
    
    weighted_sum = 0.0
    total_weight = 0.0
    for metric, weight in weights.items():
        score = metric_scores.get(metric)
        if score is not None:
            weighted_sum += score * weight
            total_weight += weight
    if total_weight == 0:
        return None
    return round(weighted_sum / total_weight, 2)

# Rank compuation
_BAND_THRESHOLDS: list[tuple[int, int]] = [
    (701, 710), (711, 720), (721, 730), (731, 740), (741, 750),
    (751, 760), (761, 770), (771, 780), (781, 790), (791, 800),
    (801, 850), (851, 900), (901, 950), (951, 1000),
    (1001, 1100), (1101, 1200), (1201, 1300), (1301, 1400), (1401, 1500),
]
_BAND_START = 701


def _band_rank(position: int) -> str:
    for low, high in _BAND_THRESHOLDS:
        if low <= position <= high:
            return f"{low}-{high}"
    return str(position)
 
 
def assign_ranks(
    scores: list[tuple[object, Optional[float]]],
) -> dict[object, Optional[str]]:
    ranked   = [(id_, s) for id_, s in scores if s is not None]
    unranked = [id_ for id_, s in scores if s is None]
    ranked.sort(key=lambda x: x[1], reverse=True)
 
    result: dict[object, Optional[str]] = {}
    position = 1
    i = 0
 
    while i < len(ranked):
        current_score = ranked[i][1]
        j = i
        while j < len(ranked) and ranked[j][1] == current_score:
            j += 1
        tie_count = j - i
 
        if position < _BAND_START:
            tie_prefix = "=" if tie_count > 1 else ""
            rank_str = f"{tie_prefix}{position}"
        else:
            rank_str = _band_rank(position)
 
        for k in range(i, j):
            result[ranked[k][0]] = rank_str
 
        position += tie_count
        i = j
 
    for id_ in unranked:
        result[id_] = None
 
    return result

def compute_percentiles(scores: list[Optional[float]]) -> list[Optional[float]]:
    valid = sorted([s for s in scores if s is not None])
    n = len(valid)
    if n == 0:
        return [None] * len(scores)
    result = []
    for score in scores:
        if score is None:
            result.append(None)
        else:
            below = sum(1 for s in valid if s < score)
            result.append(round((below / n) * 100, 1))
    return result
 
 
def compute_metric_percentiles(universities: list[UniversityScore]) -> None:
    for metric in WEIGHTS:
        scores = [u.metric_scores.get(metric) for u in universities]
        percentiles = compute_percentiles(scores)
        for uni, pct in zip(universities, percentiles):
            uni.percentiles[metric] = pct
 
 
async def run_ranking_pipeline(
    session: AsyncSession,
    year: int = 2026,
) -> list[UniversityScore]:
    result = await session.execute(
        select(University, RankingScore)
        .join(RankingScore, RankingScore.university_id == University.id)
        .where(RankingScore.year == year)
    )
    rows = result.all()
    if not rows:
        return []
 
    universities: list[UniversityScore] = []
    for uni, score in rows:
        metric_scores = {
            "ar_score":       score.ar_score,
            "er_score":       score.er_score,
            "fsr_score":      score.fsr_score,
            "cpp_score":      score.cpp_score,
            "ppf_score":      score.ppf_score,
            "irn_score":      score.irn_score,
            "swp_score":      score.swp_score,
            "ifr_score":      score.ifr_score,
            "isr_score":      score.isr_score,
            "inbound_score":  score.inbound_score,
            "outbound_score": score.outbound_score,
        }
        overall = score.overall_score or compute_weighted_score(metric_scores)
        universities.append(UniversityScore(
            university_id=uni.id, name=uni.name, slug=uni.slug,
            country=uni.country, subregion=uni.subregion,
            overall_score=overall, asia_rank=None,
            country_rank=None, subregion_rank=None,
            metric_scores=metric_scores,
        ))
 
    asia_ranks = assign_ranks([(u.university_id, u.overall_score) for u in universities])
    for u in universities:
        u.asia_rank = asia_ranks.get(u.university_id)
 
    by_country: dict[str, list[UniversityScore]] = {}
    for u in universities:
        by_country.setdefault(u.country, []).append(u)
    for group in by_country.values():
        ranks = assign_ranks([(u.university_id, u.overall_score) for u in group])
        for u in group:
            u.country_rank = ranks.get(u.university_id)
 
    by_subregion: dict[str, list[UniversityScore]] = {}
    for u in universities:
        by_subregion.setdefault(u.subregion or "Unknown", []).append(u)
    for group in by_subregion.values():
        ranks = assign_ranks([(u.university_id, u.overall_score) for u in group])
        for u in group:
            u.subregion_rank = ranks.get(u.university_id)
 
    compute_metric_percentiles(universities)
    universities.sort(key=lambda u: u.overall_score or 0, reverse=True)
    return universities
 
 
async def get_methodology(session: AsyncSession, year: int = 2026) -> dict:
    total  = await session.scalar(select(func.count()).select_from(University))
    ranked = await session.scalar(
        select(func.count()).select_from(RankingScore)
        .where(RankingScore.year == year, RankingScore.rank.isnot(None))
    )
    metrics = [
        {
            "key":         metric,
            "label":       METRIC_LABELS[metric],
            "description": METRIC_DESCRIPTIONS[metric],
            "weight":      WEIGHTS[metric],
            "weight_pct":  f"{round(WEIGHTS[metric] * 100, 1)}%",
        }
        for metric in WEIGHTS
    ]
    return {
        "version":             WEIGHTS_VERSION,
        "total_universities":  total or 0,
        "ranked_universities": ranked or 0,
        "year":                year,
        "metrics":             metrics,
    }