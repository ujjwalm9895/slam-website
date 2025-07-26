from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os

# Import routers
from api import auth, farmers, experts, products, dealers, appointments, orders, admin
from database import init_db, close_db, create_db_and_tables
from config import settings

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Agriculture Platform API",
    description="Backend API for Agriculture Platform - Connect farmers, experts, and dealers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
@app.on_event("startup")
async def startup_event():
    await init_db()
    print("🚀 Agriculture Platform API started successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()
    print("🛑 Agriculture Platform API shutdown!")

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Agriculture Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(farmers.router, prefix="/api/farmers", tags=["Farmers"])
app.include_router(experts.router, prefix="/api/experts", tags=["Experts"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(dealers.router, prefix="/api/dealers", tags=["Dealers"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    ) 