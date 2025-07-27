# SLAM Robotics - PowerShell Deployment Script for Cloud Build
# This script triggers a Cloud Build to deploy the application

Write-Host "🚀 Starting SLAM Robotics deployment to Google Cloud Platform..." -ForegroundColor Green

# Check if gcloud is authenticated
try {
    $authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
    if (-not $authStatus) {
        Write-Host "❌ Error: Not authenticated with gcloud. Please run 'gcloud auth login' first." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: gcloud not found. Please install Google Cloud SDK first." -ForegroundColor Red
    exit 1
}

# Get current project ID
$PROJECT_ID = gcloud config get-value project 2>$null
if (-not $PROJECT_ID) {
    Write-Host "❌ Error: No project ID set. Please run 'gcloud config set project YOUR_PROJECT_ID' first." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Project ID: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "🌍 Region: us-central1" -ForegroundColor Cyan

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Submit build to Cloud Build
Write-Host "🏗️  Submitting build to Cloud Build..." -ForegroundColor Yellow
Write-Host "⏳ This may take 10-15 minutes for the first deployment..." -ForegroundColor Yellow

$BUILD_ID = gcloud builds submit --config cloudbuild.yaml . --format="value(id)"

Write-Host "✅ Build submitted successfully!" -ForegroundColor Green
Write-Host "📊 Build ID: $BUILD_ID" -ForegroundColor Cyan
Write-Host "🔍 Check build status: https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID" -ForegroundColor Cyan

# Wait for build to complete
Write-Host "⏳ Waiting for build to complete..." -ForegroundColor Yellow
gcloud builds log $BUILD_ID --stream

Write-Host ""
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your services are available at:" -ForegroundColor Cyan
Write-Host "   Frontend: https://slam-frontend-$PROJECT_ID-us-central1.a.run.app" -ForegroundColor White
Write-Host "   Backend:  https://slam-backend-$PROJECT_ID-us-central1.a.run.app" -ForegroundColor White
Write-Host ""
Write-Host "📚 API Documentation: https://slam-backend-$PROJECT_ID-us-central1.a.run.app/docs" -ForegroundColor Cyan 