from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import universities, rankings, countries, search
from routers import auth
from routers.auth import router as auth_router
from routers.users import router as users_router

app = FastAPI(title="AUR - Asia University Ranking API", version="1.0.0")

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
app.include_router(search.router)
app.include_router(auth.router)

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "AUR API is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}
