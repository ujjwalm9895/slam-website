# 🏠 Local Development Guide

## 📋 **Overview**
Complete guide to run your SLAM Robotics Agriculture Platform locally for development and testing.

## 🚀 **Quick Start**

### **1. Start Frontend (Next.js)**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
**Frontend will be available at:** `http://localhost:3000`

### **2. Start Backend (FastAPI)**
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```
**Backend will be available at:** `http://localhost:8000`

## 🔧 **Environment Setup**

### **Frontend Environment Variables**
Create `.env.local` file in root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NODE_ENV=development
```

### **Backend Environment Variables**
Create `.env` file in backend directory:
```env
DATABASE_URL=sqlite:///./agri_platform.db
SECRET_KEY=your-local-secret-key
JWT_SECRET=your-local-jwt-secret
CONTACT_EMAIL_PASS=your-email-password
LOG_LEVEL=debug
DEBUG=true
```

## 🗄️ **Database Setup**

### **SQLite Database (Local)**
The backend automatically creates a SQLite database:
```bash
# Database file will be created at:
backend/agri_platform.db
```

### **Initialize Database**
```bash
# The database is automatically initialized when you start the backend
# You can also manually initialize:
cd backend
python -c "from database import init_db; import asyncio; asyncio.run(init_db())"
```

## 🧪 **Testing Your Application**

### **1. Test Frontend**
```bash
# Open in browser
http://localhost:3000

# Test health endpoint
curl http://localhost:3000/api/health
```

### **2. Test Backend**
```bash
# Test root endpoint
curl http://localhost:8000/

# Test health endpoint
curl http://localhost:8000/health

# Test API documentation
# Open in browser: http://localhost:8000/docs
```

### **3. Test API Endpoints**
```bash
# Test authentication
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"farmer"}'

# Test farmers endpoint
curl http://localhost:8000/api/farmers

# Test experts endpoint
curl http://localhost:8000/api/experts
```

## 🔍 **Development Tools**

### **Frontend Development**
```bash
# Run with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### **Backend Development**
```bash
# Start with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start with debug mode
uvicorn main:app --reload --host 0.0.0.0 --port 8000 --log-level debug

# Run tests (if you have them)
pytest
```

## 📊 **Local URLs**

### **Development URLs**
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

### **Health Check Endpoints**
- **Frontend Health**: `http://localhost:3000/api/health`
- **Backend Health**: `http://localhost:8000/health`

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using the port
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Mac/Linux:
lsof -i :3000
lsof -i :8000

# Kill the process
# Windows:
taskkill /PID <PID> /F

# Mac/Linux:
kill -9 <PID>
```

#### **Dependencies Issues**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
pip uninstall -r requirements.txt
pip install -r requirements.txt
```

#### **Database Issues**
```bash
# Remove and recreate database
cd backend
rm agri_platform.db
python -c "from database import init_db; import asyncio; asyncio.run(init_db())"
```

## 🚀 **Testing Before Deployment**

### **1. Test All Features Locally**
- ✅ **Frontend pages** - All routes working
- ✅ **API endpoints** - All CRUD operations
- ✅ **Authentication** - Register/login working
- ✅ **Database** - Data persistence working
- ✅ **Health checks** - Both services responding

### **2. Test Production Build**
```bash
# Build frontend
npm run build
npm start

# Test production backend
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### **3. Test Docker Builds**
```bash
# Build frontend Docker image
docker build -t slam-frontend:local .

# Build backend Docker image
docker build -t slam-backend:local -f backend/Dockerfile ./backend

# Run containers
docker run -p 3000:3000 slam-frontend:local
docker run -p 8000:8000 slam-backend:local
```

## 📝 **Development Workflow**

### **1. Make Changes**
```bash
# Edit your code
# Frontend: Edit files in app/ and components/
# Backend: Edit files in backend/
```

### **2. Test Locally**
```bash
# Start both services
npm run dev  # Terminal 1
cd backend && python main.py  # Terminal 2
```

### **3. Test in Browser**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/docs`

### **4. Commit and Deploy**
```bash
git add .
git commit -m "Your changes"
git push origin master  # Triggers Cloud Build
```

## 🎯 **Ready for Production**

Once everything works locally:

1. **✅ Test all features** - Everything working on localhost
2. **✅ Build successfully** - No errors in production build
3. **✅ Docker images work** - Containers run properly
4. **✅ Deploy to Google Cloud** - Push to trigger Cloud Build

## 🚀 **Deploy When Ready**

```bash
# When you're satisfied with local testing
git add .
git commit -m "Ready for production deployment"
git push origin master
```

Your application will be deployed to:
- **Frontend**: `https://klipsmart.shop`
- **Backend**: `https://slam-backend-[PROJECT_ID]-uc.a.run.app`

**Happy coding! 🎉** 