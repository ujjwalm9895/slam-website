#!/bin/bash

# Agriculture Platform GCP Deployment Script
set -e

# Configuration
PROJECT_ID="your-project-id"
CLUSTER_NAME="agriculture-cluster"
ZONE="us-central1-a"
REGION="us-central1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Agriculture Platform Deployment to GCP${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed. Please install it first.${NC}"
    exit 1
fi

# Set project
echo -e "${YELLOW}📋 Setting GCP project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable container.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com

# Create GKE cluster if it doesn't exist
echo -e "${YELLOW}🏗️  Creating GKE cluster...${NC}"
if ! gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE &> /dev/null; then
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
else
    echo -e "${GREEN}✅ Cluster already exists${NC}"
fi

# Get cluster credentials
echo -e "${YELLOW}🔑 Getting cluster credentials...${NC}"
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE

# Create Cloud SQL instance
echo -e "${YELLOW}🗄️  Creating Cloud SQL instance...${NC}"
DB_INSTANCE_NAME="agriculture-db"
if ! gcloud sql instances describe $DB_INSTANCE_NAME &> /dev/null; then
    gcloud sql instances create $DB_INSTANCE_NAME \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=SSD \
        --storage-size=10GB \
        --backup-start-time=02:00 \
        --enable-backup
else
    echo -e "${GREEN}✅ Database instance already exists${NC}"
fi

# Create database
echo -e "${YELLOW}📊 Creating database...${NC}"
gcloud sql databases create agriculture_platform --instance=$DB_INSTANCE_NAME || true

# Create database user
echo -e "${YELLOW}👤 Creating database user...${NC}"
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create agriculture_user \
    --instance=$DB_INSTANCE_NAME \
    --password=$DB_PASSWORD || true

# Get database connection info
DB_HOST=$(gcloud sql instances describe $DB_INSTANCE_NAME --format="value(connectionName)")
DATABASE_URL="postgresql://agriculture_user:$DB_PASSWORD@$DB_HOST/agriculture_platform"

# Create secrets
echo -e "${YELLOW}🔐 Creating Kubernetes secrets...${NC}"
SECRET_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

kubectl create secret generic agriculture-secrets \
    --from-literal=DATABASE_URL="$DATABASE_URL" \
    --from-literal=SECRET_KEY="$SECRET_KEY" \
    --from-literal=JWT_SECRET="$JWT_SECRET" \
    --dry-run=client -o=yaml | kubectl apply -f -

# Create image pull secret
echo -e "${YELLOW}🔑 Creating image pull secret...${NC}"
gcloud iam service-accounts create agriculture-sa \
    --display-name="Agriculture Platform Service Account" || true

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:agriculture-sa@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud iam service-accounts keys create key.json \
    --iam-account=agriculture-sa@$PROJECT_ID.iam.gserviceaccount.com

kubectl create secret docker-registry gcr-secret \
    --docker-server=gcr.io \
    --docker-username=_json_key \
    --docker-password="$(cat key.json)" \
    --dry-run=client -o=yaml | kubectl apply -f -

rm key.json

# Deploy applications
echo -e "${YELLOW}🚀 Deploying applications...${NC}"

# Apply Kubernetes manifests
kubectl apply -f gcp-deployment/kubernetes/

# Wait for deployments to be ready
echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
kubectl rollout status deployment/agriculture-backend
kubectl rollout status deployment/agriculture-frontend

# Get external IPs
echo -e "${YELLOW}🌐 Getting external IPs...${NC}"
FRONTEND_IP=$(kubectl get service agriculture-frontend-loadbalancer -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
BACKEND_IP=$(kubectl get service agriculture-backend-loadbalancer -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend: http://$FRONTEND_IP${NC}"
echo -e "${GREEN}🔧 Backend: http://$BACKEND_IP${NC}"
echo -e "${GREEN}📊 Kubernetes Dashboard: https://console.cloud.google.com/kubernetes/clusters/details/$ZONE/$CLUSTER_NAME/details?project=$PROJECT_ID${NC}"

# Save configuration
cat > deployment-config.txt << EOF
Agriculture Platform Deployment Configuration
============================================

Project ID: $PROJECT_ID
Cluster: $CLUSTER_NAME
Zone: $ZONE

Database:
- Instance: $DB_INSTANCE_NAME
- Database: agriculture_platform
- User: agriculture_user
- Connection: $DATABASE_URL

External IPs:
- Frontend: http://$FRONTEND_IP
- Backend: http://$BACKEND_IP

Secrets:
- SECRET_KEY: $SECRET_KEY
- JWT_SECRET: $JWT_SECRET

Next Steps:
1. Configure DNS to point to the external IPs
2. Set up SSL certificates
3. Configure custom domain
4. Set up monitoring and logging
EOF

echo -e "${GREEN}📝 Configuration saved to deployment-config.txt${NC}" 