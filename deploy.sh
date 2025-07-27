#!/bin/bash

# SLAM Robotics - Simple Cloud Build Deployment Script
# This script triggers a Cloud Build to deploy the application

set -e

echo "🚀 Starting SLAM Robotics deployment..."

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Error: Not authenticated with gcloud. Please run 'gcloud auth login' first."
    exit 1
fi

# Get current project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No project ID set. Please run 'gcloud config set project YOUR_PROJECT_ID' first."
    exit 1
fi

echo "📋 Project ID: $PROJECT_ID"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Submit build to Cloud Build
echo "🏗️  Submitting build to Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

echo "✅ Deployment submitted successfully!"
echo "📊 Check build status: https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"
echo "🌐 Your services will be available at:"
echo "   Frontend: https://slam-frontend-xxxxx-uc.a.run.app"
echo "   Backend:  https://slam-backend-xxxxx-uc.a.run.app" 