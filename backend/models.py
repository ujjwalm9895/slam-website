from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid

# Enums
class UserRole(str, Enum):
    FARMER = "farmer"
    EXPERT = "expert"
    DEALER = "dealer"
    ADMIN = "admin"

class ProductCategory(str, Enum):
    DRONES = "Drones"
    TRACTORS = "Tractors"
    ROBOTS = "Robots"
    SEEDS = "Seeds"
    FERTILIZERS = "Fertilizers"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Base Models
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
    
    # Relationships
    farmer_profile: Optional["Farmer"] = Relationship(back_populates="user")
    expert_profile: Optional["Expert"] = Relationship(back_populates="user")
    dealer_profile: Optional["Dealer"] = Relationship(back_populates="user")
    orders: List["Order"] = Relationship(back_populates="customer")
    appointments: List["Appointment"] = Relationship(back_populates="customer")

class UserCreate(UserBase):
    password: str
    role: UserRole

class UserLogin(SQLModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    status: str
    created_at: datetime

class AdminUserResponse(UserBase):
    id: int
    role: UserRole
    status: str
    created_at: datetime
    updated_at: datetime

# Farmer Models
class FarmerBase(SQLModel):
    location: str = Field(max_length=100)
    crop_type: str = Field(max_length=100)
    farm_size: float
    farm_size_unit: str = Field(default="acres")
    description: str = Field(max_length=500)
    is_online: bool = Field(default=False)

class Farmer(FarmerBase, table=True):
    __tablename__ = "farmers"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    rating: float = Field(default=0.0)
    total_reviews: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="farmer_profile")
    reviews: List["Review"] = Relationship(back_populates="farmer")

class FarmerCreate(FarmerBase):
    pass

class FarmerResponse(FarmerBase):
    id: int
    user_id: int
    rating: float
    total_reviews: int
    user: UserResponse

# Expert Models
class ExpertBase(SQLModel):
    domain: str = Field(max_length=100)
    experience: str = Field(max_length=50)
    description: str = Field(max_length=500)
    consultation_fee: float

class Expert(ExpertBase, table=True):
    __tablename__ = "experts"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    rating: float = Field(default=0.0)
    total_consultations: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="expert_profile")
    appointments: List["Appointment"] = Relationship(back_populates="expert")

class ExpertCreate(ExpertBase):
    pass

class ExpertResponse(ExpertBase):
    id: int
    user_id: int
    rating: float
    total_consultations: int
    user: UserResponse

# Dealer Models
class DealerBase(SQLModel):
    company_name: str = Field(max_length=100)
    location: str = Field(max_length=100)
    specialization: str = Field(max_length=100)
    description: str = Field(max_length=500)

class Dealer(DealerBase, table=True):
    __tablename__ = "dealers"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    rating: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="dealer_profile")
    products: List["Product"] = Relationship(back_populates="dealer")

class DealerCreate(DealerBase):
    pass

class DealerResponse(DealerBase):
    id: int
    user_id: int
    rating: float
    user: UserResponse

# Product Models
class ProductBase(SQLModel):
    name: str = Field(max_length=100)
    category: ProductCategory
    description: str = Field(max_length=500)
    price: float
    currency: str = Field(default="INR")
    unit: str = Field(default="piece")
    stock_quantity: int
    is_available: bool = Field(default=True)
    image_url: Optional[str] = None

class Product(ProductBase, table=True):
    __tablename__ = "products"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    dealer_id: Optional[int] = Field(foreign_key="dealers.id", default=None)
    rating: float = Field(default=0.0)
    total_reviews: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    dealer: Optional[Dealer] = Relationship(back_populates="products")
    order_items: List["OrderItem"] = Relationship(back_populates="product")

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    dealer_id: Optional[int]
    rating: float
    total_reviews: int
    dealer: Optional[DealerResponse]

# Order Models
class OrderItemBase(SQLModel):
    quantity: int
    price: float

class OrderItem(OrderItemBase, table=True):
    __tablename__ = "order_items"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id")
    product_id: int = Field(foreign_key="products.id")
    
    # Relationships
    order: "Order" = Relationship(back_populates="items")
    product: Product = Relationship(back_populates="order_items")

class OrderBase(SQLModel):
    delivery_address: str = Field(max_length=500)
    delivery_phone: str = Field(max_length=15)
    notes: Optional[str] = None

class Order(OrderBase, table=True):
    __tablename__ = "orders"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    order_number: str = Field(unique=True, index=True)
    customer_id: int = Field(foreign_key="users.id")
    total_amount: float
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    customer: User = Relationship(back_populates="orders")
    items: List[OrderItem] = Relationship(back_populates="order")

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class OrderResponse(OrderBase):
    id: int
    order_number: str
    customer_id: int
    total_amount: float
    status: OrderStatus
    created_at: datetime
    items: List[OrderItemBase]

# Appointment Models
class AppointmentBase(SQLModel):
    service_type: str = Field(max_length=100)
    preferred_date: datetime
    notes: Optional[str] = None

class Appointment(AppointmentBase, table=True):
    __tablename__ = "appointments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="users.id")
    expert_id: Optional[int] = Field(foreign_key="experts.id", default=None)
    status: AppointmentStatus = Field(default=AppointmentStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    customer: User = Relationship(back_populates="appointments")
    expert: Optional[Expert] = Relationship(back_populates="appointments")

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    customer_id: int
    expert_id: Optional[int]
    status: AppointmentStatus
    created_at: datetime
    customer: UserResponse
    expert: Optional[ExpertResponse]

# Review Models
class ReviewBase(SQLModel):
    rating: int = Field(ge=1, le=5)
    comment: str = Field(max_length=500)

class Review(ReviewBase, table=True):
    __tablename__ = "reviews"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="users.id")
    farmer_id: int = Field(foreign_key="farmers.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    customer: User = Relationship()
    farmer: Farmer = Relationship(back_populates="reviews")

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    customer_id: int
    farmer_id: int
    created_at: datetime
    customer: UserResponse

# Token Models
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(SQLModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None 