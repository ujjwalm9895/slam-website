#!/bin/bash

# SLAM Robotics - Cloud Build Deployment Script
# This script triggers a Cloud Build to deploy the application

set -e

echo "🚀 Starting SLAM Robotics deployment to Google Cloud Platform..."

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
echo "🌍 Region: us-central1"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Submit build to Cloud Build
echo "🏗️  Submitting build to Cloud Build..."
echo "⏳ This may take 10-15 minutes for the first deployment..."

BUILD_ID=$(gcloud builds submit --config cloudbuild.yaml . --format="value(id)")

echo "✅ Build submitted successfully!"
echo "📊 Build ID: $BUILD_ID"
echo "🔍 Check build status: https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"

# Wait for build to complete
echo "⏳ Waiting for build to complete..."
gcloud builds log $BUILD_ID --stream

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Your services are available at:"
echo "   Frontend: https://slam-frontend-$PROJECT_ID-us-central1.a.run.app"
echo "   Backend:  https://slam-backend-$PROJECT_ID-us-central1.a.run.app"
echo ""
echo "📚 API Documentation: https://slam-backend-$PROJECT_ID-us-central1.a.run.app/docs" 