# Agriculture Platform - FastAPI Backend

A modern FastAPI backend for the Agriculture Platform, designed to connect farmers, experts, and dealers through a comprehensive marketplace.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access (Farmer, Expert, Dealer, Admin)
- **Farmer Management**: Profile creation, connection, and networking
- **Expert Consultations**: Booking appointments with agricultural experts
- **Product Catalog**: Browse machinery, drones, robots, seeds, and fertilizers
- **Dealer Network**: Connect with authorized dealers and suppliers
- **Order Management**: Complete order processing for seeds and fertilizers
- **Appointment System**: Soil testing and farm planning appointments

## 🏗️ Architecture

- **Framework**: FastAPI with SQLModel
- **Database**: PostgreSQL with async SQLAlchemy
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Docker + Kubernetes (GKE)
- **Documentation**: Auto-generated Swagger/OpenAPI docs

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Farmers
- `GET /api/farmers` - List all farmers
- `GET /api/farmers/{id}` - Get specific farmer
- `POST /api/farmers/profile` - Create farmer profile
- `PUT /api/farmers/profile` - Update farmer profile

### Experts
- `GET /api/experts` - List all experts
- `GET /api/experts/{id}` - Get specific expert
- `POST /api/experts/profile` - Create expert profile

### Products
- `GET /api/products` - List products (with category filtering)
- `GET /api/products/{id}` - Get specific product

### Dealers
- `GET /api/dealers` - List all dealers
- `GET /api/dealers/{id}` - Get specific dealer
- `POST /api/dealers/profile` - Create dealer profile

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user appointments

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get specific order

## 🛠️ Local Development

### Prerequisites
- Python 3.11+
- PostgreSQL 13+
- Docker (optional)

### Setup

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

5. **Set up PostgreSQL database**
```bash
# Create database
createdb agri_platform

# Or using Docker
docker run --name postgres-agri -e POSTGRES_PASSWORD=password -e POSTGRES_DB=agri_platform -p 5432:5432 -d postgres:13
```

6. **Run the application**
```bash
python main.py
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t agri-platform-backend .
```

### Run with Docker
```bash
docker run -p 8000:8000 --env-file .env agri-platform-backend
```

## ☁️ Google Cloud Platform Deployment

### Prerequisites
- Google Cloud SDK installed
- GKE cluster created
- Cloud SQL instance running
- Container Registry enabled

### 1. Build and Push Docker Image

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id

# Build and tag image
docker build -t gcr.io/$PROJECT_ID/agri-platform-backend:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/agri-platform-backend:latest
```

### 2. Update Kubernetes Configs

Update the following files with your project details:

- `k8s/deployment.yaml` - Replace `YOUR_PROJECT_ID` with your actual project ID
- `k8s/secrets.yaml` - Update base64 encoded secrets

### 3. Create Secrets

```bash
# Create base64 encoded secrets
echo -n "your-database-url" | base64
echo -n "your-secret-key" | base64

# Apply secrets
kubectl apply -f k8s/secrets.yaml
```

### 4. Deploy to GKE

```bash
# Apply all Kubernetes resources
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services
kubectl get hpa
```

### 5. Get External IP

```bash
kubectl get service agri-platform-backend-service
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://user:password@localhost/agri_platform` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-this-in-production` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `DEBUG` | Debug mode | `true` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `["http://localhost:3000"]` |

### Database Schema

The application uses SQLModel with the following main tables:

- `users` - User accounts and authentication
- `farmers` - Farmer profiles and details
- `experts` - Expert profiles and specializations
- `dealers` - Dealer profiles and company info
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `appointments` - Appointment bookings
- `reviews` - User reviews and ratings

## 📊 Monitoring & Scaling

### Horizontal Pod Autoscaler
- **Min replicas**: 3
- **Max replicas**: 10
- **CPU target**: 70%
- **Memory target**: 80%

### Health Checks
- **Liveness probe**: `/health` endpoint
- **Readiness probe**: `/health` endpoint
- **Initial delay**: 30s (liveness), 5s (readiness)

### Resource Limits
- **CPU**: 500m (request: 250m)
- **Memory**: 512Mi (request: 256Mi)

## 🔒 Security

- **Non-root containers**: Running as user 1000
- **Read-only filesystem**: Except for necessary directories
- **Dropped capabilities**: All unnecessary Linux capabilities
- **JWT authentication**: Secure token-based auth
- **CORS protection**: Configurable allowed origins
- **Input validation**: Pydantic models for all inputs

## 📚 API Documentation

Once deployed, access the interactive API documentation:

- **Swagger UI**: `https://your-domain/docs`
- **ReDoc**: `https://your-domain/redoc`
- **OpenAPI JSON**: `https://your-domain/openapi.json`

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

## 📝 Logging

The application uses structured logging with the following levels:
- **INFO**: General application events
- **WARNING**: Non-critical issues
- **ERROR**: Application errors
- **DEBUG**: Detailed debugging information (when DEBUG=true)

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
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the logs for debugging information 