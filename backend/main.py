import logging
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
from database import init_db
from api import auth, farmers, experts, products, dealers, appointments, orders, admin
from config import settings
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import sqlite3
from datetime import datetime
import os
from typing import List, Optional

# Configure logging to only use stdout (no file logging)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting SLAM Robotics Agriculture Platform API...")
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down SLAM Robotics Agriculture Platform API...")

# Create FastAPI app with proper configuration
app = FastAPI(
    title="SLAM Robotics Agriculture Platform",
    description="Full-stack agriculture platform with farmer marketplace, expert consultations, and product management",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"] if settings.debug else ["klipsmart.shop", "www.klipsmart.shop", "*.run.app", "api.klipsmart.shop"]
)

# CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"error": "Validation error", "details": exc.errors()}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc) if settings.debug else "Something went wrong"}
    )

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(farmers.router, prefix="/api/farmers", tags=["Farmers"])
app.include_router(experts.router, prefix="/api/experts", tags=["Experts"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(dealers.router, prefix="/api/dealers", tags=["Dealers"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with basic information"""
    return {
        "message": "SLAM Robotics Agriculture Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs" if settings.debug else None
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers and monitoring"""
    return {
        "status": "healthy",
        "service": "SLAM Robotics Agriculture Platform API",
        "version": "1.0.0"
    }

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"{request.method} {request.url.path} - {response.status_code}")
    return response

# Forwarded headers middleware for Cloud Run
@app.middleware("http")
async def forwarded_headers_middleware(request: Request, call_next):
    """Handle forwarded headers for Cloud Run"""
    # Set forwarded headers for Cloud Run
    if "x-forwarded-proto" in request.headers:
        request.scope["scheme"] = request.headers["x-forwarded-proto"]
    if "x-forwarded-host" in request.headers:
        request.scope["headers"] = [(b"host", request.headers["x-forwarded-host"].encode())]
    
    response = await call_next(request)
    return response

# Run the application
if __name__ == "__main__":
    import os
    
    # Check if SSL certificates exist
    ssl_keyfile = "key.pem" if os.path.exists("key.pem") else None
    ssl_certfile = "cert.pem" if os.path.exists("cert.pem") else None
    
    # Use HTTPS if certificates exist, otherwise HTTP
    port = 8443 if ssl_keyfile and ssl_certfile else 8000
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.debug,
        log_level="info",
        ssl_keyfile=ssl_keyfile,
        ssl_certfile=ssl_certfile
    ) 

app = FastAPI(title="Crop Advisory System", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def init_db():
    conn = sqlite3.connect('advisory_logs.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS advisory_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            crop TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            temperature REAL,
            humidity REAL,
            alerts TEXT,
            recommendations TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

class AdvisoryRequest(BaseModel):
    name: str
    location: str
    crop: str

class AdvisoryResponse(BaseModel):
    location: str
    temperature: float
    humidity: float
    alerts: List[str]
    recommendations: List[str]
    success: bool
    message: str

# OpenWeatherMap API configuration
OPENWEATHER_API_KEY = "your_openweather_api_key_here"  # Replace with your API key
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

async def get_weather_data(location: str) -> dict:
    """Fetch weather data from OpenWeatherMap API"""
    try:
        async with httpx.AsyncClient() as client:
            params = {
                "q": location,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
            response = await client.get(OPENWEATHER_BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "description": data["weather"][0]["description"]
            }
    except Exception as e:
        print(f"Weather API error: {e}")
        # Return default values for demo purposes
        return {
            "temperature": 25.0,
            "humidity": 65.0,
            "description": "Partly cloudy"
        }

def generate_advisory(crop: str, temperature: float, humidity: float) -> tuple:
    """Generate crop advisory based on weather conditions"""
    alerts = []
    recommendations = []
    
    # Wheat advisory logic
    if crop.lower() == "wheat":
        if humidity > 70:
            alerts.append("⚠️ High risk of wheat rust due to high humidity")
            recommendations.append("Apply Mancozeb fungicide (2.5 kg/ha)")
            recommendations.append("Reduce irrigation frequency")
        
        if temperature > 30:
            alerts.append("🌡️ High temperature stress detected")
            recommendations.append("Increase irrigation frequency")
            recommendations.append("Apply foliar spray with micronutrients")
        
        if temperature < 15:
            alerts.append("❄️ Low temperature may affect growth")
            recommendations.append("Delay irrigation until temperature rises")
            recommendations.append("Consider using row covers")
        
        if 20 <= temperature <= 25 and 50 <= humidity <= 65:
            recommendations.append("✅ Optimal conditions for wheat growth")
            recommendations.append("Continue regular irrigation schedule")
            recommendations.append("Monitor for early signs of pests")
    
    # Tomato advisory logic
    elif crop.lower() == "tomato":
        if humidity > 80:
            alerts.append("⚠️ High risk of early blight and late blight")
            recommendations.append("Apply Copper oxychloride (3g/liter)")
            recommendations.append("Improve air circulation")
            recommendations.append("Avoid overhead irrigation")
        
        if temperature > 35:
            alerts.append("🌡️ Heat stress may cause flower drop")
            recommendations.append("Increase shade net coverage")
            recommendations.append("Apply calcium nitrate foliar spray")
            recommendations.append("Water in early morning or evening")
        
        if temperature < 10:
            alerts.append("❄️ Cold stress may affect fruit setting")
            recommendations.append("Use plastic mulch to retain soil heat")
            recommendations.append("Consider greenhouse cultivation")
        
        if 20 <= temperature <= 30 and 60 <= humidity <= 70:
            recommendations.append("✅ Optimal conditions for tomato growth")
            recommendations.append("Maintain regular pruning schedule")
            recommendations.append("Monitor for whitefly and aphids")
    
    # Cotton advisory logic
    elif crop.lower() == "cotton":
        if humidity > 75:
            alerts.append("⚠️ High risk of bacterial blight and boll rot")
            recommendations.append("Apply Streptomycin sulfate (500 ppm)")
            recommendations.append("Remove infected plant parts")
            recommendations.append("Improve field drainage")
        
        if temperature > 40:
            alerts.append("🌡️ Extreme heat may cause boll shedding")
            recommendations.append("Increase irrigation frequency")
            recommendations.append("Apply potassium nitrate spray")
            recommendations.append("Use shade nets during peak hours")
        
        if temperature < 15:
            alerts.append("❄️ Cold stress may delay flowering")
            recommendations.append("Delay sowing until temperature rises")
            recommendations.append("Use plastic mulch for soil warming")
        
        if 25 <= temperature <= 35 and 50 <= humidity <= 70:
            recommendations.append("✅ Optimal conditions for cotton growth")
            recommendations.append("Monitor for pink bollworm")
            recommendations.append("Maintain proper plant spacing")
            recommendations.append("Apply balanced NPK fertilizer")
    
    # General recommendations based on weather
    if not alerts:
        recommendations.append("🌤️ Weather conditions are favorable for crop growth")
    
    if not recommendations:
        recommendations.append("📋 Continue with regular farming practices")
        recommendations.append("🔍 Monitor crop health regularly")
    
    return alerts, recommendations

def log_advisory(name: str, location: str, crop: str, temperature: float, 
                 humidity: float, alerts: List[str], recommendations: List[str]):
    """Log advisory session to SQLite database"""
    try:
        conn = sqlite3.connect('advisory_logs.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO advisory_logs 
            (name, location, crop, temperature, humidity, alerts, recommendations)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            name, location, crop, temperature, humidity,
            '; '.join(alerts), '; '.join(recommendations)
        ))
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database logging error: {e}")

@app.post("/get-advisory", response_model=AdvisoryResponse)
async def get_crop_advisory(request: AdvisoryRequest):
    """Generate crop advisory based on location and weather"""
    try:
        # Get weather data
        weather_data = await get_weather_data(request.location)
        temperature = weather_data["temperature"]
        humidity = weather_data["humidity"]
        
        # Generate advisory
        alerts, recommendations = generate_advisory(
            request.crop, temperature, humidity
        )
        
        # Log the session
        log_advisory(
            request.name, request.location, request.crop,
            temperature, humidity, alerts, recommendations
        )
        
        return AdvisoryResponse(
            location=request.location,
            temperature=temperature,
            humidity=humidity,
            alerts=alerts,
            recommendations=recommendations,
            success=True,
            message="Advisory generated successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating advisory: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Crop Advisory System"}

@app.get("/logs")
async def get_logs():
    """Get recent advisory logs (for debugging)"""
    try:
        conn = sqlite3.connect('advisory_logs.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT name, location, crop, timestamp, temperature, humidity, alerts, recommendations
            FROM advisory_logs 
            ORDER BY timestamp DESC 
            LIMIT 10
        ''')
        logs = cursor.fetchall()
        conn.close()
        
        return {
            "logs": [
                {
                    "name": log[0],
                    "location": log[1],
                    "crop": log[2],
                    "timestamp": log[3],
                    "temperature": log[4],
                    "humidity": log[5],
                    "alerts": log[6],
                    "recommendations": log[7]
                }
                for log in logs
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching logs: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 