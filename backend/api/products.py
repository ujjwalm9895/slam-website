from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_session
from models import Product, ProductCategory

router = APIRouter()

@router.get("/")
async def get_products(
    category: ProductCategory = None,
    session: AsyncSession = Depends(get_session)
):
    """Get all products, optionally filtered by category"""
    if category:
        result = await session.execute(
            select(Product).where(Product.category == category)
        )
    else:
        result = await session.execute(select(Product))
    
    products = result.scalars().all()
    return products

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