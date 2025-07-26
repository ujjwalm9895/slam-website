# SLAM Robotics Full-Stack Deployment Script (PowerShell)
# Deploys both frontend and backend to GKE

Write-Host "🚀 Starting SLAM Robotics Full-Stack Deployment..." -ForegroundColor Green

# Configuration
$PROJECT_ID = "slam-website-466808"
$CLUSTER_NAME = "slam-cluster"
$ZONE = "us-central1-a"
$REGION = "us-central1"
$GMAIL_APP_PASSWORD = "rgeu ouzv ebeb borr"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Project ID: $PROJECT_ID"
Write-Host "  Cluster: $CLUSTER_NAME"
Write-Host "  Zone: $ZONE"
Write-Host "  Region: $REGION"

# Step 1: Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable container.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable compute.googleapis.com --project=$PROJECT_ID

# Step 2: Set up Cloud Build permissions
Write-Host "🔐 Setting up Cloud Build permissions..." -ForegroundColor Yellow
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format='value(projectNumber)'
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" --role="roles/container.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" --role="roles/compute.admin"

# Step 3: Build and push Docker images
Write-Host "🐳 Building and pushing Docker images..." -ForegroundColor Yellow

# Build frontend
Write-Host "  Building frontend..." -ForegroundColor Cyan
docker build -t gcr.io/$PROJECT_ID/slam-frontend:latest .
docker push gcr.io/$PROJECT_ID/slam-frontend:latest

# Build backend
Write-Host "  Building backend..." -ForegroundColor Cyan
docker build -t gcr.io/$PROJECT_ID/slam-backend:latest -f backend/Dockerfile ./backend
docker push gcr.io/$PROJECT_ID/slam-backend:latest

# Step 4: Create GKE cluster
Write-Host "🏗️ Creating GKE cluster..." -ForegroundColor Yellow
try {
    gcloud container clusters create $CLUSTER_NAME --zone=$ZONE --num-nodes=2 --min-nodes=1 --max-nodes=5 --enable-autoscaling --machine-type=e2-micro --disk-size=20 --enable-ip-alias --project=$PROJECT_ID --quiet
} catch {
    Write-Host "Cluster already exists" -ForegroundColor Yellow
}

# Step 5: Get cluster credentials
Write-Host "🔑 Getting cluster credentials..." -ForegroundColor Yellow
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE --project=$PROJECT_ID

# Step 6: Create Kubernetes secrets
Write-Host "🔒 Creating Kubernetes secrets..." -ForegroundColor Yellow
kubectl create secret generic slam-secrets --from-literal=DATABASE_URL=sqlite:///./agri_platform.db --from-literal=SECRET_KEY=your-production-secret-key-change-this --from-literal=JWT_SECRET=your-jwt-secret-change-this --from-literal=CONTACT_EMAIL_PASS=$GMAIL_APP_PASSWORD --dry-run=client -o=yaml | kubectl apply -f -

# Step 7: Apply Kubernetes manifests
Write-Host "📄 Applying Kubernetes manifests..." -ForegroundColor Yellow
kubectl apply -f gcp-deployment/kubernetes/

# Step 8: Update deployments with latest images
Write-Host "🔄 Updating deployments..." -ForegroundColor Yellow
kubectl set image deployment/slam-frontend slam-frontend=gcr.io/$PROJECT_ID/slam-frontend:latest
kubectl set image deployment/slam-backend slam-backend=gcr.io/$PROJECT_ID/slam-backend:latest

# Step 9: Wait for deployments to be ready
Write-Host "⏳ Waiting for deployments to be ready..." -ForegroundColor Yellow
kubectl rollout status deployment/slam-frontend
kubectl rollout status deployment/slam-backend

# Step 10: Reserve static IP
Write-Host "🌐 Reserving static IP..." -ForegroundColor Yellow
try {
    gcloud compute addresses create slam-ip --global --project=$PROJECT_ID
} catch {
    Write-Host "IP already exists" -ForegroundColor Yellow
}

# Step 11: Get static IP
Write-Host "📡 Getting static IP..." -ForegroundColor Yellow
$STATIC_IP = gcloud compute addresses describe slam-ip --global --format=value(address) --project=$PROJECT_ID
Write-Host "Static IP: $STATIC_IP" -ForegroundColor Green

# Step 12: Show service URLs
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Yellow
kubectl get services
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: http://$STATIC_IP"
Write-Host "  Backend API: http://$STATIC_IP/api"
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Update your DNS records to point klipsmart.shop to: $STATIC_IP"
Write-Host "  2. Update your DNS records to point api.klipsmart.shop to: $STATIC_IP"
Write-Host "  3. Wait for DNS propagation (can take up to 24 hours)"
Write-Host ""
Write-Host "🔍 Check deployment status:" -ForegroundColor Yellow
Write-Host "  kubectl get pods"
Write-Host "  kubectl get services"
Write-Host "  kubectl logs deployment/slam-frontend"
Write-Host "  kubectl logs deployment/slam-backend" 