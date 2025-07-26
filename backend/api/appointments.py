from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import Appointment

router = APIRouter()

@router.get("/")
async def get_appointments(session: AsyncSession = Depends(get_session)):
    """Get all appointments"""
    result = await session.execute(select(Appointment))
    appointments = result.scalars().all()
    return appointments

@router.post("/")
async def create_appointment(
    appointment_data: dict,
    session: AsyncSession = Depends(get_session)
):
    """Create a new appointment"""
    appointment = Appointment(**appointment_data)
    session.add(appointment)
    await session.commit()
    await session.refresh(appointment)
    return appointment 