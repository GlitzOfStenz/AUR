from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database.connections import get_db
from database.models import SavedUniversity, User
from auth.middleware import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

class UserMeResponse(BaseModel):
    id: UUID
    email: str
    first_name: str
    last_name: str
    role: str

    class Config:
        from_attributes = True


@router.get("/me", response_model=UserMeResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

class BookmarkCreate(BaseModel):
    university_id: UUID


class BookmarkResponse(BaseModel):
    id: UUID
    university_id: UUID
    created_at: str

    class Config:
        from_attributes = True


class PreferencesUpdate(BaseModel):
    default_country: str | None = None
    default_limit: int | None = None
    preferred_metrics: list[str] | None = None
    autoRecalc: bool | None = None
    realtimeSearch: bool | None = None
    analyticsTelemetry: bool | None = None



@router.post("/bookmarks", status_code=status.HTTP_201_CREATED)
async def add_bookmark(
    body: BookmarkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(SavedUniversity).where(
            SavedUniversity.user_id == current_user.id,
            SavedUniversity.university_id == body.university_id,
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="University already bookmarked",
        )

    bookmark = SavedUniversity(
        user_id=current_user.id,
        university_id=body.university_id,
    )
    db.add(bookmark)
    await db.commit()
    await db.refresh(bookmark)

    return {
        "message": "Bookmark added",
        "bookmark_id": bookmark.id,
        "university_id": bookmark.university_id,
    }


@router.get("/bookmarks")
async def get_bookmarks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(SavedUniversity).where(SavedUniversity.user_id == current_user.id)
    )
    bookmarks = result.scalars().all()

    return {
        "user_id": current_user.id,
        "bookmarks": [
            {
                "bookmark_id": b.id,
                "university_id": b.university_id,
                "saved_at": b.created_at.isoformat() if b.created_at else None,
            }
            for b in bookmarks
        ],
        "total": len(bookmarks),
    }


@router.delete("/bookmarks/{university_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_bookmark(
    university_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(SavedUniversity).where(
            SavedUniversity.user_id == current_user.id,
            SavedUniversity.university_id == university_id,
        )
    )
    bookmark = result.scalar_one_or_none()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found",
        )

    await db.delete(bookmark)
    await db.commit()



@router.patch("/preferences")
async def update_preferences(
    body: PreferencesUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    existing = current_user.preferences or {}
    updated = {**existing, **body.model_dump(exclude_none=True)}
    current_user.preferences = updated
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return {"message": "Preferences updated", "preferences": current_user.preferences}


@router.get("/preferences")
async def get_preferences(
    current_user: User = Depends(get_current_user),
):
    
    return current_user.preferences or {}