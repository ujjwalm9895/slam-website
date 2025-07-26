#!/bin/bash

# Agriculture Platform GCP Deployment Script
# Complete deployment automation for GCP

set -e

# Configuration - UPDATE THESE VALUES
PROJECT_ID="your-project-id"
CLUSTER_NAME="agriculture-cluster"
ZONE="us-central1-a"
REGION="us-central1"
DOMAIN="your-domain.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output..
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists gcloud; then
        print_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists kubectl; then
        print_error "kubectl is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to setup project
setup_project() {
    print_status "Setting up GCP project..."
    
    # Set project
    gcloud config set project $PROJECT_ID
    
    # Enable required APIs
    print_status "Enabling required APIs..."
    gcloud services enable container.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable compute.googleapis.com
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable dns.googleapis.com
    
    print_success "Project setup completed"
}

# Function to create GKE cluster
create_cluster() {
    print_status "Creating GKE cluster..."
    
    if gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE &> /dev/null; then
        print_warning "Cluster already exists, skipping creation"
    else
        gcloud container clusters create $CLUSTER_NAME \
            --zone=$ZONE \
            --num-nodes=3 \
            --min-nodes=1 \
            --max-nodes=10 \
            --enable-autoscaling \
            --machine-type=e2-standard-2 \
            --disk-size=50 \
            --enable-network-policy \
            --enable-ip-alias
        
        print_success "GKE cluster created"
    fi
    
    # Get cluster credentials
    gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE
}

# Function to create database
create_database() {
    print_status "Creating Cloud SQL database..."
    
    DB_INSTANCE_NAME="agriculture-db"
    
    if gcloud sql instances describe $DB_INSTANCE_NAME &> /dev/null; then
        print_warning "Database instance already exists, skipping creation"
    else
        gcloud sql instances create $DB_INSTANCE_NAME \
            --database-version=POSTGRES_15 \
            --tier=db-f1-micro \
            --region=$REGION \
            --storage-type=SSD \
            --storage-size=10GB \
            --backup-start-time=02:00 \
            --enable-backup
        
        print_success "Database instance created"
    fi
    
    # Create database
    gcloud sql databases create agriculture_platform --instance=$DB_INSTANCE_NAME || true
    
    # Create user
    DB_PASSWORD=$(openssl rand -base64 32)
    gcloud sql users create agriculture_user \
        --instance=$DB_INSTANCE_NAME \
        --password=$DB_PASSWORD || true
    
    # Get connection info
    DB_HOST=$(gcloud sql instances describe $DB_INSTANCE_NAME --format="value(connectionName)")
    DATABASE_URL="postgresql://agriculture_user:$DB_PASSWORD@$DB_HOST/agriculture_platform"
    
    print_success "Database setup completed"
}

# Function to build and push images
build_images() {
    print_status "Building and pushing Docker images..."
    
    # Configure Docker
    gcloud auth configure-docker
    
    # Build and push backend
    print_status "Building backend image..."
    cd backend
    docker build -t gcr.io/$PROJECT_ID/agriculture-backend:latest .
    docker push gcr.io/$PROJECT_ID/agriculture-backend:latest
    cd ..
    
    # Build and push frontend
    print_status "Building frontend image..."
    docker build -t gcr.io/$PROJECT_ID/agriculture-frontend:latest .
    docker push gcr.io/$PROJECT_ID/agriculture-frontend:latest
    
    print_success "Images built and pushed"
}

# Function to deploy to Kubernetes
deploy_to_kubernetes() {
    print_status "Deploying to Kubernetes..."
    
    # Create secrets
    SECRET_KEY=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 32)
    
    kubectl create secret generic agriculture-secrets \
        --from-literal=DATABASE_URL="$DATABASE_URL" \
        --from-literal=SECRET_KEY="$SECRET_KEY" \
        --from-literal=JWT_SECRET="$JWT_SECRET" \
        --dry-run=client -o=yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    kubectl apply -f gcp-deployment/kubernetes/
    
    # Wait for deployments
    print_status "Waiting for deployments to be ready..."
    kubectl rollout status deployment/agriculture-backend
    kubectl rollout status deployment/agriculture-frontend
    
    print_success "Deployment completed"
}

# Function to setup domain
setup_domain() {
    if [ "$DOMAIN" = "your-domain.com" ]; then
        print_warning "Domain not configured, skipping domain setup"
        return
    fi
    
    print_status "Setting up custom domain..."
    
    # Reserve static IP
    gcloud compute addresses create agriculture-ip --global || true
    
    # Get static IP
    STATIC_IP=$(gcloud compute addresses describe agriculture-ip --global --format="value(address)")
    
    print_success "Static IP reserved: $STATIC_IP"
    print_warning "Please update your DNS records:"
    echo "Type: A, Name: @, Value: $STATIC_IP"
    echo "Type: A, Name: api, Value: $STATIC_IP"
}

# Function to get deployment info
get_deployment_info() {
    print_status "Getting deployment information..."
    
    # Get external IPs
    FRONTEND_IP=$(kubectl get service agriculture-frontend-loadbalancer -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Not available")
    BACKEND_IP=$(kubectl get service agriculture-backend-loadbalancer -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Not available")
    
    echo ""
    echo "=========================================="
    echo "🚀 DEPLOYMENT COMPLETED SUCCESSFULLY!"
    echo "=========================================="
    echo ""
    echo "Project ID: $PROJECT_ID"
    echo "Cluster: $CLUSTER_NAME"
    echo "Zone: $ZONE"
    echo ""
    echo "External IPs:"
    echo "Frontend: http://$FRONTEND_IP"
    echo "Backend: http://$BACKEND_IP"
    echo ""
    echo "Kubernetes Dashboard:"
    echo "https://console.cloud.google.com/kubernetes/clusters/details/$ZONE/$CLUSTER_NAME/details?project=$PROJECT_ID"
    echo ""
    echo "Next Steps:"
    echo "1. Wait for external IPs to be assigned (may take a few minutes)"
    echo "2. Test your application"
    echo "3. Configure custom domain if needed"
    echo "4. Set up monitoring and alerts"
    echo ""
}

# Main deployment function
main() {
    echo "🚀 Agriculture Platform GCP Deployment"
    echo "======================================"
    echo ""
    
    # Check if project ID is set
    if [ "$PROJECT_ID" = "your-project-id" ]; then
        print_error "Please update PROJECT_ID in this script"
        exit 1
    fi
    
    # Run deployment steps
    check_prerequisites
    setup_project
    create_cluster
    create_database
    build_images
    deploy_to_kubernetes
    setup_domain
    get_deployment_info
    
    print_success "Deployment completed successfully!"
}

# Run main function
main "$@" 