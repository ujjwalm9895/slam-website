#!/usr/bin/env python3
"""
Crop Advisory System Backend Runner
"""
import uvicorn
from main import app

if __name__ == "__main__":
    print("🌾 Starting Crop Advisory System Backend...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("💚 Health Check: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 