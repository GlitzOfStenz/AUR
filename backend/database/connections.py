import os
from pathlib import Path
import redis.asyncio as aioredis
from dotenv import load_dotenv
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base

load_dotenv()

DEFAULT_SQLITE_PATH = Path(__file__).resolve().parent.parent / "university_db.sqlite"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{DEFAULT_SQLITE_PATH.as_posix()}")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# PostgreSQL async engine
engine_options = {"echo": True, "pool_pre_ping": True}
if not DATABASE_URL.startswith("sqlite"):
    engine_options.update(pool_size=10, max_overflow=20)

engine = create_async_engine(DATABASE_URL, **engine_options)

# Session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Redis client
redis_client = aioredis.from_url(REDIS_URL, decode_responses=True)

# Lifecycle helpers
async def close_db() -> None:
    await engine.dispose()

async def init_db() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

async def close_redis() -> None:
    try:
        await redis_client.aclose()
    except RuntimeError:
        pass
    except Exception:
        pass

# FastAPI dependencies
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_redis() -> AsyncGenerator[aioredis.Redis, None]:
    yield redis_client
