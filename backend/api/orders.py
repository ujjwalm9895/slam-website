from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import Order

router = APIRouter()

@router.get("/")
async def get_orders(session: AsyncSession = Depends(get_session)):
    """Get all orders"""
    result = await session.execute(select(Order))
    orders = result.scalars().all()
    return orders

@router.post("/")
async def create_order(
    order_data: dict,
    session: AsyncSession = Depends(get_session)
):
    """Create a new order"""
    order = Order(**order_data)
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return order 