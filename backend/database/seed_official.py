#  python -m backend.database.seed_official

import os
import json
import asyncio
import sys
import re

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# ensure backend/ is on sys.path when run as a module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connections import AsyncSessionLocal
from database.models import RankingScore, University

DATA_PATH = os.path.join(os.path.dirname(__file__), "clean_universities.json")

RANKING_YEAR = 2026


def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9\s]", "", name)
    name = re.sub(r"\s+", "-", name.strip())
    return name[:80]


def safe_float(val) -> float | None:
    if val is None:
        return None
    try:
        return round(float(val), 2)
    except (TypeError, ValueError):
        return None


def safe_int(val) -> int | None:
    if val is None:
        return None
    try:
        return int(round(float(val)))
    except (TypeError, ValueError):
        return None


def load_records() -> list[dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


async def seed(session: AsyncSession) -> None:
    records = load_records()

    inserted_universities = 0
    updated_universities = 0
    inserted_scores = 0
    updated_scores = 0
    skipped = 0

    for rec in records:
        name = (rec.get("name") or "").strip()
        if not name:
            skipped += 1
            continue

        country = (rec.get("country") or "").strip()
        # re-slugify here (rather than trusting the slug baked into the json)
        # so upsert identity always matches this script's slugify(), same
        # convention as the old seed.py
        slug = slugify(f"{name} {country}")

        # upsert university
        result = await session.execute(
            select(University).where(University.slug == slug)
        )
        uni = result.scalar_one_or_none()

        if uni is None:
            uni = University(
                name=name,
                slug=slug,
                country=country or None,
                city=rec.get("city"),
                is_public=rec.get("is_public"),
                established_year=safe_int(rec.get("established_year")),
                total_students=safe_int(rec.get("total_students")),
                total_faculty=safe_int(rec.get("total_faculty")),
                placement_percentage=safe_float(rec.get("placement_percentage")),
                website_url=rec.get("website_url"),
            )
            session.add(uni)
            await session.flush()
            inserted_universities += 1
        else:
            # university already exists (e.g. re-run, or already present from
            # a prior QS import) — fill in previously-null fields rather than
            # overwrite fields that already have a value
            if uni.city is None:
                uni.city = rec.get("city")
            if uni.is_public is None:
                uni.is_public = rec.get("is_public")
            if uni.established_year is None:
                uni.established_year = safe_int(rec.get("established_year"))
            if uni.total_students is None:
                uni.total_students = safe_int(rec.get("total_students"))
            if uni.total_faculty is None:
                uni.total_faculty = safe_int(rec.get("total_faculty"))
            if uni.placement_percentage is None:
                uni.placement_percentage = safe_float(rec.get("placement_percentage"))
            if uni.website_url is None:
                uni.website_url = rec.get("website_url")
            updated_universities += 1

        # upsert ranking score for RANKING_YEAR
        ranking = rec.get("ranking") or {}
        result = await session.execute(
            select(RankingScore).where(
                RankingScore.university_id == uni.id,
                RankingScore.year == RANKING_YEAR,
            )
        )
        score = result.scalar_one_or_none()

        score_fields = dict(
            rank=safe_int(ranking.get("rank")),
            overall_score=safe_float(ranking.get("overall_score")),
            ar_score=safe_float(ranking.get("ar_score")),
            er_score=safe_float(ranking.get("er_score")),
            fsr_score=safe_float(ranking.get("fsr_score")),
            irn_score=safe_float(ranking.get("irn_score")),
            cpp_score=safe_float(ranking.get("cpp_score")),
            # ifr_score / isr_score intentionally left RAW/unnormalized —
            # some sheets are fractions (0.09), some are already percentages
            # (13.0) — do NOT auto-normalize, per handoff doc decision
            ifr_score=safe_float(ranking.get("ifr_score")),
            isr_score=safe_float(ranking.get("isr_score")),
            research_output_score=safe_float(ranking.get("research_output_score")),
            research_impact_score=safe_float(ranking.get("research_impact_score")),
            graduate_employability_score=safe_float(ranking.get("graduate_employability_score")),
            industry_income_score=safe_float(ranking.get("industry_income_score")),
            the_rank=ranking.get("the_rank"),
            # ppf_score / swp_score / inbound_score / outbound_score not in
            # this dataset — stay null, same as old seed.py's behavior for
            # fields it doesn't have data for
        )

        if score is None:
            score = RankingScore(
                university_id=uni.id,
                year=RANKING_YEAR,
                **score_fields,
            )
            session.add(score)
            inserted_scores += 1
        else:
            # re-run safe: only fill fields that are currently null, don't
            # clobber any value already there
            for field, value in score_fields.items():
                if value is not None and getattr(score, field) is None:
                    setattr(score, field, value)
            updated_scores += 1

    await session.commit()

    print("Seed Official Complete:")
    print(f"  Universities inserted : {inserted_universities}")
    print(f"  Universities matched (existing) : {updated_universities}")
    print(f"  Ranking scores inserted: {inserted_scores}")
    print(f"  Ranking scores matched (existing): {updated_scores}")
    print(f"  Rows skipped (no name)  : {skipped}")


async def main() -> None:
    async with AsyncSessionLocal() as session:
        await seed(session)


if __name__ == "__main__":
    asyncio.run(main())