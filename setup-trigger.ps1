# SLAM Robotics - PowerShell Cloud Build Trigger Setup Script
# This script sets up automatic deployment triggered by Git commits

Write-Host "🚀 Setting up Cloud Build Trigger for automatic deployment..." -ForegroundColor Green

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

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable sourcerepo.googleapis.com

# Check if repository exists
Write-Host "🔍 Checking repository connection..." -ForegroundColor Yellow
try {
    gcloud source repos describe slam-website 2>$null | Out-Null
    Write-Host "✅ Repository connection already exists" -ForegroundColor Green
} catch {
    Write-Host "📦 Setting up repository connection..." -ForegroundColor Yellow
    
    # Get the current Git remote URL
    try {
        $REMOTE_URL = git remote get-url origin 2>$null
    } catch {
        $REMOTE_URL = ""
    }
    
    if (-not $REMOTE_URL) {
        Write-Host "❌ Error: No Git remote found. Please add a remote origin first:" -ForegroundColor Red
        Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/slam-website.git" -ForegroundColor White
        exit 1
    }
    
    Write-Host "🔗 Connecting to repository: $REMOTE_URL" -ForegroundColor Cyan
    
    # Create Cloud Source Repository mirror
    gcloud source repos create slam-website --description="SLAM Robotics Website Repository"
    
    # Add the remote
    git remote add google https://source.developers.google.com/p/$PROJECT_ID/r/slam-website
}

# Create Cloud Build trigger
Write-Host "⚡ Creating Cloud Build trigger..." -ForegroundColor Yellow

# Get Git username
try {
    $GIT_USERNAME = git config user.name 2>$null
    if (-not $GIT_USERNAME) {
        $GIT_USERNAME = "your-username"
    }
} catch {
    $GIT_USERNAME = "your-username"
}

gcloud builds triggers create github `
    --name="slam-robotics-auto-deploy" `
    --repo-name="slam-website" `
    --repo-owner="$GIT_USERNAME" `
    --branch-pattern="^main$" `
    --build-config="cloudbuild.yaml" `
    --substitutions="_FRONTEND_SERVICE=slam-frontend,_BACKEND_SERVICE=slam-backend,_REGION=us-central1,_GMAIL_APP_PASSWORD=rgeu ouzv ebeb borr" `
    --include-files="app/**,components/**,backend/**,package.json,package-lock.json,next.config.ts,Dockerfile,backend/Dockerfile,cloudbuild.yaml,requirements.txt,backend/requirements.txt" `
    --ignore-files="node_modules/**,.next/**,*.log,.env*,README.md,DEPLOYMENT_GUIDE.md,deploy.sh,deploy.ps1"

Write-Host "✅ Cloud Build trigger created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to trigger deployment:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Initial deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Monitor deployment:" -ForegroundColor White
Write-Host "   https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. View your services:" -ForegroundColor White
Write-Host "   Frontend: https://slam-frontend-$PROJECT_ID-us-central1.a.run.app" -ForegroundColor Cyan
Write-Host "   Backend:  https://slam-backend-$PROJECT_ID-us-central1.a.run.app" -ForegroundColor Cyan 