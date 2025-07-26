# 🌾 Agriculture Platform - Full Stack Application

A comprehensive agriculture platform built with **React + Next.js** frontend and **Python FastAPI** backend, designed to connect farmers, experts, and dealers.

## 🏗️ Architecture

### Frontend (React + Next.js)
- **Framework**: Next.js 15.4.3 with React 19.1.0
- **Styling**: TailwindCSS v4 + Shadcn/UI
- **Icons**: Lucide React
- **State Management**: React Context + Hooks
- **Authentication**: JWT-based with local storage

### Backend (Python FastAPI)
- **Framework**: FastAPI with async/await
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Authentication**: JWT with bcrypt password hashing
- **Admin**: Python CLI + Web interface
- **Documentation**: Auto-generated OpenAPI/Swagger

### Database Schema
- **Users**: Authentication and role management
- **Farmers**: Farmer profiles and ratings
- **Experts**: Expert profiles and consultation fees
- **Dealers**: Dealer profiles and specializations
- **Products**: Agricultural equipment and supplies
- **Orders**: Order management and tracking
- **Appointments**: Expert consultation bookings
- **Reviews**: User ratings and feedback

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the setup script
python setup.py
```

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp env.example .env
# Edit .env with your configuration

# Start the server
python main.py
```

#### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

#### 3. Create Admin User
```bash
cd backend
python admin_script.py create-admin --name "Admin User" --email "admin@slamrobotics.com" --password "admin123" --phone "+91-98765-43210"
```

#### 4. Seed Sample Data
```bash
cd backend
python admin_script.py seed
```

## 📱 Application Features

### 🌾 For Farmers
- **Profile Management**: Create and manage farmer profiles
- **Expert Consultation**: Book appointments with agricultural experts
- **Equipment Access**: Browse and order farming equipment
- **Community**: Connect with other farmers
- **Soil Testing**: Book professional soil testing services

### 🧑‍🔬 For Experts
- **Expert Profiles**: Showcase expertise and experience
- **Consultation Booking**: Manage appointment requests
- **Knowledge Sharing**: Provide expert advice to farmers
- **Earnings**: Track consultation fees and earnings

### 🏢 For Dealers
- **Product Catalog**: Manage agricultural equipment and supplies
- **Order Management**: Process and track customer orders
- **Inventory**: Manage stock levels and availability
- **Customer Relations**: Connect with farmers and experts

### 👨‍💼 For Admins
- **User Management**: Approve/reject user registrations
- **Platform Monitoring**: View platform statistics
- **Content Moderation**: Manage users and content
- **System Administration**: Configure platform settings

## 🔧 Admin Commands

### User Management
```bash
# List pending users
python admin_script.py list-pending

# Approve user
python admin_script.py approve --user-id 1

# Reject user
python admin_script.py reject --user-id 1 --reason "Incomplete profile"

# Get platform statistics
python admin_script.py stats
```

### Database Management
```bash
# Seed sample data
python admin_script.py seed

# Create admin user
python admin_script.py create-admin --name "Admin" --email "admin@example.com" --password "password" --phone "+91-1234567890"
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Users & Profiles
- `GET /api/farmers` - List farmers
- `POST /api/farmers/profile` - Create farmer profile
- `GET /api/experts` - List experts
- `POST /api/experts/profile` - Create expert profile
- `GET /api/dealers` - List dealers
- `POST /api/dealers/profile` - Create dealer profile

### Products & Orders
- `GET /api/products` - List products
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders

### Appointments
- `POST /api/appointments` - Book consultation
- `GET /api/appointments` - List appointments

### Admin (Protected)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/approve` - Approve user
- `PUT /api/admin/users/{id}/reject` - Reject user
- `GET /api/admin/dashboard/stats` - Platform statistics

## 🔐 Authentication Flow

1. **Registration**: Users register with role (farmer/expert/dealer)
2. **Admin Approval**: Admins review and approve user registrations
3. **Login**: Approved users can login and access platform features
4. **JWT Tokens**: Secure authentication with JWT tokens
5. **Role-based Access**: Different features based on user roles

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    name VARCHAR(100) NOT NULL,
    country VARCHAR DEFAULT 'India',
    hashed_password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Profiles Tables
- **farmers**: Location, crop type, farm size, ratings
- **experts**: Domain, experience, consultation fees, ratings
- **dealers**: Company name, location, specialization, ratings

### Business Tables
- **products**: Equipment, machinery, seeds, fertilizers
- **orders**: Customer orders with items and status
- **appointments**: Expert consultation bookings
- **reviews**: User ratings and feedback

## 🚀 Deployment

### Development
```bash
# Backend (Port 8000)
cd backend && python main.py

# Frontend (Port 3000)
npm run dev
```

### Production (GCP)
```bash
# Build and deploy
gcloud builds submit --config cloudbuild.yaml
```

### Docker
```bash
# Build images
docker build -t agriculture-backend ./backend
docker build -t agriculture-frontend .

# Run containers
docker run -p 8000:8000 agriculture-backend
docker run -p 3000:3000 agriculture-frontend
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=sqlite:///./agri_platform.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8000
DEBUG=true
ALLOWED_ORIGINS=["http://localhost:3000"]
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_ENABLED=true
```

## 📊 Platform Statistics

The admin dashboard provides:
- **User Statistics**: Total, pending, approved, rejected users
- **Role Distribution**: Farmers, experts, dealers count
- **Recent Activity**: Latest registrations and activities
- **System Health**: API status and performance metrics

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Pydantic models for data validation
- **Role-based Access**: Admin-only endpoints protected
- **SQL Injection Protection**: SQLModel ORM prevents SQL injection

## 🧪 Testing

### API Testing
```bash
# Access Swagger UI
http://localhost:8000/docs

# Test endpoints
curl -X GET "http://localhost:8000/health"
curl -X POST "http://localhost:8000/api/auth/register" -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"+91-1234567890","role":"farmer"}'
```

### Frontend Testing
```bash
# Run tests
npm test

# E2E testing
npm run test:e2e
```

## 📝 Development Workflow

1. **Feature Development**: Create feature branches
2. **Backend First**: Implement API endpoints
3. **Frontend Integration**: Connect UI to APIs
4. **Testing**: Unit and integration tests
5. **Code Review**: Pull request reviews
6. **Deployment**: Staging and production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Email**: slam.robots@gmail.com
- **Documentation**: `/docs` endpoint when server is running
- **Issues**: Create GitHub issues for bugs and feature requests

---

**Built with ❤️ by SLAM Robotics Team**
