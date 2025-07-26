from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import Farmer, User
from api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_farmers(session: AsyncSession = Depends(get_session)):
    """Get all approved farmers"""
    result = await session.execute(
        select(Farmer).where(Farmer.is_active == True)
    )
    farmers = result.scalars().all()
    return farmers

@router.get("/{farmer_id}")
async def get_farmer(farmer_id: int, session: AsyncSession = Depends(get_session)):
    """Get specific farmer by ID"""
    result = await session.execute(
        select(Farmer).where(Farmer.id == farmer_id)
    )
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer

@router.post("/")
async def create_farmer(
    farmer_data: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new farmer profile"""
    # Check if user is already a farmer
    result = await session.execute(
        select(Farmer).where(Farmer.user_id == current_user.id)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Farmer profile already exists")
    
    farmer = Farmer(
        user_id=current_user.id,
        **farmer_data
    )
    session.add(farmer)
    await session.commit()
    await session.refresh(farmer)
    return farmer

@router.put("/{farmer_id}")
async def update_farmer(
    farmer_id: int,
    farmer_data: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Update farmer profile"""
    result = await session.execute(
        select(Farmer).where(Farmer.id == farmer_id, Farmer.user_id == current_user.id)
    )
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    for key, value in farmer_data.items():
        setattr(farmer, key, value)
    
    await session.commit()
    await session.refresh(farmer)
    return farmer 