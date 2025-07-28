# 🌾 Crop Advisory System - Complete Setup Guide

A comprehensive guide to set up and run the AI-powered Crop Advisory System demo locally before deploying to Cloud Run.

## 📁 Project Structure

```
crop-advisory-system/
├── crop-advisory-backend/
│   ├── main.py              # FastAPI backend
│   ├── run.py               # Server runner
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend documentation
├── crop-advisory-frontend/
│   ├── index.html          # React-like frontend
│   └── README.md           # Frontend documentation
├── demo-integration-example.html  # Integration examples
└── SETUP_GUIDE.md         # This file
```

## 🚀 Quick Start

### Step 1: Set Up Backend

1. **Navigate to backend directory:**
   ```bash
   cd crop-advisory-backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Get OpenWeatherMap API Key:**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key
   - Replace `your_openweather_api_key_here` in `main.py` with your actual key

4. **Start the backend server:**
   ```bash
   python run.py
   ```
   
   You should see:
   ```
   🌾 Starting Crop Advisory System Backend...
   📍 Server will be available at: http://localhost:8000
   📚 API Documentation: http://localhost:8000/docs
   💚 Health Check: http://localhost:8000/health
   ```

### Step 2: Test Backend

1. **Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Test API:**
   ```bash
   curl -X POST "http://localhost:8000/get-advisory" \
        -H "Content-Type: application/json" \
        -d '{
          "name": "Test Farmer",
          "location": "Mumbai, Maharashtra",
          "crop": "Wheat"
        }'
   ```

### Step 3: Set Up Frontend

1. **Navigate to frontend directory:**
   ```bash
   cd crop-advisory-frontend
   ```

2. **Open the frontend:**
   - Simply open `index.html` in your web browser
   - Or serve it using Python:
     ```bash
     python -m http.server 8080
     # Then visit http://localhost:8080
     ```

### Step 4: Test Complete System

1. **Fill out the form:**
   - Name: Your name
   - Location: Any Indian city (e.g., "Mumbai, Maharashtra")
   - Crop: Select Wheat, Tomato, or Cotton

2. **Submit and view results:**
   - Weather information
   - Pest alerts (if any)
   - Smart recommendations

## 🔧 Configuration

### Backend Configuration

#### Environment Variables
```bash
# Optional: Set as environment variable
export OPENWEATHER_API_KEY="your_api_key_here"
```

#### API Settings
- **Port**: 8000 (configurable in `run.py`)
- **CORS**: Configured for all origins (customize for production)
- **Database**: SQLite (`advisory_logs.db`)

#### Weather API Configuration
```python
# In main.py
OPENWEATHER_API_KEY = "your_openweather_api_key_here"
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
```

### Frontend Configuration

#### API Endpoint
```javascript
// In index.html
const API_BASE_URL = 'http://localhost:8000';
```

#### Customization
- **Colors**: Modify CSS gradients
- **Fonts**: Change font-family in CSS
- **Animations**: Adjust keyframes

## 🧪 Testing

### Backend Testing

1. **Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **API Documentation:**
   - Visit: http://localhost:8000/docs
   - Interactive Swagger UI

3. **View Logs:**
   ```bash
   curl http://localhost:8000/logs
   ```

### Frontend Testing

1. **Form Validation:**
   - Try submitting empty form
   - Test with invalid data

2. **API Integration:**
   - Check browser console for errors
   - Verify CORS settings

3. **Responsive Design:**
   - Test on mobile devices
   - Check different screen sizes

## 🚀 Integration Options

### Option 1: Iframe Embedding
```html
<iframe 
    src="http://localhost:8080/crop-advisory-frontend/index.html"
    width="100%" 
    height="600px" 
    frameborder="0"
    style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
</iframe>
```

### Option 2: Button Redirect
```html
<a href="http://localhost:8080/crop-advisory-frontend/index.html" 
   target="_blank" 
   class="demo-button">
    🚀 Try Crop Advisory Demo
</a>
```

### Option 3: Modal Integration
```javascript
function openCropAdvisory() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <iframe src="crop-advisory-frontend/index.html"
                style="width: 100%; height: 100%; border: none;">
        </iframe>
    `;
    // Add modal styling and show
}
```

## 🗄️ Database

### SQLite Database
- **File**: `advisory_logs.db`
- **Location**: Backend directory
- **Schema**: See backend README for details

### Viewing Data
```bash
# Using SQLite command line
sqlite3 advisory_logs.db
.tables
SELECT * FROM advisory_logs LIMIT 5;
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

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
1. **Port 8000 already in use:**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   # Kill process or change port in run.py
   ```

2. **Weather API errors:**
   - Check API key in `main.py`
   - Verify internet connection
   - Check API quota limits

3. **Database errors:**
   - Ensure write permissions in backend directory
   - Check SQLite installation

#### Frontend Issues
1. **CORS errors:**
   - Verify backend CORS settings
   - Check browser console for errors

2. **API connection failed:**
   - Ensure backend is running on port 8000
   - Check network connectivity

3. **Styling issues:**
   - Clear browser cache
   - Check CSS loading

### Debug Mode

#### Backend Debug
```python
# In run.py, change log_level to "debug"
uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, log_level="debug")
```

#### Frontend Debug
```javascript
// Add to index.html JavaScript
const DEBUG = true;
if (DEBUG) {
    console.log('Crop Advisory Frontend loaded');
}
```

## 🚀 Production Deployment

### Backend Deployment (Cloud Run)

1. **Create Dockerfile:**
   ```dockerfile
   FROM python:3.10-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy crop-advisory-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Frontend Deployment

1. **Static Hosting:**
   - Upload to GitHub Pages
   - Deploy to Netlify/Vercel
   - Host on AWS S3

2. **Update API URL:**
   ```javascript
   // Change from localhost to production URL
   const API_BASE_URL = 'https://your-backend-url.com';
   ```

## 📊 Performance Monitoring

### Backend Metrics
- **Response Time**: Monitor API response times
- **Error Rate**: Track failed requests
- **Database Usage**: Monitor SQLite performance

### Frontend Metrics
- **Load Time**: Page load performance
- **User Engagement**: Form completion rates
- **Error Tracking**: JavaScript errors

## 🔒 Security Considerations

### Production Security
1. **API Key Management:**
   - Use environment variables
   - Never commit API keys to version control

2. **CORS Configuration:**
   - Restrict to specific domains
   - Remove wildcard origins

3. **Rate Limiting:**
   - Implement request throttling
   - Monitor API usage

4. **Input Validation:**
   - Validate all user inputs
   - Sanitize data

## 📝 Logging

### Backend Logs
- **Application Logs**: Uvicorn access logs
- **Database Logs**: SQLite query logs
- **Error Logs**: Exception tracking

### Frontend Logs
- **Console Logs**: Browser developer tools
- **Network Logs**: API request/response tracking
- **Error Logs**: JavaScript error tracking

## 🎯 Next Steps

### Immediate Actions
1. ✅ Set up local development environment
2. ✅ Test backend and frontend
3. ✅ Integrate with your product page
4. 🔄 Deploy to Cloud Run
5. 🔄 Set up monitoring and logging

### Future Enhancements
1. **Additional Crops**: Add more crop types
2. **Advanced AI**: Implement machine learning models
3. **Weather History**: Add historical weather analysis
4. **User Accounts**: Add user authentication
5. **Mobile App**: Create native mobile application

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend and frontend README files
3. Check browser console and server logs
4. Verify all dependencies are installed

## 📄 License

This Crop Advisory System is part of the Smart Agriculture Services demo and is designed for integration with your main product page. 