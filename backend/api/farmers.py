from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from models import User, Farmer, FarmerCreate, FarmerResponse, UserResponse
from utils.auth import get_current_user, get_current_farmer
from database import get_session

router = APIRouter()

@router.get("/", response_model=List[FarmerResponse])
async def get_farmers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    session: AsyncSession = Depends(get_session)
):
    """Get all farmers with pagination"""
    try:
        result = await session.execute(
            select(Farmer)
            .offset(skip)
            .limit(limit)
        )
        farmers = result.scalars().all()
        
        # Convert to response format
        farmer_responses = []
        for farmer in farmers:
            # Get user data
            user_result = await session.execute(select(User).where(User.id == farmer.user_id))
            user = user_result.scalar_one()
            
            farmer_responses.append(FarmerResponse(
                id=farmer.id,
                user_id=farmer.user_id,
                location=farmer.location,
                crop_type=farmer.crop_type,
                farm_size=farmer.farm_size,
                farm_size_unit=farmer.farm_size_unit,
                description=farmer.description,
                is_online=farmer.is_online,
                rating=farmer.rating,
                total_reviews=farmer.total_reviews,
                user=UserResponse(
                    id=user.id,
                    email=user.email,
                    phone=user.phone,
                    name=user.name,
                    country=user.country,
                    role=user.role,
                    is_active=user.is_active,
                    is_verified=user.is_verified,
                    created_at=user.created_at
                )
            ))
        
        return farmer_responses

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch farmers: {str(e)}"
        )

@router.get("/{farmer_id}", response_model=FarmerResponse)
async def get_farmer(
    farmer_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get a specific farmer by ID"""
    try:
        result = await session.execute(select(Farmer).where(Farmer.id == farmer_id))
        farmer = result.scalar_one_or_none()
        
        if not farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        
        # Get user data
        user_result = await session.execute(select(User).where(User.id == farmer.user_id))
        user = user_result.scalar_one()
        
        return FarmerResponse(
            id=farmer.id,
            user_id=farmer.user_id,
            location=farmer.location,
            crop_type=farmer.crop_type,
            farm_size=farmer.farm_size,
            farm_size_unit=farmer.farm_size_unit,
            description=farmer.description,
            is_online=farmer.is_online,
            rating=farmer.rating,
            total_reviews=farmer.total_reviews,
            user=UserResponse(
                id=user.id,
                email=user.email,
                phone=user.phone,
                name=user.name,
                country=user.country,
                role=user.role,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at
            )
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch farmer: {str(e)}"
        )

@router.post("/profile", response_model=FarmerResponse)
async def create_farmer_profile(
    farmer_data: FarmerCreate,
    current_user: User = Depends(get_current_farmer),
    session: AsyncSession = Depends(get_session)
):
    """Create farmer profile for current user"""
    try:
        # Check if farmer profile already exists
        result = await session.execute(select(Farmer).where(Farmer.user_id == current_user.id))
        existing_farmer = result.scalar_one_or_none()
        
        if existing_farmer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Farmer profile already exists"
            )
        
        # Create farmer profile
        farmer = Farmer(
            user_id=current_user.id,
            location=farmer_data.location,
            crop_type=farmer_data.crop_type,
            farm_size=farmer_data.farm_size,
            farm_size_unit=farmer_data.farm_size_unit,
            description=farmer_data.description,
            is_online=farmer_data.is_online
        )
        
        session.add(farmer)
        await session.commit()
        await session.refresh(farmer)
        
        return FarmerResponse(
            id=farmer.id,
            user_id=farmer.user_id,
            location=farmer.location,
            crop_type=farmer.crop_type,
            farm_size=farmer.farm_size,
            farm_size_unit=farmer.farm_size_unit,
            description=farmer.description,
            is_online=farmer.is_online,
            rating=farmer.rating,
            total_reviews=farmer.total_reviews,
            user=UserResponse(
                id=current_user.id,
                email=current_user.email,
                phone=current_user.phone,
                name=current_user.name,
                country=current_user.country,
                role=current_user.role,
                is_active=current_user.is_active,
                is_verified=current_user.is_verified,
                created_at=current_user.created_at
            )
        )

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create farmer profile: {str(e)}"
        )

@router.put("/profile", response_model=FarmerResponse)
async def update_farmer_profile(
    farmer_data: FarmerCreate,
    current_user: User = Depends(get_current_farmer),
    session: AsyncSession = Depends(get_session)
):
    """Update farmer profile for current user"""
    try:
        # Get existing farmer profile
        result = await session.execute(select(Farmer).where(Farmer.user_id == current_user.id))
        farmer = result.scalar_one_or_none()
        
        if not farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer profile not found"
            )
        
        # Update farmer profile
        farmer.location = farmer_data.location
        farmer.crop_type = farmer_data.crop_type
        farmer.farm_size = farmer_data.farm_size
        farmer.farm_size_unit = farmer_data.farm_size_unit
        farmer.description = farmer_data.description
        farmer.is_online = farmer_data.is_online
        farmer.updated_at = datetime.utcnow()
        
        await session.commit()
        await session.refresh(farmer)
        
        return FarmerResponse(
            id=farmer.id,
            user_id=farmer.user_id,
            location=farmer.location,
            crop_type=farmer.crop_type,
            farm_size=farmer.farm_size,
            farm_size_unit=farmer.farm_size_unit,
            description=farmer.description,
            is_online=farmer.is_online,
            rating=farmer.rating,
            total_reviews=farmer.total_reviews,
            user=UserResponse(
                id=current_user.id,
                email=current_user.email,
                phone=current_user.phone,
                name=current_user.name,
                country=current_user.country,
                role=current_user.role,
                is_active=current_user.is_active,
                is_verified=current_user.is_verified,
                created_at=current_user.created_at
            )
        )

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update farmer profile: {str(e)}"
        ) 