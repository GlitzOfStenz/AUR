from starlette.middleware.sessions import SessionMiddleware
from auth.oauth import router as oauth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import faculty_student_awards


from database.connections import close_db, close_redis, init_db
from routers import universities, rankings, countries, search
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers import analytics
from routers import compare
from routers.admin import router as admin_router
from routers.chat import router as chat_router
from routers import newsletter
from routers import news
from routers import methodology
from routers import events
from routers import notifications
# from routers import blogs  # TEMP: disabled, broken relative import in blogs.py, rn by urvi- resume when needed

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()
    await close_redis()

app = FastAPI(title="AUR - Asia University Ranking API", version="1.0.0", lifespan=lifespan)

import os

# Reads production URL(s) from environment variables, falls back to local dev
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins = [origin.strip() for origin in frontend_url.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY", "aur-default-session-secret-key-2026"))


app.include_router(universities.router)
app.include_router(rankings.router)
app.include_router(countries.router)
app.include_router(analytics.router)
app.include_router(compare.router)
app.include_router(search.router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(users_router)
app.include_router(newsletter.router)
app.include_router(news.router)
app.include_router(methodology.router)
app.include_router(chat_router) 
app.include_router(events.router)
app.include_router(notifications.router)
app.include_router(faculty_student_awards.router)
app.include_router(oauth_router)
# app.include_router(blogs.router)  # TEMP: disabled, broken relative import in blogs.py

@app.get("/")
def root():
    return {"message": "AUR API is running!"}

from fastapi.responses import JSONResponse

@app.get("/health", tags=["Health"])
async def health():
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": "AUR Backend"
        }
    )


