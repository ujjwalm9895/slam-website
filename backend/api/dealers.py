from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from models import User, Dealer, DealerCreate, DealerResponse, UserResponse
from utils.auth import get_current_user, get_current_dealer
from database import get_session

router = APIRouter()

@router.get("/", response_model=List[DealerResponse])
async def get_dealers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    session: AsyncSession = Depends(get_session)
):
    """Get all dealers with pagination"""
    try:
        result = await session.execute(
            select(Dealer)
            .offset(skip)
            .limit(limit)
        )
        dealers = result.scalars().all()
        
        # Convert to response format
        dealer_responses = []
        for dealer in dealers:
            # Get user data
            user_result = await session.execute(select(User).where(User.id == dealer.user_id))
            user = user_result.scalar_one()
            
            dealer_responses.append(DealerResponse(
                id=dealer.id,
                user_id=dealer.user_id,
                company_name=dealer.company_name,
                location=dealer.location,
                specialization=dealer.specialization,
                description=dealer.description,
                rating=dealer.rating,
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
        
        return dealer_responses

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dealers: {str(e)}"
        )

@router.get("/{dealer_id}", response_model=DealerResponse)
async def get_dealer(
    dealer_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get a specific dealer by ID"""
    try:
        result = await session.execute(select(Dealer).where(Dealer.id == dealer_id))
        dealer = result.scalar_one_or_none()
        
        if not dealer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dealer not found"
            )
        
        # Get user data
        user_result = await session.execute(select(User).where(User.id == dealer.user_id))
        user = user_result.scalar_one()
        
        return DealerResponse(
            id=dealer.id,
            user_id=dealer.user_id,
            company_name=dealer.company_name,
            location=dealer.location,
            specialization=dealer.specialization,
            description=dealer.description,
            rating=dealer.rating,
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
            detail=f"Failed to fetch dealer: {str(e)}"
        )

@router.post("/profile", response_model=DealerResponse)
async def create_dealer_profile(
    dealer_data: DealerCreate,
    current_user: User = Depends(get_current_dealer),
    session: AsyncSession = Depends(get_session)
):
    """Create dealer profile for current user"""
    try:
        # Check if dealer profile already exists
        result = await session.execute(select(Dealer).where(Dealer.user_id == current_user.id))
        existing_dealer = result.scalar_one_or_none()
        
        if existing_dealer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dealer profile already exists"
            )
        
        # Create dealer profile
        dealer = Dealer(
            user_id=current_user.id,
            company_name=dealer_data.company_name,
            location=dealer_data.location,
            specialization=dealer_data.specialization,
            description=dealer_data.description
        )
        
        session.add(dealer)
        await session.commit()
        await session.refresh(dealer)
        
        return DealerResponse(
            id=dealer.id,
            user_id=dealer.user_id,
            company_name=dealer.company_name,
            location=dealer.location,
            specialization=dealer.specialization,
            description=dealer.description,
            rating=dealer.rating,
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
            detail=f"Failed to create dealer profile: {str(e)}"
        ) 