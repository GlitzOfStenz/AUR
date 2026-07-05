import os
import redis.asyncio as aioredis
from dotenv import load_dotenv
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:password@localhost:5432/university_db"
)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# PostgreSQL async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

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