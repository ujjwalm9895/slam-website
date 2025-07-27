# SLAM Robotics - Google Cloud Platform Deployment Guide

This guide will help you deploy the SLAM Robotics website to Google Cloud Platform using Cloud Build and Cloud Run.

## Prerequisites

1. **Google Cloud SDK** installed and authenticated
2. **Google Cloud Project** with billing enabled
3. **Required APIs** enabled (handled automatically by deploy script)
4. **Git repository** with your code (for commit-based deployment)

## Deployment Options

### Option 1: Commit-Based Deployment (Recommended) 🚀

This option automatically deploys your website whenever you push commits to your Git repository.

#### Step 1: Set up Cloud Build Trigger

**Windows (PowerShell):**
```powershell
.\setup-trigger.ps1
```

**Linux/Mac/WSL (Bash):**
```bash
chmod +x setup-trigger.sh
./setup-trigger.sh
```

#### Step 2: Deploy by Committing

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Deploy SLAM Robotics website"

# Push to trigger deployment
git push origin main
```

**That's it!** Your website will automatically deploy to Google Cloud Platform.

### Option 2: Manual Deployment

#### Using Bash Script (Linux/Mac/WSL)
```bash
# Make script executable
chmod +x deploy.sh

# Deploy to Cloud Run
./deploy.sh
```

#### Using PowerShell Script (Windows)
```powershell
# Deploy to Cloud Run
.\deploy.ps1
```

#### Manual Deployment
```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml .
```

## What Gets Deployed

### Frontend (Next.js)
- **Service Name**: `slam-frontend`
- **Port**: 3000
- **URL**: `https://slam-frontend-{PROJECT_ID}-us-central1.a.run.app`
- **Features**: 
  - Next.js 15 with TypeScript
  - Tailwind CSS styling
  - Framer Motion animations
  - Responsive design

### Backend (FastAPI)
- **Service Name**: `slam-backend`
- **Port**: 8000
- **URL**: `https://slam-backend-{PROJECT_ID}-us-central1.a.run.app`
- **API Documentation**: `https://slam-backend-{PROJECT_ID}-us-central1.a.run.app/docs`
- **Features**:
  - FastAPI with async SQLite database
  - JWT authentication
  - CORS enabled for frontend
  - RESTful API endpoints

## Environment Variables

### Backend Environment Variables
- `DATABASE_URL`: SQLite database path
- `SECRET_KEY`: Application secret key
- `JWT_SECRET`: JWT token secret
- `CONTACT_EMAIL_PASS`: Gmail app password for contact form

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (auto-configured)
- `NEXT_PUBLIC_AUTH_ENABLED`: Authentication toggle
- `NODE_ENV`: Production environment
- `CONTACT_EMAIL_PASS`: Gmail app password

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Farmers
- `GET /api/farmers` - List all farmers
- `POST /api/farmers` - Create farmer profile
- `GET /api/farmers/{id}` - Get farmer details

### Experts
- `GET /api/experts` - List all experts
- `POST /api/experts` - Create expert profile
- `GET /api/experts/{id}` - Get expert details

### Products
- `GET /api/products` - List all products
- `GET /api/products?category={category}` - Filter by category
- `POST /api/products` - Create product

### Dealers
- `GET /api/dealers` - List all dealers
- `POST /api/dealers` - Create dealer profile

### Orders & Appointments
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment

## Monitoring & Logs

### View Logs
```bash
# Backend logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend"

# Frontend logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-frontend"
```

### Monitor Services
```bash
# List services
gcloud run services list --region=us-central1

# Get service details
gcloud run services describe slam-backend --region=us-central1
gcloud run services describe slam-frontend --region=us-central1
```

### Monitor Cloud Build Triggers
```bash
# List triggers
gcloud builds triggers list

# Get trigger details
gcloud builds triggers describe slam-robotics-auto-deploy
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Cloud Build logs: `gcloud builds log {BUILD_ID}`
   - Verify all dependencies are in requirements.txt
   - Ensure Dockerfiles are correct

2. **Service Won't Start**
   - Check service logs in Cloud Console
   - Verify environment variables are set correctly
   - Check database initialization

3. **CORS Errors**
   - Backend CORS is configured for localhost and production domains
   - Verify frontend is using correct backend URL

4. **Database Issues**
   - SQLite database is created automatically on first run
   - Check database file permissions in Cloud Run

5. **Trigger Not Working**
   - Verify repository connection: `gcloud source repos list`
   - Check trigger configuration: `gcloud builds triggers describe slam-robotics-auto-deploy`
   - Ensure you're pushing to the `main` branch

### Useful Commands

```bash
# Update service with new environment variables
gcloud run services update slam-backend --set-env-vars KEY=VALUE --region=us-central1

# Scale services
gcloud run services update slam-backend --max-instances=20 --region=us-central1

# View real-time logs
gcloud logs tail --service=slam-backend

# Test trigger manually
gcloud builds triggers run slam-robotics-auto-deploy --branch=main
```

## Cost Optimization

- **Cloud Run** charges only when requests are processed
- **Container Registry** charges for storage and data transfer
- **Cloud Build** charges per build minute
- Consider setting up budget alerts in Google Cloud Console

## Security

- Services are deployed with `--allow-unauthenticated` for public access
- JWT tokens are used for authentication
- CORS is properly configured
- Environment variables contain sensitive data (change default secrets)

## Next Steps

1. **Custom Domain**: Set up custom domain in Cloud Run
2. **SSL Certificate**: Automatically handled by Cloud Run
3. **CDN**: Consider Cloud CDN for static assets
4. **Monitoring**: Set up Cloud Monitoring and Alerting
5. **Backup**: Implement database backup strategy

## Support

For issues or questions:
1. Check Cloud Build logs
2. Review service logs in Cloud Console
3. Verify environment variables
4. Test API endpoints using the interactive docs at `/docs` 