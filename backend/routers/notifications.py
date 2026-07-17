from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from database.connections import get_db
from database.models import Notification, User
from schemas import NotificationResponse
from auth.middleware import get_current_user_optional

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    query = select(Notification).order_by(Notification.created_at.desc())

    is_admin = current_user is not None and current_user.role == "admin"
    if not is_admin:
        query = query.where(Notification.category != "membership")

    result = await db.execute(query)
    notifications = result.scalars().all()
    return notifications


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(notification_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id)
    )
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")

    notification.is_read = True
    await db.commit()
    await db.refresh(notification)
    return notification