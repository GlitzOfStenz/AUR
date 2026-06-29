"""
Users router — bookmark management (save, list, delete).
Requires authentication on all endpoints.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database.connections import get_db
from database.models import SavedUniversity, User
from auth.middleware import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


#  Schemas 

class BookmarkCreate(BaseModel):
    university_id: UUID


class BookmarkResponse(BaseModel):
    id: UUID
    university_id: UUID
    created_at: str

    class Config:
        from_attributes = True


#  Endpoints 

@router.post("/bookmarks", status_code=status.HTTP_201_CREATED)
async def add_bookmark(
    body: BookmarkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save a university to the authenticated user's bookmarks."""
    # Prevent duplicates
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
    """
    Return all bookmarked universities for the authenticated user.
    NOTE: Enrich with full university data by joining with universities table
    or calling the universities service — plugged in here as university_id for now.
    """
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
    """Remove a bookmark by university_id for the authenticated user."""
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