#  python -m backend.database.seed

import os
import asyncio
import sys
import re
import pandas as pd

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# ensure backend/ is on sys.path when run as a module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connections import AsyncSessionLocal
from database.models import RankingScore, University, MembershipTier

# need to change after the original data is added
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "qs_asia_2026.xlsx")


def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9\s]", "", name)
    name = re.sub(r"\s+", "-", name.strip())
    return name[:80]

def safe_float(val) -> float | None:
    try:
        f = float(val)
        return round(f, 1) if not pd.isna(f) else None
    except Exception:
        return None
    
def safe_int(val) -> int | None:
    try:
        raw = str(val).replace("=", "").strip()
        return int(float(raw))
    except Exception:
        return None
    
def load_dataframe() -> pd.DataFrame:
    df = pd.read_excel(DATA_PATH, header=2, skiprows=[3])
    df.columns = [
        "index", "rank_2026", "rank_2025", "institution", "country", "subregion",
        "subregional_rank", "size", "focus", "research_level", "status",
        "ar_score", "ar_rank",
        "er_score", "er_rank",
        "fsr_score", "fsr_rank",
        "irn_score", "irn_rank",
        "cpp_score", "cpp_rank",
        "ppf_score", "ppf_rank",
        "swp_score", "swp_rank",
        "ifr_score", "ifr_rank",
        "isr_score", "isr_rank",
        "inbound_score", "inbound_rank",
        "outbound_score", "outbound_rank",
        "overall_score",
    ]    
    return df

# seed logic
async def seed(session: AsyncSession) -> None:
    df = load_dataframe()
    
    inserted_universities = 0
    inserted_scores = 0
    skipped = 0

    for _, row in df.iterrows():
        name = str(row["institution"]).strip()
        if not name or name == "nan":
            skipped += 1
            continue

        country = str(row["country"]).strip()
        slug = slugify(name)

        # upsert university
        result = await session.execute(
            select(University).where(University.slug == slug)
        )

        uni = result.scalar_one_or_none()

        if uni is None:
            uni = University(
                name=name,
                slug=slug,
                country=country,
                subregion=str(row["subregion"]).strip() or None,
                size=str(row["size"]).strip() or None,
                focus=str(row["focus"]).strip() or None,
                research_level=str(row["research_level"]).strip() or None,
                is_public=str(row["status"]).strip().lower() == "public" ,
            )
            session.add(uni)
            await session.flush()  
            inserted_universities += 1
        
        # upsert ranking score for 2026
        result = await session.execute(
            select(RankingScore).where(
                RankingScore.university_id == uni.id,
                RankingScore.year == 2026
                )
        )
        score_2026 = result.scalar_one_or_none()

        if score_2026 is None:
            score_2026 = RankingScore(
                university_id  = uni.id,
                year           = 2026,
                rank           = safe_int(row["rank_2026"]),
                overall_score  = safe_float(row["overall_score"]),
                ar_score       = safe_float(row["ar_score"]),
                er_score       = safe_float(row["er_score"]),
                fsr_score      = safe_float(row["fsr_score"]),
                irn_score      = safe_float(row["irn_score"]),
                cpp_score      = safe_float(row["cpp_score"]),
                ppf_score      = safe_float(row["ppf_score"]),
                swp_score      = safe_float(row["swp_score"]),
                ifr_score      = safe_float(row["ifr_score"]),
                isr_score      = safe_float(row["isr_score"]),
                inbound_score  = safe_float(row["inbound_score"]),
                outbound_score = safe_float(row["outbound_score"]),
            )
            session.add(score_2026)
            inserted_scores += 1

        # upsert ranking score for 2025
        rank_2025 = safe_int(row["rank_2025"])
        if rank_2025 is not None:
            result = await session.execute(
                select(RankingScore).where(
                    RankingScore.university_id == uni.id,
                    RankingScore.year == 2025,
                )
            )
            score_2025 = result.scalar_one_or_none()
 
            if score_2025 is None:
                score_2025 = RankingScore(
                    university_id = uni.id,
                    year          = 2025,
                    rank          = rank_2025,
                )
                session.add(score_2025)
                inserted_scores += 1

    await session.commit()

    print(f"Seed Complete:")
    print(f"  Universities inserted : {inserted_universities}")
    print(f"  Ranking scores inserted: {inserted_scores}")
    print(f"  Rows skipped (empty)  : {skipped}")


async def seed_membership_tiers(session: AsyncSession) -> None:
    tiers_data = [
        {
            "name": "Basic",
            "price": 999,
            "duration_months": 12,
            "benefits": ["Profile verification", "Participation in events and awards"],
        },
        {
            "name": "Premium",
            "price": 2999,
            "duration_months": 12,
            "benefits": [
                "Profile verification",
                "Advanced analytics",
                "Institutional data submissions",
                "Participation in events and awards",
            ],
        },
    ]

    inserted_tiers = 0
    for tier_data in tiers_data:
        result = await session.execute(
            select(MembershipTier).where(MembershipTier.name == tier_data["name"])
        )
        tier = result.scalar_one_or_none()

        if tier is None:
            tier = MembershipTier(**tier_data)
            session.add(tier)
            inserted_tiers += 1

    await session.commit()
    print(f"Membership tiers inserted: {inserted_tiers}")

async def main() -> None:
    async with AsyncSessionLocal() as session:
        await seed(session)
        await seed_membership_tiers(session)


if __name__ == "__main__":
    asyncio.run(main())