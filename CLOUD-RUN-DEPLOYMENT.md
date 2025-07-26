# 🚀 Cloud Run Deployment Guide - Agriculture Platform

This guide shows how to deploy your Agriculture Platform to Google Cloud Run using your existing Cloud Build setup.

## 📋 Current Setup

Your existing `cloudbuild.yaml` deploys the frontend to Cloud Run. We'll add the backend deployment alongside it.

## 🚀 Quick Deployment

### Option 1: Use the New Full-Stack Config (Recommended)

1. **Update your Cloud Build trigger** to use `cloudbuild-fullstack.yaml` instead of `cloudbuild.yaml`

2. **Commit and push** your changes:
```bash
git add .
git commit -m "Add backend deployment"
git push
```

3. **Cloud Build will automatically**:
   - Build both frontend and backend
   - Deploy frontend to `slam-website` service
   - Deploy backend to `agriculture-backend` service
   - Connect them together

### Option 2: Keep Existing Frontend, Add Backend Separately

1. **Keep your existing `cloudbuild.yaml`** for frontend
2. **Create a new trigger** for backend using `cloudbuild-backend.yaml`

## 🔧 Configuration

### Environment Variables

The deployment automatically sets these environment variables:

**Frontend:**
- `CONTACT_EMAIL_PASS`: Your existing Gmail password
- `NEXT_PUBLIC_API_URL`: Points to your backend service

**Backend:**
- `DATABASE_URL`: SQLite database (file-based)
- `SECRET_KEY`: JWT secret key
- `ALLOWED_ORIGINS`: Allows your frontend domain

### URLs After Deployment

- **Frontend**: `https://slam-website-us-central1.a.run.app`
- **Backend**: `https://agriculture-backend-us-central1.a.run.app`
- **API Docs**: `https://agriculture-backend-us-central1.a.run.app/docs`

## 🗄️ Database

The backend uses SQLite for simplicity in Cloud Run. The database file is stored in the container's filesystem.

**For production**, you can:
1. Use Cloud SQL (PostgreSQL)
2. Use Cloud Firestore
3. Use Cloud Datastore

## 🔄 Deployment Process

1. **Push to your repository**
2. **Cloud Build triggers automatically**
3. **Builds both Docker images**
4. **Deploys to Cloud Run**
5. **Services are connected automatically**

## 📊 Monitoring

### View Logs
```bash
# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-website"

# Backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=agriculture-backend"
```

### View Services
```bash
# List all services
gcloud run services list --region=us-central1
```

## 🧪 Testing

### Test Frontend
```bash
# Get frontend URL
gcloud run services describe slam-website --region=us-central1 --format="value(status.url)"
```

### Test Backend
```bash
# Get backend URL
gcloud run services describe agriculture-backend --region=us-central1 --format="value(status.url)"

# Test health endpoint
curl https://agriculture-backend-us-central1.a.run.app/health
```

### Test API
```bash
# Test farmers endpoint
curl https://agriculture-backend-us-central1.a.run.app/api/farmers

# Test experts endpoint
curl https://agriculture-backend-us-central1.a.run.app/api/experts
```

## 🔧 Manual Deployment (if needed)

### Deploy Frontend Only
```bash
gcloud builds submit --config cloudbuild.yaml
```

### Deploy Backend Only
```bash
gcloud builds submit --config cloudbuild-backend.yaml
```

### Deploy Both
```bash
gcloud builds submit --config cloudbuild-fullstack.yaml
```

## 🛠️ Troubleshooting

### Common Issues

1. **Build fails**
   - Check Dockerfile syntax
   - Verify all files are committed
   - Check Cloud Build logs

2. **Service not accessible**
   - Verify service is deployed
   - Check service logs
   - Verify environment variables

3. **API connection fails**
   - Check CORS settings
   - Verify API URL in frontend
   - Check backend logs

### Useful Commands

```bash
# View build history
gcloud builds list

# View specific build
gcloud builds describe BUILD_ID

# View service logs
gcloud run services logs read slam-website --region=us-central1
gcloud run services logs read agriculture-backend --region=us-central1

# Update service
gcloud run services update slam-website --region=us-central1
gcloud run services update agriculture-backend --region=us-central1
```

## 💰 Cost Estimation

**Cloud Run pricing** (pay per request):
- **Frontend**: ~$5-15/month
- **Backend**: ~$5-15/month
- **Total**: ~$10-30/month

**Cloud Build**: Free tier includes 120 build-minutes/day

## 🔄 Next Steps

1. **Test the deployment**
2. **Set up custom domain** (optional)
3. **Configure monitoring**
4. **Set up database backups**
5. **Add SSL certificates**

## 📞 Support

- **Cloud Build logs**: Check in Google Cloud Console
- **Service logs**: Use `gcloud run services logs read`
- **Build issues**: Check Cloud Build history

--------------

**🎉 Your Agriculture Platform is now deployed on Cloud Run!**

The deployment maintains your existing frontend while adding the new backend functionality. Everything works together seamlessly! 