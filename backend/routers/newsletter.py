from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.connections import get_db  
from database.models import NewsletterSubscriber
from schemas import (
    NewsletterSubscribeRequest,
    NewsletterUnsubscribeRequest,
    NewsletterSubscriberResponse,
)

router = APIRouter(prefix="/api/newsletter", tags=["Newsletter"])


@router.post("/subscribe", response_model=NewsletterSubscriberResponse, status_code=status.HTTP_201_CREATED)
async def subscribe(payload: NewsletterSubscribeRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email)
    )
    existing = result.scalar_one_or_none()

    if existing:
        if existing.active:
            raise HTTPException(status_code=400, detail="This email is already subscribed.")
        # re-activate a previously unsubscribed email instead of creating a duplicate row
        existing.active = True
        await db.commit()
        await db.refresh(existing)
        return existing

    new_subscriber = NewsletterSubscriber(email=payload.email)
    db.add(new_subscriber)
    await db.commit()
    await db.refresh(new_subscriber)
    return new_subscriber


@router.delete("/unsubscribe", status_code=status.HTTP_200_OK)
async def unsubscribe(payload: NewsletterUnsubscribeRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email)
    )
    subscriber = result.scalar_one_or_none()

    if not subscriber:
        raise HTTPException(status_code=404, detail="Email not found in subscriber list.")

    if not subscriber.active:
        raise HTTPException(status_code=400, detail="This email is already unsubscribed.")

    subscriber.active = False  # soft delete
    await db.commit()

    return {"message": "Successfully unsubscribed.", "email": subscriber.email}