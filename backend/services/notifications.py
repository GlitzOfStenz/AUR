from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Notification


async def create_notification(
    db: AsyncSession,
    title: str,
    description: str,
    category: str,
) -> Notification:
    """
    Shared helper to create a notification row.
    Callers are responsible for their own db.commit() timing —
    this function adds and flushes, but does NOT commit,
    so it can be safely called alongside other writes in the
    same transaction (e.g. right after creating an Event/Membership/etc.)
    without causing extra round-trips or partial commits.
    """
    notification = Notification(
        title=title,
        description=description,
        category=category,
        is_read=False,
    )
    db.add(notification)
    await db.flush()
    return notification