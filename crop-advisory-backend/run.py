#!/usr/bin/env python3
"""
Crop Advisory System Backend Runner
"""
from main import app

if __name__ == "__main__":
    print("🌾 Starting Crop Advisory System Backend...")
    print("📍 Server will be available at: http://localhost:8001")
    print("💚 Health Check: http://localhost:8001/health")
    print("\nPress Ctrl+C to stop the server")
    
    app.run(
        host="0.0.0.0",
        port=8001,
        debug=True
    ) 