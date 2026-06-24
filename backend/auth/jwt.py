"""
JWT utility — handles token creation, decoding, and Redis-backed refresh tokens.
Authors: Janani & Steny
"""

import os
import uuid
from datetime import datetime, timedelta

import redis.asyncio as aioredis
from jose import JWTError, jwt
from fastapi import HTTPException, status

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = aioredis.from_url(REDIS_URL, decode_responses=True)


# ── Token creation ─────────────────────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    """Create a short-lived JWT access token."""
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload["type"] = "access"
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def create_refresh_token(user_id: int) -> str:
    """
    Create a refresh token (opaque UUID), store it in Redis with TTL.
    Key: refresh:<token>  →  value: user_id
    """
    token = str(uuid.uuid4())
    ttl_seconds = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
    await redis_client.setex(f"refresh:{token}", ttl_seconds, str(user_id))
    return token


# ── Token validation ───────────────────────────────────────────────────────────

def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token. Raises 401 on failure."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception


async def validate_refresh_token(token: str) -> int:
    """
    Validate a refresh token against Redis.
    Returns the user_id if valid, raises 401 otherwise.
    """
    user_id = await redis_client.get(f"refresh:{token}")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    return int(user_id)


async def revoke_refresh_token(token: str) -> None:
    """Delete a refresh token from Redis (logout / rotation)."""
    await redis_client.delete(f"refresh:{token}")