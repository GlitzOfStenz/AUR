#  python -m database.cleanup_qs_legacy          (dry run, default)
#  python -m database.cleanup_qs_legacy --commit  (actually deletes)

import os
import json
import asyncio
import sys
import re
import argparse

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connections import AsyncSessionLocal
from database.models import University

DATA_PATH = os.path.join(os.path.dirname(__file__), "clean_universities.json")


def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9\s]", "", name)
    name = re.sub(r"\s+", "-", name.strip())
    return name[:80]


def official_slugs() -> set[str]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        records = json.load(f)
    slugs = set()
    for rec in records:
        name = (rec.get("name") or "").strip()
        country = (rec.get("country") or "").strip()
        if name:
            slugs.add(slugify(f"{name} {country}"))
    return slugs


async def run(session: AsyncSession, commit: bool) -> None:
    keep_slugs = official_slugs()
    print(f"Official dataset has {len(keep_slugs)} unique slugs")

    result = await session.execute(select(University))
    all_unis = result.scalars().all()
    print(f"Neon currently has {len(all_unis)} university rows")

    to_delete = [u for u in all_unis if u.slug not in keep_slugs]
    to_keep = [u for u in all_unis if u.slug in keep_slugs]

    print(f"Would delete: {len(to_delete)}")
    print(f"Would keep:   {len(to_keep)}")

    print("\nSample of rows that WOULD BE DELETED (first 10):")
    for u in to_delete[:10]:
        print(f"  - {u.name!r} ({u.country}) slug={u.slug}")

    print("\nSample of rows that WOULD BE KEPT (first 5):")
    for u in to_keep[:5]:
        print(f"  - {u.name!r} ({u.country}) slug={u.slug}")

    if not commit:
        print("\nDRY RUN — no changes made. Re-run with --commit to actually delete.")
        return

    print(f"\nCOMMIT MODE — deleting {len(to_delete)} rows (ranking_scores cascade automatically)...")
    for u in to_delete:
        await session.delete(u)
    await session.commit()
    print("Done.")

    result = await session.execute(select(University))
    remaining = result.scalars().all()
    print(f"Universities remaining after cleanup: {len(remaining)}")


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--commit", action="store_true", help="Actually delete rows (default is dry run)")
    args = parser.parse_args()

    async with AsyncSessionLocal() as session:
        await run(session, commit=args.commit)


if __name__ == "__main__":
    asyncio.run(main())