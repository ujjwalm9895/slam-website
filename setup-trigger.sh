#!/bin/bash

# SLAM Robotics - Cloud Build Trigger Setup Script
# This script sets up automatic deployment triggered by Git commits

set -e

echo "🚀 Setting up Cloud Build Trigger for automatic deployment..."

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
gcloud services enable sourcerepo.googleapis.com

# Check if repository exists
echo "🔍 Checking repository connection..."
if ! gcloud source repos describe slam-website 2>/dev/null; then
    echo "📦 Setting up repository connection..."
    
    # Get the current Git remote URL
    REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
    
    if [ -z "$REMOTE_URL" ]; then
        echo "❌ Error: No Git remote found. Please add a remote origin first:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/slam-website.git"
        exit 1
    fi
    
    echo "🔗 Connecting to repository: $REMOTE_URL"
    
    # Create Cloud Source Repository mirror
    gcloud source repos create slam-website --description="SLAM Robotics Website Repository"
    
    # Add the remote
    git remote add google https://source.developers.google.com/p/$PROJECT_ID/r/slam-website
fi

# Create Cloud Build trigger
echo "⚡ Creating Cloud Build trigger..."
gcloud builds triggers create github \
    --name="slam-robotics-auto-deploy" \
    --repo-name="slam-website" \
    --repo-owner="$(git config user.name || echo 'your-username')" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild.yaml" \
    --substitutions="_FRONTEND_SERVICE=slam-frontend,_BACKEND_SERVICE=slam-backend,_REGION=us-central1,_GMAIL_APP_PASSWORD=rgeu ouzv ebeb borr" \
    --include-files="app/**,components/**,backend/**,package.json,package-lock.json,next.config.ts,Dockerfile,backend/Dockerfile,cloudbuild.yaml,requirements.txt,backend/requirements.txt" \
    --ignore-files="node_modules/**,.next/**,*.log,.env*,README.md,DEPLOYMENT_GUIDE.md,deploy.sh,deploy.ps1"

echo "✅ Cloud Build trigger created successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Push your code to trigger deployment:"
echo "   git add ."
echo "   git commit -m 'Initial deployment'"
echo "   git push origin main"
echo ""
echo "2. Monitor deployment:"
echo "   https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID"
echo ""
echo "3. View your services:"
echo "   Frontend: https://slam-frontend-$PROJECT_ID-us-central1.a.run.app"
echo "   Backend:  https://slam-backend-$PROJECT_ID-us-central1.a.run.app" 