from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    FARMER = "farmer"
    EXPERT = "expert"
    DEALER = "dealer"
    ADMIN = "admin"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class ProductCategory(str, Enum):
    DRONES = "drones"
    TRACTORS = "tractors"
    ROBOTS = "robots"
    SEEDS = "seeds"
    FERTILIZERS = "fertilizers"
    MACHINERY = "machinery"

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Base models
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    phone: str = Field(max_length=15)
    name: str = Field(max_length=100)
    country: str = Field(default="India")
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)

class User(UserBase, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    role: UserRole
    status: str = Field(default="pending")  # pending, approved, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Farmer(UserBase, table=True):
    __tablename__ = "farmers"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    farm_size: Optional[float] = None
    crop_types: Optional[str] = None
    experience_years: Optional[int] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    rating: Optional[float] = Field(default=0.0)
    total_orders: int = Field(default=0)

class Expert(UserBase, table=True):
    __tablename__ = "experts"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    specialization: str
    qualification: str
    experience_years: int
    consultation_fee: float
    rating: Optional[float] = Field(default=0.0)
    total_consultations: int = Field(default=0)

class Dealer(UserBase, table=True):
    __tablename__ = "dealers"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    company_name: str
    business_type: str
    products_offered: Optional[str] = None
    rating: Optional[float] = Field(default=0.0)
    total_sales: int = Field(default=0)

class Product(SQLModel, table=True):
    __tablename__ = "products"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    category: ProductCategory
    price: float
    dealer_id: int = Field(foreign_key="dealers.id")
    stock_quantity: int
    image_url: Optional[str] = None
    rating: Optional[float] = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Order(SQLModel, table=True):
    __tablename__ = "orders"
    id: Optional[int] = Field(default=None, primary_key=True)
    farmer_id: int = Field(foreign_key="farmers.id")
    product_id: int = Field(foreign_key="products.id")
    quantity: int
    total_amount: float
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    delivery_address: str
    delivery_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"
    id: Optional[int] = Field(default=None, primary_key=True)
    farmer_id: int = Field(foreign_key="farmers.id")
    expert_id: int = Field(foreign_key="experts.id")
    service_type: str
    preferred_date: datetime
    notes: Optional[str] = None
    status: AppointmentStatus = Field(default=AppointmentStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Review(SQLModel, table=True):
    __tablename__ = "reviews"
    id: Optional[int] = Field(default=None, primary_key=True)
    reviewer_id: int = Field(foreign_key="users.id")
    reviewed_id: int = Field(foreign_key="users.id")
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow) 