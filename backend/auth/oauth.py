import os
from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database.connections import get_db
from database.models import User
from auth.jwt import create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["oauth"])

FRONTEND_REDIRECT_URL = os.getenv("FRONTEND_REDIRECT_URL", "http://localhost:3000/oauth/success")

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


async def find_or_create_oauth_user(db: AsyncSession, email: str, first_name: str, last_name: str, oauth_id: str) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user:
        if not user.oauth_provider:
            user.oauth_provider = "google"
            user.oauth_id = oauth_id
            await db.commit()
            await db.refresh(user)
        return user

    user = User(
        first_name=first_name or "User",
        last_name=last_name or "",
        email=email,
        password_hash=None,
        role="user",
        oauth_provider="google",
        oauth_id=oauth_id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/google/login")
async def google_login(request: Request):
    if not os.getenv("GOOGLE_CLIENT_ID") or not os.getenv("GOOGLE_CLIENT_SECRET"):
        from fastapi import HTTPException
        raise HTTPException(
            status_code=500,
            detail="Google OAuth client credentials are not configured on the backend server environment."
        )
    redirect_uri = str(request.url_for("google_callback"))
    if redirect_uri.startswith("http://") and "localhost" not in redirect_uri and "127.0.0.1" not in redirect_uri:
        redirect_uri = redirect_uri.replace("http://", "https://", 1)
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")

    email = userinfo["email"]
    full_name = userinfo.get("name", "")
    parts = full_name.split(" ", 1)
    first_name = parts[0] if parts else "User"
    last_name = parts[1] if len(parts) > 1 else ""

    user = await find_or_create_oauth_user(db, email, first_name, last_name, oauth_id=userinfo["sub"])

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = await create_refresh_token(user.id)

    return RedirectResponse(
        f"{FRONTEND_REDIRECT_URL}?access_token={access_token}&refresh_token={refresh_token}"
    )