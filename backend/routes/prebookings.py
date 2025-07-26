from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import (
    PreBookingCreate, PreBookingUpdate, PreBookingResponse, 
    BaseResponse, PaginationParams, PreBookingStatus
)
from utils.auth import get_current_user, get_current_farmer
from database import get_collection
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/", response_model=BaseResponse)
async def create_prebooking(
    prebooking_data: PreBookingCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new pre-booking request"""
    try:
        prebookings_collection = get_collection("prebookings")
        
        # Calculate booking fee and total
        booking_fee = max(200, prebooking_data.quantity * 30)
        total_amount = booking_fee + (prebooking_data.quantity * 80)
        
        # Create pre-booking document
        prebooking_id = str(uuid.uuid4())
        prebooking_doc = {
            "_id": prebooking_id,
            "customerId": current_user["id"],
            "customerName": current_user["name"],
            "cropName": prebooking_data.cropName,
            "quantity": prebooking_data.quantity,
            "unit": prebooking_data.unit,
            "preferredLocation": prebooking_data.preferredLocation,
            "expectedHarvestDate": prebooking_data.expectedHarvestDate,
            "specialRequirements": prebooking_data.specialRequirements,
            "status": PreBookingStatus.PENDING,
            "farmerId": None,
            "farmerName": None,
            "bookingFee": booking_fee,
            "totalAmount": total_amount,
            "currency": "INR",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert pre-booking into database
        result = prebookings_collection.insert_one(prebooking_doc)
        
        if result.inserted_id:
            return BaseResponse(
                success=True,
                message="Pre-booking request created successfully",
                data={
                    "prebookingId": prebooking_id,
                    "bookingFee": booking_fee,
                    "totalAmount": total_amount
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create pre-booking"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create pre-booking: {str(e)}"
        )

@router.get("/", response_model=BaseResponse)
async def get_prebookings(
    status: Optional[PreBookingStatus] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(get_current_user)
):
    """Get pre-bookings for current user"""
    try:
        prebookings_collection = get_collection("prebookings")
        
        # Build filter query
        filter_query = {"customerId": current_user["id"]}
        
        if status:
            filter_query["status"] = status
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Get pre-bookings with pagination
        prebookings = list(prebookings_collection.find(filter_query).sort("createdAt", -1).skip(skip).limit(limit))
        
        # Get total count
        total_count = prebookings_collection.count_documents(filter_query)
        
        # Convert ObjectId to string
        for prebooking in prebookings:
            prebooking["id"] = str(prebooking["_id"])
            del prebooking["_id"]
        
        return BaseResponse(
            success=True,
            message="Pre-bookings retrieved successfully",
            data={
                "prebookings": prebookings,
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
            detail=f"Failed to retrieve pre-bookings: {str(e)}"
        )

@router.get("/{prebooking_id}", response_model=PreBookingResponse)
async def get_prebooking(
    prebooking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get pre-booking by ID"""
    try:
        prebookings_collection = get_collection("prebookings")
        
        prebooking = prebookings_collection.find_one({"_id": prebooking_id, "customerId": current_user["id"]})
        if not prebooking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pre-booking not found"
            )
        
        # Convert ObjectId to string
        prebooking["id"] = str(prebooking["_id"])
        del prebooking["_id"]
        
        return PreBookingResponse(**prebooking)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve pre-booking: {str(e)}"
        )

@router.put("/{prebooking_id}", response_model=BaseResponse)
async def update_prebooking(
    prebooking_id: str,
    prebooking_data: PreBookingUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update pre-booking (customer can update requirements)"""
    try:
        prebookings_collection = get_collection("prebookings")
        
        # Get pre-booking
        prebooking = prebookings_collection.find_one({"_id": prebooking_id, "customerId": current_user["id"]})
        if not prebooking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pre-booking not found"
            )
        
        # Only allow updates if status is pending
        if prebooking["status"] != PreBookingStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only update pending pre-bookings"
            )
        
        # Prepare update data
        update_data = prebooking_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update pre-booking
        result = prebookings_collection.update_one(
            {"_id": prebooking_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Pre-booking updated successfully"
            )
        else:
            return BaseResponse(
                success=True,
                message="No changes made to pre-booking"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update pre-booking: {str(e)}"
        )

# Farmer-specific endpoints
@router.get("/farmer/requests", response_model=BaseResponse)
async def get_farmer_prebookings(
    status: Optional[PreBookingStatus] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_farmer: dict = Depends(get_current_farmer)
):
    """Get pre-booking requests for current farmer"""
    try:
        prebookings_collection = get_collection("prebookings")
        
        # Build filter query
        filter_query = {"farmerId": current_farmer["id"]}
        
        if status:
            filter_query["status"] = status
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Get pre-bookings with pagination
        prebookings = list(prebookings_collection.find(filter_query).sort("createdAt", -1).skip(skip).limit(limit))
        
        # Get total count
        total_count = prebookings_collection.count_documents(filter_query)
        
        # Convert ObjectId to string
        for prebooking in prebookings:
            prebooking["id"] = str(prebooking["_id"])
            del prebooking["_id"]
        
        return BaseResponse(
            success=True,
            message="Farmer pre-bookings retrieved successfully",
            data={
                "prebookings": prebookings,
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
            detail=f"Failed to retrieve farmer pre-bookings: {str(e)}"
        )

@router.put("/farmer/{prebooking_id}", response_model=BaseResponse)
async def update_farmer_prebooking(
    prebooking_id: str,
    prebooking_data: PreBookingUpdate,
    current_farmer: dict = Depends(get_current_farmer)
):
    """Update pre-booking status (farmer can accept/reject)"""
    try:
        prebookings_collection = get_collection("prebookings")
        
        # Get pre-booking
        prebooking = prebookings_collection.find_one({"_id": prebooking_id, "farmerId": current_farmer["id"]})
        if not prebooking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pre-booking not found"
            )
        
        # Prepare update data
        update_data = prebooking_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update pre-booking
        result = prebookings_collection.update_one(
            {"_id": prebooking_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Pre-booking updated successfully"
            )
        else:
            return BaseResponse(
                success=True,
                message="No changes made to pre-booking"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update pre-booking: {str(e)}"
        ) 