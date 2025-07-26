from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from models import Product, ProductCreate, ProductResponse, ProductCategory, Dealer, DealerResponse

from database import get_session

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[ProductCategory] = Query(None),
    session: AsyncSession = Depends(get_session)
):
    """Get all products with optional category filtering"""
    try:
        query = select(Product)
        
        if category:
            query = query.where(Product.category == category)
        
        result = await session.execute(
            query.offset(skip).limit(limit)
        )
        products = result.scalars().all()
        
        # Convert to response format
        product_responses = []
        for product in products:
            dealer_response = None
            if product.dealer_id:
                dealer_result = await session.execute(select(Dealer).where(Dealer.id == product.dealer_id))
                dealer = dealer_result.scalar_one_or_none()
                if dealer:
                    dealer_response = DealerResponse(
                        id=dealer.id,
                        user_id=dealer.user_id,
                        company_name=dealer.company_name,
                        location=dealer.location,
                        specialization=dealer.specialization,
                        description=dealer.description,
                        rating=dealer.rating
                    )
            
            product_responses.append(ProductResponse(
                id=product.id,
                dealer_id=product.dealer_id,
                name=product.name,
                category=product.category,
                description=product.description,
                price=product.price,
                currency=product.currency,
                unit=product.unit,
                stock_quantity=product.stock_quantity,
                is_available=product.is_available,
                image_url=product.image_url,
                rating=product.rating,
                total_reviews=product.total_reviews,
                dealer=dealer_response
            ))
        
        return product_responses

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch products: {str(e)}"
        )

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get a specific product by ID"""
    try:
        result = await session.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        dealer_response = None
        if product.dealer_id:
            dealer_result = await session.execute(select(Dealer).where(Dealer.id == product.dealer_id))
            dealer = dealer_result.scalar_one_or_none()
            if dealer:
                dealer_response = DealerResponse(
                    id=dealer.id,
                    user_id=dealer.user_id,
                    company_name=dealer.company_name,
                    location=dealer.location,
                    specialization=dealer.specialization,
                    description=dealer.description,
                    rating=dealer.rating
                )
        
        return ProductResponse(
            id=product.id,
            dealer_id=product.dealer_id,
            name=product.name,
            category=product.category,
            description=product.description,
            price=product.price,
            currency=product.currency,
            unit=product.unit,
            stock_quantity=product.stock_quantity,
            is_available=product.is_available,
            image_url=product.image_url,
            rating=product.rating,
            total_reviews=product.total_reviews,
            dealer=dealer_response
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch product: {str(e)}"
        ) 