from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import sqlite3
from datetime import datetime
import os
from typing import List, Optional

app = Flask(__name__)
CORS(app)

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

# OpenWeatherMap API configuration
OPENWEATHER_API_KEY = "your_openweather_api_key_here"  # Replace with your API key
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

def get_weather_data(location: str) -> dict:
    """Fetch weather data from OpenWeatherMap API"""
    try:
        params = {
            "q": location,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        response = requests.get(OPENWEATHER_BASE_URL, params=params)
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

@app.route('/get-advisory', methods=['POST'])
def get_crop_advisory():
    """Generate crop advisory based on location and weather"""
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'location' not in data or 'crop' not in data:
            return jsonify({"error": "Missing required fields: name, location, crop"}), 400
        
        name = data['name']
        location = data['location']
        crop = data['crop']
        
        # Get weather data
        weather_data = get_weather_data(location)
        temperature = weather_data["temperature"]
        humidity = weather_data["humidity"]
        
        # Generate advisory
        alerts, recommendations = generate_advisory(crop, temperature, humidity)
        
        # Log the session
        log_advisory(name, location, crop, temperature, humidity, alerts, recommendations)
        
        return jsonify({
            "location": location,
            "temperature": temperature,
            "humidity": humidity,
            "alerts": alerts,
            "recommendations": recommendations,
            "success": True,
            "message": "Advisory generated successfully"
        })
        
    except Exception as e:
        return jsonify({"error": f"Error generating advisory: {str(e)}"}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Crop Advisory System"})

@app.route('/logs')
def get_logs():
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
        
        return jsonify({
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
        })
    except Exception as e:
        return jsonify({"error": f"Error fetching logs: {str(e)}"}), 500

if __name__ == "__main__":
    print("🌾 Starting Crop Advisory System Backend...")
    print("📍 Server will be available at: http://localhost:8001")
    print("💚 Health Check: http://localhost:8001/health")
    print("\nPress Ctrl+C to stop the server")
    
    app.run(host="0.0.0.0", port=8001, debug=True) 