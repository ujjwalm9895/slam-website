from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import (
    FarmerCreate, FarmerUpdate, FarmerResponse, FarmerFilter, 
    BaseResponse, PaginationParams
)
from utils.auth import get_current_user, get_current_farmer
from database import get_collection
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/", response_model=BaseResponse)
async def create_farmer(
    farmer_data: FarmerCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new farmer profile"""
    try:
        farmers_collection = get_collection("farmers")
        users_collection = get_collection("users")
        
        # Check if user already has a farmer profile
        existing_farmer = farmers_collection.find_one({"userId": current_user["id"]})
        if existing_farmer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Farmer profile already exists for this user"
            )
        
        # Create farmer document
        farmer_id = str(uuid.uuid4())
        farmer_doc = {
            "_id": farmer_id,
            "userId": current_user["id"],
            "name": farmer_data.name,
            "country": farmer_data.country,
            "state": farmer_data.state,
            "city": farmer_data.city,
            "coordinates": farmer_data.coordinates.dict() if farmer_data.coordinates else None,
            "languages": farmer_data.languages,
            "specialties": farmer_data.specialties,
            "certifications": farmer_data.certifications,
            "farmSize": farmer_data.farmSize,
            "farmSizeUnit": farmer_data.farmSizeUnit,
            "description": farmer_data.description,
            "contact": farmer_data.contact,
            "visitAllowed": farmer_data.visitAllowed,
            "rating": 0.0,
            "totalReviews": 0,
            "isVerified": False,
            "isActive": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert farmer into database
        result = farmers_collection.insert_one(farmer_doc)
        
        if result.inserted_id:
            # Update user role to farmer
            users_collection.update_one(
                {"_id": current_user["id"]},
                {"$set": {"role": "farmer", "updatedAt": datetime.utcnow()}}
            )
            
            return BaseResponse(
                success=True,
                message="Farmer profile created successfully",
                data={"farmerId": farmer_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create farmer profile"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create farmer profile: {str(e)}"
        )

@router.get("/", response_model=BaseResponse)
async def get_farmers(
    category: Optional[str] = Query(None, description="Filter by category/specialty"),
    location: Optional[str] = Query(None, description="Filter by location"),
    country: Optional[str] = Query("India", description="Filter by country"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    max_rating: Optional[float] = Query(None, ge=0, le=5, description="Maximum rating"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    """Get list of farmers with filtering and pagination"""
    try:
        farmers_collection = get_collection("farmers")
        
        # Build filter query
        filter_query = {"isActive": True}
        
        if country:
            filter_query["country"] = country
            
        if category:
            filter_query["specialties"] = {"$regex": category, "$options": "i"}
            
        if location:
            filter_query["$or"] = [
                {"state": {"$regex": location, "$options": "i"}},
                {"city": {"$regex": location, "$options": "i"}}
            ]
            
        if is_verified is not None:
            filter_query["isVerified"] = is_verified
            
        if min_rating is not None:
            filter_query["rating"] = {"$gte": min_rating}
            
        if max_rating is not None:
            if "rating" in filter_query:
                filter_query["rating"]["$lte"] = max_rating
            else:
                filter_query["rating"] = {"$lte": max_rating}
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Get farmers with pagination
        farmers = list(farmers_collection.find(filter_query).skip(skip).limit(limit))
        
        # Get total count
        total_count = farmers_collection.count_documents(filter_query)
        
        # Convert ObjectId to string
        for farmer in farmers:
            farmer["id"] = str(farmer["_id"])
            del farmer["_id"]
        
        return BaseResponse(
            success=True,
            message="Farmers retrieved successfully",
            data={
                "farmers": farmers,
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
            detail=f"Failed to retrieve farmers: {str(e)}"
        )

@router.get("/{farmer_id}", response_model=FarmerResponse)
async def get_farmer(farmer_id: str):
    """Get farmer by ID"""
    try:
        farmers_collection = get_collection("farmers")
        
        farmer = farmers_collection.find_one({"_id": farmer_id, "isActive": True})
        if not farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        
        # Convert ObjectId to string
        farmer["id"] = str(farmer["_id"])
        del farmer["_id"]
        
        return FarmerResponse(**farmer)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve farmer: {str(e)}"
        )

@router.put("/{farmer_id}", response_model=BaseResponse)
async def update_farmer(
    farmer_id: str,
    farmer_data: FarmerUpdate,
    current_farmer: dict = Depends(get_current_farmer)
):
    """Update farmer profile"""
    try:
        # Check if farmer is updating their own profile
        if current_farmer["id"] != farmer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only update your own farmer profile"
            )
        
        farmers_collection = get_collection("farmers")
        
        # Prepare update data
        update_data = farmer_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update farmer
        result = farmers_collection.update_one(
            {"_id": farmer_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Farmer profile updated successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found or no changes made"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update farmer profile: {str(e)}"
        )

@router.delete("/{farmer_id}", response_model=BaseResponse)
async def delete_farmer(
    farmer_id: str,
    current_farmer: dict = Depends(get_current_farmer)
):
    """Delete farmer profile (soft delete)"""
    try:
        # Check if farmer is deleting their own profile
        if current_farmer["id"] != farmer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only delete your own farmer profile"
            )
        
        farmers_collection = get_collection("farmers")
        
        # Soft delete by setting isActive to False
        result = farmers_collection.update_one(
            {"_id": farmer_id},
            {"$set": {"isActive": False, "updatedAt": datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Farmer profile deleted successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete farmer profile: {str(e)}"
        )

@router.get("/me/profile", response_model=FarmerResponse)
async def get_my_farmer_profile(current_farmer: dict = Depends(get_current_farmer)):
    """Get current user's farmer profile"""
    return FarmerResponse(**current_farmer)

@router.put("/me/profile", response_model=BaseResponse)
async def update_my_farmer_profile(
    farmer_data: FarmerUpdate,
    current_farmer: dict = Depends(get_current_farmer)
):
    """Update current user's farmer profile"""
    try:
        farmers_collection = get_collection("farmers")
        
        # Prepare update data
        update_data = farmer_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update farmer
        result = farmers_collection.update_one(
            {"_id": current_farmer["id"]},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Farmer profile updated successfully"
            )
        else:
            return BaseResponse(
                success=True,
                message="No changes made to farmer profile"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update farmer profile: {str(e)}"
        ) 