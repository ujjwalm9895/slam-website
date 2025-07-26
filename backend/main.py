from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from api import auth, farmers, experts, products, dealers, appointments, orders, admin

app = FastAPI(
    title="SLAM Robotics Agriculture Platform",
    description="Full-stack agriculture platform with farmer marketplace, expert consultations, and product management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(farmers.router, prefix="/api/farmers", tags=["Farmers"])
app.include_router(experts.router, prefix="/api/experts", tags=["Experts"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(dealers.router, prefix="/api/dealers", tags=["Dealers"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "SLAM Robotics Agriculture Platform API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 