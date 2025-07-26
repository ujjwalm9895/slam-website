from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import (
    OrderCreate, OrderUpdate, OrderResponse, OrderFilter, 
    BaseResponse, PaginationParams, OrderStatus, PaymentStatus
)
from utils.auth import get_current_user, get_current_farmer, generate_order_number
from database import get_collection
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/", response_model=BaseResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new order"""
    try:
        orders_collection = get_collection("orders")
        products_collection = get_collection("products")
        farmers_collection = get_collection("farmers")
        
        # Validate products and calculate total
        total_amount = 0
        farmer_id = None
        farmer_name = None
        
        for item in order_data.items:
            # Get product details
            product = products_collection.find_one({"_id": item.productId, "isAvailable": True})
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product {item.productId} not found or unavailable"
                )
            
            # Check stock
            if product["stockQuantity"] < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product['name']}"
                )
            
            # Calculate item total
            item_total = item.price * item.quantity
            total_amount += item_total
            
            # Set farmer info (all items should be from same farmer)
            if farmer_id is None:
                farmer_id = product["farmerId"]
                farmer = farmers_collection.find_one({"_id": farmer_id})
                if farmer:
                    farmer_name = farmer["name"]
            elif farmer_id != product["farmerId"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="All items must be from the same farmer"
                )
        
        # Create order document
        order_id = str(uuid.uuid4())
        order_number = generate_order_number(order_data.deliveryAddress.country)
        
        order_doc = {
            "_id": order_id,
            "orderNumber": order_number,
            "customerId": current_user["id"],
            "farmerId": farmer_id,
            "farmerName": farmer_name,
            "items": [item.dict() for item in order_data.items],
            "totalAmount": total_amount,
            "currency": "INR",  # Default currency
            "status": OrderStatus.PENDING,
            "paymentStatus": PaymentStatus.PENDING,
            "deliveryAddress": order_data.deliveryAddress.dict(),
            "estimatedDelivery": order_data.estimatedDelivery,
            "actualDelivery": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert order into database
        result = orders_collection.insert_one(order_doc)
        
        if result.inserted_id:
            # Update product stock
            for item in order_data.items:
                products_collection.update_one(
                    {"_id": item.productId},
                    {"$inc": {"stockQuantity": -item.quantity}}
                )
            
            return BaseResponse(
                success=True,
                message="Order created successfully",
                data={
                    "orderId": order_id,
                    "orderNumber": order_number,
                    "totalAmount": total_amount
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create order"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}"
        )

@router.get("/", response_model=BaseResponse)
async def get_orders(
    status: Optional[OrderStatus] = Query(None, description="Filter by order status"),
    payment_status: Optional[PaymentStatus] = Query(None, description="Filter by payment status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(get_current_user)
):
    """Get orders for current user"""
    try:
        orders_collection = get_collection("orders")
        
        # Build filter query
        filter_query = {"customerId": current_user["id"]}
        
        if status:
            filter_query["status"] = status
            
        if payment_status:
            filter_query["paymentStatus"] = payment_status
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Get orders with pagination
        orders = list(orders_collection.find(filter_query).sort("createdAt", -1).skip(skip).limit(limit))
        
        # Get total count
        total_count = orders_collection.count_documents(filter_query)
        
        # Convert ObjectId to string
        for order in orders:
            order["id"] = str(order["_id"])
            del order["_id"]
        
        return BaseResponse(
            success=True,
            message="Orders retrieved successfully",
            data={
                "orders": orders,
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
            detail=f"Failed to retrieve orders: {str(e)}"
        )

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get order by ID"""
    try:
        orders_collection = get_collection("orders")
        
        order = orders_collection.find_one({"_id": order_id, "customerId": current_user["id"]})
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Convert ObjectId to string
        order["id"] = str(order["_id"])
        del order["_id"]
        
        return OrderResponse(**order)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve order: {str(e)}"
        )

@router.put("/{order_id}", response_model=BaseResponse)
async def update_order(
    order_id: str,
    order_data: OrderUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update order status (customer can cancel)"""
    try:
        orders_collection = get_collection("orders")
        
        # Get order
        order = orders_collection.find_one({"_id": order_id, "customerId": current_user["id"]})
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Only allow cancellation if order is pending
        if order["status"] != OrderStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only cancel pending orders"
            )
        
        # Prepare update data
        update_data = order_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update order
        result = orders_collection.update_one(
            {"_id": order_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Order updated successfully"
            )
        else:
            return BaseResponse(
                success=True,
                message="No changes made to order"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update order: {str(e)}"
        )

# Farmer-specific endpoints
@router.get("/farmer/orders", response_model=BaseResponse)
async def get_farmer_orders(
    status: Optional[OrderStatus] = Query(None, description="Filter by order status"),
    payment_status: Optional[PaymentStatus] = Query(None, description="Filter by payment status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_farmer: dict = Depends(get_current_farmer)
):
    """Get orders for current farmer"""
    try:
        orders_collection = get_collection("orders")
        
        # Build filter query
        filter_query = {"farmerId": current_farmer["id"]}
        
        if status:
            filter_query["status"] = status
            
        if payment_status:
            filter_query["paymentStatus"] = payment_status
        
        # Calculate skip value for pagination
        skip = (page - 1) * limit
        
        # Get orders with pagination
        orders = list(orders_collection.find(filter_query).sort("createdAt", -1).skip(skip).limit(limit))
        
        # Get total count
        total_count = orders_collection.count_documents(filter_query)
        
        # Convert ObjectId to string
        for order in orders:
            order["id"] = str(order["_id"])
            del order["_id"]
        
        return BaseResponse(
            success=True,
            message="Farmer orders retrieved successfully",
            data={
                "orders": orders,
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
            detail=f"Failed to retrieve farmer orders: {str(e)}"
        )

@router.put("/farmer/{order_id}", response_model=BaseResponse)
async def update_farmer_order(
    order_id: str,
    order_data: OrderUpdate,
    current_farmer: dict = Depends(get_current_farmer)
):
    """Update order status (farmer can update status)"""
    try:
        orders_collection = get_collection("orders")
        
        # Get order
        order = orders_collection.find_one({"_id": order_id, "farmerId": current_farmer["id"]})
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Prepare update data
        update_data = order_data.dict(exclude_unset=True)
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update order
        result = orders_collection.update_one(
            {"_id": order_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return BaseResponse(
                success=True,
                message="Order updated successfully"
            )
        else:
            return BaseResponse(
                success=True,
                message="No changes made to order"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update order: {str(e)}"
        ) 