from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import UserUpdate, UserResponse, BaseResponse, PaginationParams
from utils.auth import get_current_user, get_current_admin
from database import get_collection
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=BaseResponse)
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all users (admin only)"""
    try:
        users_collection = get_collection("users")
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Get users with pagination
        users = list(users_collection.find({}).skip(skip).limit(limit))
        
        # Get total count
        total_count = users_collection.count_documents({})
        
        # Convert ObjectId to string and remove password
        for user in users:
            user["id"] = str(user["_id"])
            del user["_id"]
            del user["password"]  # Don't return password
        
        return BaseResponse(
            success=True,
            message="Users retrieved successfully",
            data={
                "users": users,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": total_count,
                    "pages": (total_count + limit - 1) // limit
                }
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve users: {str(e)}"
        )

@router.put("/{user_id}", response_model=BaseResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update user (admin only)"""
    try:
        users_collection = get_collection("users")
        
        # Prepare update data
        update_data = user_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update user
        result = users_collection.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="User updated successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )

@router.delete("/{user_id}", response_model=BaseResponse)
async def delete_user(
    user_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete user (admin only)"""
    try:
        users_collection = get_collection("users")
        
        # Soft delete by setting isActive to False
        result = users_collection.update_one(
            {"_id": user_id},
            {"$set": {"isActive": False, "updatedAt": datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="User deleted successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        )

@router.put("/me/profile", response_model=BaseResponse)
async def update_my_profile(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        users_collection = get_collection("users")
        
        # Prepare update data
        update_data = user_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update user
        result = users_collection.update_one(
            {"_id": current_user["id"]},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Profile updated successfully"
            )
        else:
            return BaseResponse(
                success=True,
                message="No changes made to profile"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        ) 