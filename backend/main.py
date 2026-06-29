from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database.connections import close_db, close_redis
from routers import universities, rankings, countries, search
from routers import auth
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers import analytics
from routers import compare
from routers.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await close_db()
    await close_redis()

app = FastAPI(title="AUR - Asia University Ranking API", version="1.0.0", lifespan=lifespan)

# Allow frontend (Next.js) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(universities.router)
app.include_router(rankings.router)
app.include_router(countries.router)
app.include_router(analytics.router)
app.include_router(compare.router)
app.include_router(search.router)
app.include_router(auth.router)
app.include_router(admin_router)

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "AUR API is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}
