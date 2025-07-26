#!/bin/bash

# SLAM Robotics Full-Stack Deployment Script
# Deploys both frontend and backend to GKE

set -e

echo "🚀 Starting SLAM Robotics Full-Stack Deployment..."

# Configuration
PROJECT_ID="slam-website-466808"
CLUSTER_NAME="slam-cluster"
ZONE="us-central1-a"
REGION="us-central1"
GMAIL_APP_PASSWORD="rgeu ouzv ebeb borr"

echo "📋 Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Cluster: $CLUSTER_NAME"
echo "  Zone: $ZONE"
echo "  Region: $REGION"

# Step 1: Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable container.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable compute.googleapis.com --project=$PROJECT_ID

# Step 2: Set up Cloud Build permissions
echo "🔐 Setting up Cloud Build permissions..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/container.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/compute.admin"

# Step 3: Build and push Docker images
echo "🐳 Building and pushing Docker images..."

# Build frontend
echo "  Building frontend..."
docker build -t gcr.io/$PROJECT_ID/slam-frontend:latest .
docker push gcr.io/$PROJECT_ID/slam-frontend:latest

# Build backend
echo "  Building backend..."
docker build -t gcr.io/$PROJECT_ID/slam-backend:latest -f backend/Dockerfile ./backend
docker push gcr.io/$PROJECT_ID/slam-backend:latest

# Step 4: Create GKE cluster
echo "🏗️ Creating GKE cluster..."
gcloud container clusters create $CLUSTER_NAME \
    --zone=$ZONE \
    --num-nodes=2 \
    --min-nodes=1 \
    --max-nodes=5 \
    --enable-autoscaling \
    --machine-type=e2-micro \
    --disk-size=20 \
    --enable-ip-alias \
    --project=$PROJECT_ID \
    --quiet || echo "Cluster already exists"

# Step 5: Get cluster credentials
echo "🔑 Getting cluster credentials..."
gcloud container clusters get-credentials $CLUSTER_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID

# Step 6: Create Kubernetes secrets
echo "🔒 Creating Kubernetes secrets..."
kubectl create secret generic slam-secrets \
    --from-literal=DATABASE_URL=sqlite:///./agri_platform.db \
    --from-literal=SECRET_KEY=your-production-secret-key-change-this \
    --from-literal=JWT_SECRET=your-jwt-secret-change-this \
    --from-literal=CONTACT_EMAIL_PASS=$GMAIL_APP_PASSWORD \
    --dry-run=client -o=yaml | kubectl apply -f -

# Step 7: Apply Kubernetes manifests
echo "📄 Applying Kubernetes manifests..."
kubectl apply -f gcp-deployment/kubernetes/

# Step 8: Update deployments with latest images
echo "🔄 Updating deployments..."
kubectl set image deployment/slam-frontend slam-frontend=gcr.io/$PROJECT_ID/slam-frontend:latest
kubectl set image deployment/slam-backend slam-backend=gcr.io/$PROJECT_ID/slam-backend:latest

# Step 9: Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/slam-frontend
kubectl rollout status deployment/slam-backend

# Step 10: Reserve static IP
echo "🌐 Reserving static IP..."
gcloud compute addresses create slam-ip --global --project=$PROJECT_ID || echo "IP already exists"

# Step 11: Get static IP
echo "📡 Getting static IP..."
STATIC_IP=$(gcloud compute addresses describe slam-ip --global --format=value(address) --project=$PROJECT_ID)
echo "Static IP: $STATIC_IP"

# Step 12: Show service URLs
echo "🎉 Deployment completed!"
echo ""
echo "📊 Service Status:"
kubectl get services
echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://$STATIC_IP"
echo "  Backend API: http://$STATIC_IP/api"
echo ""
echo "📝 Next Steps:"
echo "  1. Update your DNS records to point klipsmart.shop to: $STATIC_IP"
echo "  2. Update your DNS records to point api.klipsmart.shop to: $STATIC_IP"
echo "  3. Wait for DNS propagation (can take up to 24 hours)"
echo ""
echo "🔍 Check deployment status:"
echo "  kubectl get pods"
echo "  kubectl get services"
echo "  kubectl logs deployment/slam-frontend"
echo "  kubectl logs deployment/slam-backend" 