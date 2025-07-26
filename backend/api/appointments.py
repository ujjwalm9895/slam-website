from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from models import User, Appointment, AppointmentCreate, AppointmentResponse, AppointmentStatus, Expert, ExpertResponse
from utils.auth import get_current_user
from database import get_session

router = APIRouter()

@router.post("/", response_model=AppointmentResponse)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new appointment"""
    try:
        appointment = Appointment(
            customer_id=current_user.id,
            expert_id=appointment_data.expert_id,
            service_type=appointment_data.service_type,
            preferred_date=appointment_data.preferred_date,
            notes=appointment_data.notes,
            status=AppointmentStatus.PENDING
        )
        
        session.add(appointment)
        await session.commit()
        await session.refresh(appointment)
        
        # Get expert data if expert_id is provided
        expert_response = None
        if appointment.expert_id:
            expert_result = await session.execute(select(Expert).where(Expert.id == appointment.expert_id))
            expert = expert_result.scalar_one_or_none()
            if expert:
                expert_response = ExpertResponse(
                    id=expert.id,
                    user_id=expert.user_id,
                    domain=expert.domain,
                    experience=expert.experience,
                    description=expert.description,
                    consultation_fee=expert.consultation_fee,
                    rating=expert.rating,
                    total_consultations=expert.total_consultations
                )
        
        return AppointmentResponse(
            id=appointment.id,
            customer_id=appointment.customer_id,
            expert_id=appointment.expert_id,
            service_type=appointment.service_type,
            preferred_date=appointment.preferred_date,
            notes=appointment.notes,
            status=appointment.status,
            created_at=appointment.created_at,
            customer=None,  # Will be populated by frontend if needed
            expert=expert_response
        )

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create appointment: {str(e)}"
        )

@router.get("/", response_model=List[AppointmentResponse])
async def get_appointments(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Get appointments for current user"""
    try:
        result = await session.execute(
            select(Appointment).where(Appointment.customer_id == current_user.id)
        )
        appointments = result.scalars().all()
        
        appointment_responses = []
        for appointment in appointments:
            expert_response = None
            if appointment.expert_id:
                expert_result = await session.execute(select(Expert).where(Expert.id == appointment.expert_id))
                expert = expert_result.scalar_one_or_none()
                if expert:
                    expert_response = ExpertResponse(
                        id=expert.id,
                        user_id=expert.user_id,
                        domain=expert.domain,
                        experience=expert.experience,
                        description=expert.description,
                        consultation_fee=expert.consultation_fee,
                        rating=expert.rating,
                        total_consultations=expert.total_consultations
                    )
            
            appointment_responses.append(AppointmentResponse(
                id=appointment.id,
                customer_id=appointment.customer_id,
                expert_id=appointment.expert_id,
                service_type=appointment.service_type,
                preferred_date=appointment.preferred_date,
                notes=appointment.notes,
                status=appointment.status,
                created_at=appointment.created_at,
                customer=None,
                expert=expert_response
            ))
        
        return appointment_responses

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch appointments: {str(e)}"
        ) 