from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from models import User, UserRole, Farmer, Expert, Dealer, UserResponse, AdminUserResponse
from utils.auth import get_current_user
from database import get_session

router = APIRouter()

# Admin middleware - check if user is admin
async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.get("/users", response_model=List[AdminUserResponse])
async def get_all_users(
    status_filter: Optional[str] = Query(None, description="Filter by status: pending, approved, rejected"),
    role_filter: Optional[str] = Query(None, description="Filter by role: farmer, expert, dealer"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Get all users with filtering and pagination (Admin only)"""
    try:
        # Build query
        query = select(User)
        
        # Apply filters
        if status_filter:
            query = query.where(User.status == status_filter)
        if role_filter:
            query = query.where(User.role == role_filter)
        
        # Add pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        result = await session.execute(query)
        users = result.scalars().all()
        
        # Convert to response model
        user_responses = []
        for user in users:
            user_responses.append(AdminUserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                phone=user.phone,
                country=user.country,
                role=user.role,
                status=user.status,
                created_at=user.created_at,
                updated_at=user.updated_at
            ))
        
        return user_responses

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}"
        )

@router.get("/users/{user_id}", response_model=AdminUserResponse)
async def get_user_details(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Get detailed user information (Admin only)"""
    try:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return AdminUserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            phone=user.phone,
            country=user.country,
            role=user.role,
            status=user.status,
            created_at=user.created_at,
            updated_at=user.updated_at
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user details: {str(e)}"
        )

@router.put("/users/{user_id}/approve")
async def approve_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Approve a user (Admin only)"""
    try:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.status == "approved":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already approved"
            )
        
        # Update user status
        user.status = "approved"
        user.updated_at = datetime.utcnow()
        
        await session.commit()
        
        return {
            "success": True,
            "message": f"User {user.name} has been approved successfully",
            "user_id": user.id,
            "status": "approved"
        }

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to approve user: {str(e)}"
        )

@router.put("/users/{user_id}/reject")
async def reject_user(
    user_id: int,
    reason: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Reject a user (Admin only)"""
    try:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.status == "rejected":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already rejected"
            )
        
        # Update user status
        user.status = "rejected"
        user.updated_at = datetime.utcnow()
        
        await session.commit()
        
        return {
            "success": True,
            "message": f"User {user.name} has been rejected",
            "user_id": user.id,
            "status": "rejected",
            "reason": reason
        }

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reject user: {str(e)}"
        )

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Get dashboard statistics (Admin only)"""
    try:
        # Get user counts by status
        pending_users = await session.execute(
            select(User).where(User.status == "pending")
        )
        pending_count = len(pending_users.scalars().all())
        
        approved_users = await session.execute(
            select(User).where(User.status == "approved")
        )
        approved_count = len(approved_users.scalars().all())
        
        rejected_users = await session.execute(
            select(User).where(User.status == "rejected")
        )
        rejected_count = len(rejected_users.scalars().all())
        
        # Get counts by role
        farmers = await session.execute(
            select(User).where(User.role == UserRole.FARMER, User.status == "approved")
        )
        farmer_count = len(farmers.scalars().all())
        
        experts = await session.execute(
            select(User).where(User.role == UserRole.EXPERT, User.status == "approved")
        )
        expert_count = len(experts.scalars().all())
        
        dealers = await session.execute(
            select(User).where(User.role == UserRole.DEALER, User.status == "approved")
        )
        dealer_count = len(dealers.scalars().all())
        
        # Get recent registrations
        recent_users = await session.execute(
            select(User)
            .order_by(User.created_at.desc())
            .limit(5)
        )
        recent_users_list = recent_users.scalars().all()
        
        return {
            "total_users": {
                "pending": pending_count,
                "approved": approved_count,
                "rejected": rejected_count,
                "total": pending_count + approved_count + rejected_count
            },
            "users_by_role": {
                "farmers": farmer_count,
                "experts": expert_count,
                "dealers": dealer_count
            },
            "recent_registrations": [
                {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "status": user.status,
                    "created_at": user.created_at
                }
                for user in recent_users_list
            ]
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard stats: {str(e)}"
        )

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session)
):
    """Delete a user (Admin only)"""
    try:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Delete user
        await session.delete(user)
        await session.commit()
        
        return {
            "success": True,
            "message": f"User {user.name} has been deleted successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        ) 