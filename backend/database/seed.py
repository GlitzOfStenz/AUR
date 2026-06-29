"""
seed.py — Creates all tables in the PostgreSQL database.
Run once: python -m backend.database.seed
"""

import asyncio
from database.connections import engine
from database.models import Base


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created: users, saved_universities")


if __name__ == "__main__":
    asyncio.run(init_db())