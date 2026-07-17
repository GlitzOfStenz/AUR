from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from auth.middleware import get_current_user
from database.connections import get_db
from database.models import (
    MembershipTier,
    UserMembership,
    User,
)
from services.notifications import create_notification
from schemas import (
    MembershipTierResponse,
    MembershipSubscribeRequest,
    UserMembershipResponse,
)

router = APIRouter(prefix="/api/membership", tags=["Membership"])


@router.get("/tiers", response_model=list[MembershipTierResponse])
async def list_tiers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MembershipTier))
    return result.scalars().all()


@router.post("/subscribe", response_model=UserMembershipResponse, status_code=201)
async def subscribe(
    payload: MembershipSubscribeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Find selected tier
    result = await db.execute(
        select(MembershipTier).where(
            MembershipTier.id == payload.tier_id
        )
    )
    tier = result.scalar_one_or_none()
    if not tier:
        raise HTTPException(
            status_code=404,
            detail="Membership tier not found",
        )

    start = datetime.utcnow()
    end = start + timedelta(days=30 * tier.duration_months)

    membership = UserMembership(
        user_id=current_user.id,
        tier_id=tier.id,
        start_date=start,
        end_date=end,
        status="active",
    )
    db.add(membership)

    await create_notification(
        db=db,
        title="New Membership Created",
        description=f"{tier.name} membership has been activated.",
        category="membership",
    )

    await db.commit()

    # Reload membership WITH tier relationship
    result = await db.execute(
        select(UserMembership)
        .options(selectinload(UserMembership.tier))
        .where(UserMembership.id == membership.id)
    )
    membership = result.scalar_one()
    return membership


@router.get("/status", response_model=UserMembershipResponse)
async def check_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserMembership)
        .options(selectinload(UserMembership.tier))
        .where(
            UserMembership.user_id == current_user.id,
            UserMembership.status == "active",
        )
        .order_by(UserMembership.start_date.desc())
    )
    membership = result.scalars().first()
    if not membership:
        raise HTTPException(
            status_code=404,
            detail="No active membership found",
        )
    return membership