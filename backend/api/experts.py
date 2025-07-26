from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import Expert, User
from api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_experts(session: AsyncSession = Depends(get_session)):
    """Get all approved experts"""
    result = await session.execute(
        select(Expert).where(Expert.is_active == True)
    )
    experts = result.scalars().all()
    return experts

@router.get("/{expert_id}")
async def get_expert(expert_id: int, session: AsyncSession = Depends(get_session)):
    """Get specific expert by ID"""
    result = await session.execute(
        select(Expert).where(Expert.id == expert_id)
    )
    expert = result.scalar_one_or_none()
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    return expert

@router.post("/")
async def create_expert(
    expert_data: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new expert profile"""
    # Check if user is already an expert
    result = await session.execute(
        select(Expert).where(Expert.user_id == current_user.id)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Expert profile already exists")
    
    expert = Expert(
        user_id=current_user.id,
        **expert_data
    )
    session.add(expert)
    await session.commit()
    await session.refresh(expert)
    return expert 