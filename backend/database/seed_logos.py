"""
Supports two folder structures:
 
Structure A — country-grouped logos 
Structure B — university-named folders
"""
 
import asyncio
import os
import re
import sys
from pathlib import Path
 
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
 
from sqlalchemy import select
from sqlalchemy.orm import noload
from sqlalchemy.ext.asyncio import AsyncSession
 
from database.connections import AsyncSessionLocal
from database.models import University
from services.cloudinary import upload_university_logo, upload_campus_photo
 
LOGOS_DIR = os.getenv("LOGOS_DIR")   # Structure A
UNI_DIR   = os.getenv("UNI_DIR")     # Structure B
 
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg"}
 
 
def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9\s]", "", name)
    name = re.sub(r"\s+", "-", name.strip())
    return name[:100]
 
 
async def find_university(session: AsyncSession, name: str):
    slug = slugify(name)
    result = await session.execute(
            select(University)
            .options(noload("*"))
            .where(University.slug == slug))

    uni = result.scalar_one_or_none()
    if uni:
        return uni
    result = await session.execute(
        select(University)
        .options(noload("*"))
        .where(University.name.ilike(f"%{name}%"))
    )
    matches = result.scalars().all()
    
    if len(matches) == 1:
        return matches[0]
    
    # Multiple or zero matches — skip, don't guess
    if len(matches) > 1:
        print(f"  ! ambiguous: '{name}' matched {len(matches)} universities — skipping")
    
    return None
 
 
async def upload_logo_for(uni_id, slug: str, file_bytes: bytes, filename: str) -> str:
    return upload_university_logo(file_bytes, slug, filename)
 
 
async def upload_campus_for(slug: str, file_bytes: bytes) -> str:
    return upload_campus_photo(file_bytes, slug)
 
 
async def seed_structure_a(logos_dir: Path) -> tuple[int, int, list]:
    uploaded = skipped = 0
    not_found = []
 
    for country_dir in sorted(logos_dir.iterdir()):
        if not country_dir.is_dir():
            continue
        print(f"\n[A] Country: {country_dir.name}")
 
        for logo_file in sorted(country_dir.iterdir()):
            if logo_file.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue
 
            uni_name = logo_file.stem
 
            async with AsyncSessionLocal() as session:
                try:
                    uni = await find_university(session, uni_name)
                    if uni is None:
                        not_found.append(f"{country_dir.name}/{uni_name}")
                        skipped += 1
                        continue
 
                    file_bytes = logo_file.read_bytes()
                    url = upload_university_logo(file_bytes, uni.slug, logo_file.name)
 

                    uni.logo_url = url
                    await session.commit()
                    print(f"  ✓ logo  {uni_name}")
                    uploaded += 1
 
                except Exception as e:
                    await session.rollback()
                    print(f"  ✗ {uni_name} — {e}")
                    skipped += 1
 
    return uploaded, skipped, not_found
 
 
async def seed_structure_b(uni_dir: Path) -> tuple[int, int, list]:
    uploaded = skipped = 0
    not_found = []
 
    for uni_folder in sorted(uni_dir.iterdir()):
        if not uni_folder.is_dir():
            continue
 
        uni_name = uni_folder.name
 
        logo_file = next(
            (f for f in uni_folder.iterdir()
             if f.stem.lower() == "logo" and f.suffix.lower() in SUPPORTED_EXTENSIONS),
            None
        )
        campus_file = next(
            (f for f in uni_folder.iterdir()
             if f.stem.lower() == "campus" and f.suffix.lower() in SUPPORTED_EXTENSIONS),
            None
        )
 
        if not logo_file and not campus_file:
            print(f"  ! no files found in {uni_name}/")
            skipped += 1
            continue
 

        async with AsyncSessionLocal() as session:
            try:
                uni = await find_university(session, uni_name)
                if uni is None:
                    not_found.append(uni_name)
                    skipped += 1
                    continue
 
                if logo_file:
                    try:
                        url = upload_university_logo(
                            logo_file.read_bytes(), uni.slug, logo_file.name
                        )
                        uni.logo_url = url
                        print(f"  ✓ logo    {uni_name}")
                        uploaded += 1
                    except Exception as e:
                        print(f"  ✗ logo    {uni_name} — {e}")
                        skipped += 1
 
                if campus_file:
                    try:
                        url = upload_campus_photo(campus_file.read_bytes(), uni.slug)
                        uni.campus_photo = url
                        print(f"  ✓ campus  {uni_name}")
                        uploaded += 1
                    except Exception as e:
                        print(f"  ✗ campus  {uni_name} — {e}")
                        skipped += 1
 
                await session.commit()
 
            except Exception as e:
                await session.rollback()
                print(f"  ✗ {uni_name} — session error: {e}")
                skipped += 1
 
    return uploaded, skipped, not_found
 
 
async def main() -> None:
    if not LOGOS_DIR and not UNI_DIR:
        print("Error: set LOGOS_DIR (structure A) or UNI_DIR (structure B) env variable.")
        sys.exit(1)
 
    total_uploaded = total_skipped = 0
    total_not_found = []
 
    if LOGOS_DIR:
        print(f"=== Structure A: {LOGOS_DIR} ===")
        u, s, nf = await seed_structure_a(Path(LOGOS_DIR))
        total_uploaded += u
        total_skipped  += s
        total_not_found += nf
 
    if UNI_DIR:
        print(f"\n=== Structure B: {UNI_DIR} ===")
        u, s, nf = await seed_structure_b(Path(UNI_DIR))
        total_uploaded += u
        total_skipped  += s
        total_not_found += nf
 
    print(f"\n{'='*50}")
    print(f"Seed complete:")
    print(f"  Uploaded  : {total_uploaded}")
    print(f"  Skipped   : {total_skipped}")
    if total_not_found:
        print(f"\nNot matched in DB ({len(total_not_found)}):")
        for name in total_not_found:
            print(f"  - {name}")
 
 
if __name__ == "__main__":
    asyncio.run(main())