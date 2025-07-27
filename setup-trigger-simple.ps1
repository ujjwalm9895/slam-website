# SLAM Robotics - Simple Cloud Build Trigger Setup
Write-Host "Setting up Cloud Build Trigger..." -ForegroundColor Green

# Get project ID
$PROJECT_ID = gcloud config get-value project
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor Cyan

# Enable APIs
Write-Host "Enabling APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable sourcerepo.googleapis.com

# Create repository if needed
Write-Host "Setting up repository..." -ForegroundColor Yellow
try {
    gcloud source repos describe slam-website 2>$null | Out-Null
    Write-Host "Repository exists" -ForegroundColor Green
} catch {
    gcloud source repos create slam-website --description="SLAM Robotics Website"
    git remote add google https://source.developers.google.com/p/$PROJECT_ID/r/slam-website
}

# Get Git username
$GIT_USERNAME = git config user.name
if (-not $GIT_USERNAME) { $GIT_USERNAME = "your-username" }

# Create trigger
Write-Host "Creating trigger..." -ForegroundColor Yellow
gcloud builds triggers create github --name="slam-robotics-auto-deploy" --repo-name="slam-website" --repo-owner="$GIT_USERNAME" --branch-pattern="^main$" --build-config="cloudbuild.yaml" --substitutions="_FRONTEND_SERVICE=slam-frontend,_BACKEND_SERVICE=slam-backend,_REGION=us-central1,_GMAIL_APP_PASSWORD=rgeu ouzv ebeb borr" --include-files="app/**,components/**,backend/**,package.json,package-lock.json,next.config.ts,Dockerfile,backend/Dockerfile,cloudbuild.yaml,requirements.txt,backend/requirements.txt" --ignore-files="node_modules/**,.next/**,*.log,.env*,README.md,DEPLOYMENT_GUIDE.md,deploy.sh,deploy.ps1"

Write-Host "Trigger created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'Initial deployment'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "Monitor: https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID" -ForegroundColor Cyan
Write-Host "Frontend: https://slam-frontend-$PROJECT_ID-us-central1.a.run.app" -ForegroundColor Cyan
Write-Host "Backend:  https://slam-backend-$PROJECT_ID-us-central1.a.run.app" -ForegroundColor Cyan 