from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import (
    RatingCreate, RatingUpdate, RatingResponse, 
    BaseResponse, PaginationParams
)
from utils.auth import get_current_user
from database import get_collection
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/", response_model=BaseResponse)
async def create_rating(
    rating_data: RatingCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new rating"""
    try:
        ratings_collection = get_collection("ratings")
        farmers_collection = get_collection("farmers")
        
        # Get farmer details
        farmer = farmers_collection.find_one({"_id": rating_data.farmerId})
        if not farmer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        
        # Create rating document
        rating_id = str(uuid.uuid4())
        rating_doc = {
            "_id": rating_id,
            "farmerId": rating_data.farmerId,
            "farmerName": farmer["name"],
            "customerId": current_user["id"],
            "customerName": current_user["name"],
            "rating": rating_data.rating,
            "review": rating_data.review,
            "productId": rating_data.productId,
            "orderId": rating_data.orderId,
            "visitRating": rating_data.visitRating,
            "visitReview": rating_data.visitReview,
            "language": current_user.get("language", "en"),
            "isVerified": False,
            "helpfulVotes": 0,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert rating into database
        result = ratings_collection.insert_one(rating_doc)
        
        if result.inserted_id:
            # Update farmer's average rating
            await update_farmer_rating(rating_data.farmerId)
            
            return BaseResponse(
                success=True,
                message="Rating submitted successfully",
                data={"ratingId": rating_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create rating"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create rating: {str(e)}"
        )

@router.get("/", response_model=BaseResponse)
async def get_ratings(
    farmer_id: Optional[str] = Query(None, description="Filter by farmer ID"),
    customer_id: Optional[str] = Query(None, description="Filter by customer ID"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    """Get ratings with filtering"""
    try:
        ratings_collection = get_collection("ratings")
        
        # Build filter query
        filter_query = {}
        
        if farmer_id:
            filter_query["farmerId"] = farmer_id
            
        if customer_id:
            filter_query["customerId"] = customer_id
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Get ratings with pagination
        ratings = list(ratings_collection.find(filter_query).sort("createdAt", -1).skip(skip).limit(limit))
        
        # Get total count
        total_count = ratings_collection.count_documents(filter_query)
        
        # Convert ObjectId to string
        for rating in ratings:
            rating["id"] = str(rating["_id"])
            del rating["_id"]
        
        return BaseResponse(
            success=True,
            message="Ratings retrieved successfully",
            data={
                "ratings": ratings,
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
            detail=f"Failed to retrieve ratings: {str(e)}"
        )

@router.get("/{rating_id}", response_model=RatingResponse)
async def get_rating(rating_id: str):
    """Get rating by ID"""
    try:
        ratings_collection = get_collection("ratings")
        
        rating = ratings_collection.find_one({"_id": rating_id})
        if not rating:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rating not found"
            )
        
        # Convert ObjectId to string
        rating["id"] = str(rating["_id"])
        del rating["_id"]
        
        return RatingResponse(**rating)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve rating: {str(e)}"
        )

@router.put("/{rating_id}", response_model=BaseResponse)
async def update_rating(
    rating_id: str,
    rating_data: RatingUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update rating (only by the customer who created it)"""
    try:
        ratings_collection = get_collection("ratings")
        
        # Get rating
        rating = ratings_collection.find_one({"_id": rating_id, "customerId": current_user["id"]})
        if not rating:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rating not found"
            )
        
        # Prepare update data
        update_data = rating_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update rating
        result = ratings_collection.update_one(
            {"_id": rating_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            # Update farmer's average rating
            await update_farmer_rating(rating["farmerId"])
            
            return BaseResponse(
                success=True,
                message="Rating updated successfully"
            )
        else:
            return BaseResponse(
                success=True,
                message="No changes made to rating"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update rating: {str(e)}"
        )

@router.delete("/{rating_id}", response_model=BaseResponse)
async def delete_rating(
    rating_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete rating (only by the customer who created it)"""
    try:
        ratings_collection = get_collection("ratings")
        
        # Get rating
        rating = ratings_collection.find_one({"_id": rating_id, "customerId": current_user["id"]})
        if not rating:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rating not found"
            )
        
        # Delete rating
        result = ratings_collection.delete_one({"_id": rating_id})
        
        if result.deleted_count > 0:
            # Update farmer's average rating
            await update_farmer_rating(rating["farmerId"])
            
            return BaseResponse(
                success=True,
                message="Rating deleted successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete rating"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete rating: {str(e)}"
        )

async def update_farmer_rating(farmer_id: str):
    """Update farmer's average rating and total reviews"""
    try:
        ratings_collection = get_collection("ratings")
        farmers_collection = get_collection("farmers")
        
        # Get all ratings for the farmer
        ratings = list(ratings_collection.find({"farmerId": farmer_id}))
        
        if ratings:
            # Calculate average rating
            total_rating = sum(rating["rating"] for rating in ratings)
            average_rating = total_rating / len(ratings)
            
            # Update farmer's rating
            farmers_collection.update_one(
                {"_id": farmer_id},
                {
                    "$set": {
                        "rating": round(average_rating, 1),
                        "totalReviews": len(ratings),
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
        else:
            # Reset rating if no reviews
            farmers_collection.update_one(
                {"_id": farmer_id},
                {
                    "$set": {
                        "rating": 0.0,
                        "totalReviews": 0,
                        "updatedAt": datetime.utcnow()
                    }
                }
            )
            
    except Exception as e:
        print(f"Error updating farmer rating: {e}") 