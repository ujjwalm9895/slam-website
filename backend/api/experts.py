from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from models import User, Expert, ExpertCreate, ExpertResponse, UserResponse
from utils.auth import get_current_user, get_current_expert
from database import get_session

router = APIRouter()

@router.get("/", response_model=List[ExpertResponse])
async def get_experts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    session: AsyncSession = Depends(get_session)
):
    """Get all experts with pagination"""
    try:
        result = await session.execute(
            select(Expert)
            .offset(skip)
            .limit(limit)
        )
        experts = result.scalars().all()
        
        # Convert to response format
        expert_responses = []
        for expert in experts:
            # Get user data
            user_result = await session.execute(select(User).where(User.id == expert.user_id))
            user = user_result.scalar_one()
            
            expert_responses.append(ExpertResponse(
                id=expert.id,
                user_id=expert.user_id,
                domain=expert.domain,
                experience=expert.experience,
                description=expert.description,
                consultation_fee=expert.consultation_fee,
                rating=expert.rating,
                total_consultations=expert.total_consultations,
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
        
        return expert_responses

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch experts: {str(e)}"
        )

@router.get("/{expert_id}", response_model=ExpertResponse)
async def get_expert(
    expert_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get a specific expert by ID"""
    try:
        result = await session.execute(select(Expert).where(Expert.id == expert_id))
        expert = result.scalar_one_or_none()
        
        if not expert:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Expert not found"
            )
        
        # Get user data
        user_result = await session.execute(select(User).where(User.id == expert.user_id))
        user = user_result.scalar_one()
        
        return ExpertResponse(
            id=expert.id,
            user_id=expert.user_id,
            domain=expert.domain,
            experience=expert.experience,
            description=expert.description,
            consultation_fee=expert.consultation_fee,
            rating=expert.rating,
            total_consultations=expert.total_consultations,
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
            detail=f"Failed to fetch expert: {str(e)}"
        )

@router.post("/profile", response_model=ExpertResponse)
async def create_expert_profile(
    expert_data: ExpertCreate,
    current_user: User = Depends(get_current_expert),
    session: AsyncSession = Depends(get_session)
):
    """Create expert profile for current user"""
    try:
        # Check if expert profile already exists
        result = await session.execute(select(Expert).where(Expert.user_id == current_user.id))
        existing_expert = result.scalar_one_or_none()
        
        if existing_expert:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Expert profile already exists"
            )
        
        # Create expert profile
        expert = Expert(
            user_id=current_user.id,
            domain=expert_data.domain,
            experience=expert_data.experience,
            description=expert_data.description,
            consultation_fee=expert_data.consultation_fee
        )
        
        session.add(expert)
        await session.commit()
        await session.refresh(expert)
        
        return ExpertResponse(
            id=expert.id,
            user_id=expert.user_id,
            domain=expert.domain,
            experience=expert.experience,
            description=expert.description,
            consultation_fee=expert.consultation_fee,
            rating=expert.rating,
            total_consultations=expert.total_consultations,
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
            detail=f"Failed to create expert profile: {str(e)}"
        ) 