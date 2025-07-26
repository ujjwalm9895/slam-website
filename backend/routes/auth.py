from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from datetime import timedelta
from typing import Optional
from models import UserCreate, LoginRequest, TokenResponse, UserResponse, BaseResponse
from utils.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user,
    generate_user_id
)
from database import get_collection
from config import settings
import uuid
from datetime import datetime

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=BaseResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        users_collection = get_collection("users")
        
        # Check if user already exists
        existing_user = users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if phone already exists
        existing_phone = users_collection.find_one({"phone": user_data.phone})
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )
        
        # Create user document
        user_id = generate_user_id()
        user_doc = {
            "_id": user_id,
            "email": user_data.email,
            "phone": user_data.phone,
            "name": user_data.name,
            "country": user_data.country,
            "language": user_data.language,
            "currency": user_data.currency,
            "timezone": user_data.timezone,
            "password": get_password_hash(user_data.password),
            "role": user_data.role,
            "isVerified": False,
            "isActive": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert user into database
        result = users_collection.insert_one(user_doc)
        
        if result.inserted_id:
            return BaseResponse(
                success=True,
                message="User registered successfully",
                data={
                    "userId": user_id,
                    "email": user_data.email,
                    "role": user_data.role
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    """Login user and return access token"""
    try:
        users_collection = get_collection("users")
        
        # Find user by email
        user = users_collection.find_one({"email": login_data.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(login_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.get("isActive", True):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is deactivated"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": str(user["_id"])}, 
            expires_delta=access_token_expires
        )
        
        # Prepare user response
        user_response = UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            phone=user["phone"],
            name=user["name"],
            country=user["country"],
            language=user["language"],
            currency=user["currency"],
            timezone=user["timezone"],
            role=user["role"],
            isVerified=user.get("isVerified", False),
            createdAt=user["createdAt"],
            updatedAt=user["updatedAt"]
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout", response_model=BaseResponse)
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client should discard token)"""
    # In a more complex system, you might want to blacklist the token
    # For now, we'll just return success as the client should discard the token
    return BaseResponse(
        success=True,
        message="Logged out successfully"
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        phone=current_user["phone"],
        name=current_user["name"],
        country=current_user["country"],
        language=current_user["language"],
        currency=current_user["currency"],
        timezone=current_user["timezone"],
        role=current_user["role"],
        isVerified=current_user.get("isVerified", False),
        createdAt=current_user["createdAt"],
        updatedAt=current_user["updatedAt"]
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh access token"""
    try:
        # Create new access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": current_user["id"]}, 
            expires_delta=access_token_expires
        )
        
        # Prepare user response
        user_response = UserResponse(
            id=current_user["id"],
            email=current_user["email"],
            phone=current_user["phone"],
            name=current_user["name"],
            country=current_user["country"],
            language=current_user["language"],
            currency=current_user["currency"],
            timezone=current_user["timezone"],
            role=current_user["role"],
            isVerified=current_user.get("isVerified", False),
            createdAt=current_user["createdAt"],
            updatedAt=current_user["updatedAt"]
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60,
            user=user_response
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        ) 