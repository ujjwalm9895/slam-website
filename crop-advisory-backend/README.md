# 🌾 Crop Advisory System Backend

A FastAPI-based backend for an AI-powered crop advisory system that provides personalized farming recommendations based on weather conditions.

## 🚀 Features

- **Weather Integration**: Real-time weather data from OpenWeatherMap API
- **Smart Advisory Logic**: Rule-based recommendations for Wheat, Tomato, and Cotton
- **Database Logging**: SQLite database for session tracking
- **RESTful API**: Clean FastAPI endpoints with automatic documentation
- **CORS Support**: Ready for frontend integration

## 📋 Requirements

- Python 3.10+
- FastAPI
- Uvicorn
- httpx
- pydantic

## 🛠️ Installation

1. **Clone or create the project directory:**
   ```bash
   mkdir crop-advisory-backend
   cd crop-advisory-backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up OpenWeatherMap API:**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Replace `your_openweather_api_key_here` in `main.py` with your actual API key

## 🏃‍♂️ Running the Backend

### Option 1: Using the run script
```bash
python run.py
```

### Option 2: Using uvicorn directly
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Using Python module
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 🌐 API Endpoints

### POST `/get-advisory`
Generate crop advisory based on location and weather.

**Request Body:**
```json
{
    "name": "John Doe",
    "location": "Mumbai, Maharashtra",
    "crop": "Wheat"
}
```

**Response:**
```json
{
    "location": "Mumbai, Maharashtra",
    "temperature": 28.5,
    "humidity": 75.0,
    "alerts": ["⚠️ High risk of wheat rust due to high humidity"],
    "recommendations": [
        "Apply Mancozeb fungicide (2.5 kg/ha)",
        "Reduce irrigation frequency"
    ],
    "success": true,
    "message": "Advisory generated successfully"
}
```

### GET `/health`
Health check endpoint.

### GET `/logs`
Get recent advisory logs (for debugging).

## 🗄️ Database Schema

The system uses SQLite with the following schema:

```sql
CREATE TABLE advisory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    crop TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature REAL,
    humidity REAL,
    alerts TEXT,
    recommendations TEXT
);
```

## 🌾 Supported Crops

### Wheat
- **High Humidity (>70%)**: Rust risk, fungicide recommendations
- **High Temperature (>30°C)**: Heat stress, irrigation adjustments
- **Low Temperature (<15°C)**: Cold stress, row covers
- **Optimal (20-25°C, 50-65% humidity)**: Regular monitoring

### Tomato
- **High Humidity (>80%)**: Blight risk, copper treatments
- **High Temperature (>35°C)**: Heat stress, shade nets
- **Low Temperature (<10°C)**: Cold stress, greenhouse options
- **Optimal (20-30°C, 60-70% humidity)**: Regular pruning

### Cotton
- **High Humidity (>75%)**: Bacterial blight, streptomycin
- **High Temperature (>40°C)**: Boll shedding, potassium nitrate
- **Low Temperature (<15°C)**: Delayed flowering, plastic mulch
- **Optimal (25-35°C, 50-70% humidity)**: Pink bollworm monitoring

## 🔧 Configuration

### Environment Variables
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key

### API Configuration
- **Base URL**: `http://localhost:8000`
- **CORS**: Configured for all origins (customize for production)
- **Database**: SQLite file (`advisory_logs.db`)

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### Sample Advisory Request
```bash
curl -X POST "http://localhost:8000/get-advisory" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Farmer",
       "location": "Pune, Maharashtra",
       "crop": "Wheat"
     }'
```

## 🚀 Deployment

### Local Development
The backend is ready for local development and testing.

### Production Deployment
For production deployment:
1. Update CORS settings in `main.py`
2. Use environment variables for API keys
3. Consider using PostgreSQL instead of SQLite
4. Add authentication and rate limiting
5. Deploy to your preferred cloud platform

## 📝 Logs

The system automatically logs all advisory sessions to the SQLite database. You can view recent logs via the `/logs` endpoint.

## 🔗 Frontend Integration

The backend is designed to work with the provided HTML frontend. The frontend can be:
- Embedded as an iframe
- Integrated into existing pages
- Used as a standalone demo

## 🐛 Troubleshooting

### Common Issues

1. **Weather API Errors**: Check your OpenWeatherMap API key
2. **CORS Issues**: Verify CORS settings for your frontend domain
3. **Database Errors**: Ensure write permissions in the project directory
4. **Port Conflicts**: Change the port in `run.py` if 8000 is occupied

### Debug Mode
Enable debug logging by setting `log_level="debug"` in the uvicorn configuration.

## 📄 License

This project is part of the Smart Agriculture Services demo system. 