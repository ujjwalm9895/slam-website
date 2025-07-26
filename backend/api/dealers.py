from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import Dealer

router = APIRouter()

@router.get("/")
async def get_dealers(session: AsyncSession = Depends(get_session)):
    """Get all approved dealers"""
    result = await session.execute(
        select(Dealer).where(Dealer.is_active == True)
    )
    dealers = result.scalars().all()
    return dealers

@router.get("/{dealer_id}")
async def get_dealer(dealer_id: int, session: AsyncSession = Depends(get_session)):
    """Get specific dealer by ID"""
    result = await session.execute(
        select(Dealer).where(Dealer.id == dealer_id)
    )
    dealer = result.scalar_one_or_none()
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer not found")
    return dealer 