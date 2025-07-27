from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import Product, ProductCategory
from typing import Optional

router = APIRouter()

@router.get("/")
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    session: AsyncSession = Depends(get_session)
):
    """Get all products, optionally filtered by category"""
    try:
        if category:
            # Convert category to lowercase and map to enum
            category_lower = category.lower()
            if category_lower == "seeds":
                category_enum = ProductCategory.SEEDS
            elif category_lower == "fertilizers":
                category_enum = ProductCategory.FERTILIZERS
            elif category_lower == "drones":
                category_enum = ProductCategory.DRONES
            elif category_lower == "tractors":
                category_enum = ProductCategory.TRACTORS
            elif category_lower == "robots":
                category_enum = ProductCategory.ROBOTS
            elif category_lower == "machinery":
                category_enum = ProductCategory.MACHINERY
            else:
                # Return empty list for unknown category
                return []
            
            result = await session.execute(
                select(Product).where(Product.category == category_enum)
            )
        else:
            result = await session.execute(select(Product))
        
        products = result.scalars().all()
        return products
    except Exception as e:
        # Return empty list for any errors
        return []

@router.get("/{product_id}")
async def get_product(product_id: int, session: AsyncSession = Depends(get_session)):
    """Get specific product by ID"""
    result = await session.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product 