#!/bin/bash

# Fast deployment script for SLAM Robotics
# Optimized for speed - skips unnecessary steps

set -e

echo "🚀 Fast Deployment Starting..."

# 1. Quick build and push (parallel)
echo "📦 Building and pushing images..."
docker build -t gcr.io/slam-website-466808/slam-frontend:latest . &
docker build -t gcr.io/slam-website-466808/slam-backend:latest -f backend/Dockerfile ./backend &
wait

docker push gcr.io/slam-website-466808/slam-frontend:latest &
docker push gcr.io/slam-website-466808/slam-backend:latest &
wait

# 2. Quick cluster setup (skip if exists)
echo "🏗️ Setting up cluster..."
gcloud container clusters create slam-cluster \
  --zone=us-central1-a \
  --num-nodes=2 \
  --min-nodes=1 \
  --max-nodes=3 \
  --enable-autoscaling \
  --machine-type=e2-small \
  --disk-size=20 \
  --enable-ip-alias \
  --quiet || echo "Cluster already exists"

# 3. Get credentials
gcloud container clusters get-credentials slam-cluster --zone=us-central1-a

# 4. Quick secrets update
echo "🔐 Updating secrets..."
kubectl create secret generic slam-secrets \
  --from-literal=DATABASE_URL="sqlite:///./agri_platform.db" \
  --from-literal=SECRET_KEY="your-production-secret-key-change-this" \
  --from-literal=JWT_SECRET="your-jwt-secret-change-this" \
  --from-literal=CONTACT_EMAIL_PASS="rgeu ouzv ebeb borr" \
  --dry-run=client -o=yaml | kubectl apply -f -

# 5. Apply manifests
echo "📋 Applying manifests..."
kubectl apply -f gcp-deployment/kubernetes/

# 6. Quick image updates
echo "🔄 Updating deployments..."
kubectl set image deployment/slam-frontend slam-frontend=gcr.io/slam-website-466808/slam-frontend:latest
kubectl set image deployment/slam-backend slam-backend=gcr.io/slam-website-466808/slam-backend:latest

# 7. Wait for rollout (with timeout)
echo "⏳ Waiting for deployments..."
timeout 300 kubectl rollout status deployment/slam-frontend &
timeout 300 kubectl rollout status deployment/slam-backend &
wait

echo "✅ Fast deployment completed!"
echo "🌐 Frontend: https://klipsmart.shop"
echo "🔧 Backend: https://api.klipsmart.shop" 