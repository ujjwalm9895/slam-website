from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from models import User, Order, OrderCreate, OrderResponse, OrderStatus, OrderItem, OrderItemBase
from utils.auth import get_current_user, generate_order_number
from database import get_session

router = APIRouter()

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new order"""
    try:
        # Calculate total amount
        total_amount = sum(item.price * item.quantity for item in order_data.items)
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            customer_id=current_user.id,
            delivery_address=order_data.delivery_address,
            delivery_phone=order_data.delivery_phone,
            notes=order_data.notes,
            total_amount=total_amount,
            status=OrderStatus.PENDING
        )
        
        session.add(order)
        await session.commit()
        await session.refresh(order)
        
        # Create order items
        for item_data in order_data.items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data.product_id,
                quantity=item_data.quantity,
                price=item_data.price
            )
            session.add(order_item)
        
        await session.commit()
        
        return OrderResponse(
            id=order.id,
            order_number=order.order_number,
            customer_id=order.customer_id,
            delivery_address=order.delivery_address,
            delivery_phone=order.delivery_phone,
            notes=order.notes,
            total_amount=order.total_amount,
            status=order.status,
            created_at=order.created_at,
            items=order_data.items
        )

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}"
        )

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Get orders for current user"""
    try:
        result = await session.execute(
            select(Order).where(Order.customer_id == current_user.id)
        )
        orders = result.scalars().all()
        
        order_responses = []
        for order in orders:
            # Get order items
            items_result = await session.execute(
                select(OrderItem).where(OrderItem.order_id == order.id)
            )
            items = items_result.scalars().all()
            
            order_items = [
                OrderItemBase(
                    quantity=item.quantity,
                    price=item.price
                ) for item in items
            ]
            
            order_responses.append(OrderResponse(
                id=order.id,
                order_number=order.order_number,
                customer_id=order.customer_id,
                delivery_address=order.delivery_address,
                delivery_phone=order.delivery_phone,
                notes=order.notes,
                total_amount=order.total_amount,
                status=order.status,
                created_at=order.created_at,
                items=order_items
            ))
        
        return order_responses

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch orders: {str(e)}"
        )

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Get a specific order by ID"""
    try:
        result = await session.execute(
            select(Order).where(Order.id == order_id, Order.customer_id == current_user.id)
        )
        order = result.scalar_one_or_none()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Get order items
        items_result = await session.execute(
            select(OrderItem).where(OrderItem.order_id == order.id)
        )
        items = items_result.scalars().all()
        
        order_items = [
            OrderItemBase(
                quantity=item.quantity,
                price=item.price
            ) for item in items
        ]
        
        return OrderResponse(
            id=order.id,
            order_number=order.order_number,
            customer_id=order.customer_id,
            delivery_address=order.delivery_address,
            delivery_phone=order.delivery_phone,
            notes=order.notes,
            total_amount=order.total_amount,
            status=order.status,
            created_at=order.created_at,
            items=order_items
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch order: {str(e)}"
        ) 