from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import User, UserRole
from api.auth import get_current_user

router = APIRouter()

async def get_current_admin(current_user: User = Depends(get_current_user)):
    """Ensure current user is admin"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/users/pending")
async def get_pending_users(
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Get all pending users for approval"""
    result = await session.execute(
        select(User).where(User.status == "pending")
    )
    users = result.scalars().all()
    return users

@router.put("/users/{user_id}/approve")
async def approve_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Approve a pending user"""
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.status = "approved"
    await session.commit()
    return {"message": "User approved successfully"}

@router.put("/users/{user_id}/reject")
async def reject_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Reject a pending user"""
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.status = "rejected"
    await session.commit()
    return {"message": "User rejected successfully"} 