# SLAM Robotics Website

A full-stack web application for SLAM Robotics, featuring a Next.js frontend and FastAPI backend, optimized for deployment on Google Cloud Platform using Cloud Build and Cloud Run.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Framer Motion
- **Backend**: FastAPI with SQLite database
- **Deployment**: Google Cloud Build + Cloud Run
- **Database**: SQLite (embedded)

## 🚀 Quick Deployment

### Prerequisites

1. **Google Cloud SDK** installed and authenticated
2. **Google Cloud Project** with billing enabled
3. **Required APIs** enabled (handled automatically by deploy script)

### One-Command Deployment

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy to Cloud Run
./deploy.sh
```

### Manual Deployment

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml .
```

## 📁 Project Structure

```
slam-website/
├── app/                    # Next.js frontend pages
├── backend/               # FastAPI backend
│   ├── api/              # API endpoints
│   ├── main.py           # FastAPI application
│   ├── models.py         # Database models
│   └── requirements.txt  # Python dependencies
├── components/           # React components
├── public/              # Static assets
├── cloudbuild.yaml      # Cloud Build configuration
├── Dockerfile           # Frontend Dockerfile
├── backend/Dockerfile   # Backend Dockerfile
└── deploy.sh           # Deployment script
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

**Backend (FastAPI):**
- `DATABASE_URL`: SQLite database path
- `SECRET_KEY`: Application secret key
- `JWT_SECRET`: JWT signing secret
- `CONTACT_EMAIL_PASS`: Gmail app password

**Frontend (Next.js):**
- `NEXT_PUBLIC_API_URL`: Backend service URL
- `NEXT_PUBLIC_AUTH_ENABLED`: Enable/disable authentication
- `NODE_ENV`: Production/development mode

### Customization

1. **Update service names** in `cloudbuild.yaml`:
   ```yaml
   _FRONTEND_SERVICE: "your-frontend-service-name"
   _BACKEND_SERVICE: "your-backend-service-name"
   ```

2. **Change region** in `cloudbuild.yaml`:
   ```yaml
   _REGION: "your-preferred-region"
   ```

3. **Update Gmail password** in `cloudbuild.yaml`:
   ```yaml
   _GMAIL_APP_PASSWORD: "your-gmail-app-password"
   ```

## 🌐 Services

After deployment, your services will be available at:
- **Frontend**: `https://slam-frontend-xxxxx-uc.a.run.app`
- **Backend**: `https://slam-backend-xxxxx-uc.a.run.app`

## 📊 Monitoring

- **Cloud Build**: View build logs and status
- **Cloud Run**: Monitor service performance and logs
- **Health Checks**: Both services include health check endpoints

## 🔒 Security

- Non-root users in containers
- Environment variables for sensitive data
- Health checks for service monitoring
- Optimized Docker images for security

## 💰 Cost Optimization

- Cloud Run scales to zero when not in use
- Optimized Docker images reduce build time
- Efficient resource allocation (512Mi RAM, 1 CPU)

## 🛠️ Development

### Local Development

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Building Locally

```bash
# Frontend
docker build -t slam-frontend .

# Backend
docker build -t slam-backend -f backend/Dockerfile ./backend
```

## 📝 Notes

- Database is SQLite and embedded in the container
- Static assets are served from the Next.js application
- All API endpoints are prefixed with `/api`
- Authentication is JWT-based
- Contact form uses Gmail SMTP

## 🆘 Troubleshooting

1. **Build fails**: Check Cloud Build logs for specific errors
2. **Service not starting**: Verify environment variables are set correctly
3. **Database issues**: Ensure SQLite file has proper permissions
4. **Email not working**: Verify Gmail app password is correct

For more detailed logs, check the Cloud Run service logs in the Google Cloud Console. 