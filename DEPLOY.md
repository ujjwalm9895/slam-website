# 🚀 SLAM Robotics - Cloud Build + Cloud Run Deployment

## 💰 **Cost: $5-15/month** (95% cheaper than GKE!)

## 📋 **Setup Steps:**

### 1. **Enable Cloud Run API**
```bash
gcloud services enable run.googleapis.com
```

### 2. **Set Project ID**
```bash
gcloud config set project slam-website-466808
```

### 3. **Deploy with Cloud Build**
```bash
# Just commit and push - Cloud Build will handle everything!
git add .
git commit -m "Deploy to Cloud Run"
git push origin master
```

## 🔧 **What Happens:**

1. **Frontend** → Cloud Run (Next.js)
2. **Backend** → Cloud Run (FastAPI)
3. **Database** → SQLite (local to backend)
4. **Email** → Gmail SMTP

## 🌐 **URLs After Deployment:**
- **Frontend**: `https://slam-frontend-xyz123-uc.a.run.app`
- **Backend**: `https://slam-backend-xyz123-uc.a.run.app`

## 💡 **Benefits:**
- ✅ **Pay-per-use** (only pay when traffic)
- ✅ **Auto-scaling** (0 to 1000 instances)
- ✅ **Global CDN** (fast worldwide)
- ✅ **SSL certificates** (automatic)
- ✅ **Custom domains** (easy setup)

## 🔄 **Update Backend URL:**
After first deployment, update the backend URL in `cloudbuild.yaml`:
```yaml
--set-env-vars', 'NEXT_PUBLIC_API_URL=https://ACTUAL_BACKEND_URL'
```

**Ready to deploy! Just commit and push! 🚀** 