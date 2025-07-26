# 🚀 GCP Deployment Guide - Agriculture Platform

Complete guide to deploy the Agriculture Platform to Google Cloud Platform (GCP).

## 📋 Prerequisites

### 1. GCP Account Setup
- [ ] Create a GCP account
- [ ] Enable billing
- [ ] Create a new project
- [ ] Install Google Cloud CLI (gcloud)
- [ ] Install kubectl
- [ ] Install Docker

### 2. Required Tools
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install kubectl
gcloud components install kubectl

# Install Docker
# Follow instructions for your OS: https://docs.docker.com/get-docker/
```

## 🏗️ Infrastructure Overview

### Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Cloud SQL)   │
│   Port: 3000    │    │   Port: 8000    │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Load Balancer │
                    │   (GKE Ingress) │
                    └─────────────────┘
```

### Services Used
- **GKE (Google Kubernetes Engine)**: Container orchestration
- **Cloud SQL**: Managed PostgreSQL database
- **Cloud Build**: CI/CD pipeline
- **Container Registry**: Docker image storage
- **Load Balancer**: Traffic distribution
- **Managed SSL**: Automatic SSL certificates

## 🚀 Deployment Steps

### Step 1: Project Setup

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export CLUSTER_NAME="agriculture-cluster"
export ZONE="us-central1-a"
export REGION="us-central1"

# Set the project
gcloud config set project $PROJECT_ID
```

### Step 2: Enable Required APIs

```bash
# Enable required APIs
gcloud services enable container.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable dns.googleapis.com
```

### Step 3: Create GKE Cluster

```bash
# Create GKE cluster
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

# Get cluster credentials
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE
```

### Step 4: Create Cloud SQL Database

```bash
# Create PostgreSQL instance
gcloud sql instances create agriculture-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-type=SSD \
    --storage-size=10GB \
    --backup-start-time=02:00 \
    --enable-backup

# Create database
gcloud sql databases create agriculture_platform --instance=agriculture-db

# Create user
gcloud sql users create agriculture_user \
    --instance=agriculture-db \
    --password=$(openssl rand -base64 32)
```

### Step 5: Build and Push Docker Images

```bash
# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker

# Build and push backend image
cd backend
docker build -t gcr.io/$PROJECT_ID/agriculture-backend:latest .
docker push gcr.io/$PROJECT_ID/agriculture-backend:latest

# Build and push frontend image
cd ..
docker build -t gcr.io/$PROJECT_ID/agriculture-frontend:latest .
docker push gcr.io/$PROJECT_ID/agriculture-frontend:latest
```

### Step 6: Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic agriculture-secrets \
    --from-literal=DATABASE_URL="postgresql://agriculture_user:password@host:5432/agriculture_platform" \
    --from-literal=SECRET_KEY=$(openssl rand -base64 32) \
    --from-literal=JWT_SECRET=$(openssl rand -base64 32)

# Apply Kubernetes manifests
kubectl apply -f gcp-deployment/kubernetes/

# Check deployment status
kubectl get pods
kubectl get services
```

### Step 7: Set Up Custom Domain (Optional)

```bash
# Reserve static IP
gcloud compute addresses create agriculture-ip --global

# Get static IP
STATIC_IP=$(gcloud compute addresses describe agriculture-ip --global --format="value(address)")

# Update DNS records to point to the static IP
# Add A records for your domain and api.your-domain.com

# Apply ingress with custom domain
kubectl apply -f gcp-deployment/kubernetes/ingress.yaml
```

## 🔧 Configuration Files

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8000
DEBUG=false
ALLOWED_ORIGINS=["https://your-domain.com"]
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_AUTH_ENABLED=true
```

### Kubernetes Secrets
```bash
# Create secrets
kubectl create secret generic agriculture-secrets \
    --from-literal=DATABASE_URL="$DATABASE_URL" \
    --from-literal=SECRET_KEY="$SECRET_KEY" \
    --from-literal=JWT_SECRET="$JWT_SECRET"
```

## 📊 Monitoring and Logging

### Enable Monitoring
```bash
# Enable monitoring
gcloud container clusters update $CLUSTER_NAME \
    --zone=$ZONE \
    --enable-stackdriver-kubernetes

# View logs
kubectl logs -f deployment/agriculture-backend
kubectl logs -f deployment/agriculture-frontend
```

### Set Up Alerts
```bash
# Create alerting policies in Cloud Monitoring
# Monitor CPU, memory, and application metrics
```

## 🔒 Security Best Practices

### 1. Network Security
- Use private GKE cluster
- Configure network policies
- Use Cloud Armor for DDoS protection

### 2. Access Control
- Use IAM roles and service accounts
- Enable workload identity
- Use secret management

### 3. Data Security
- Encrypt data at rest and in transit
- Use Cloud SQL with SSL
- Regular security updates

## 🚀 Automated Deployment

### Using Cloud Build

```bash
# Submit build
gcloud builds submit --config gcp-deployment/cloudbuild.yaml

# Monitor build
gcloud builds list --limit=5
```

### Using Deployment Script

```bash
# Make script executable
chmod +x gcp-deployment/scripts/deploy.sh

# Run deployment
./gcp-deployment/scripts/deploy.sh
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GCP

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup gcloud
      uses: google-github-actions/setup-gcloud@v0
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
    
    - name: Deploy to GKE
      run: |
        gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE
        kubectl apply -f gcp-deployment/kubernetes/
```

## 📈 Scaling

### Horizontal Pod Autoscaler
```bash
# Check HPA status
kubectl get hpa

# Scale manually if needed
kubectl scale deployment agriculture-backend --replicas=5
```

### Database Scaling
```bash
# Scale Cloud SQL instance
gcloud sql instances patch agriculture-db \
    --tier=db-custom-2-4096
```

## 🛠️ Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Database connection issues**
   ```bash
   # Check database connectivity
   kubectl exec -it <pod-name> -- nc -zv <db-host> 5432
   ```

3. **SSL certificate issues**
   ```bash
   # Check certificate status
   kubectl get managedcertificate
   ```

### Useful Commands

```bash
# Get cluster info
kubectl cluster-info

# Get node info
kubectl get nodes

# Get all resources
kubectl get all

# Port forward for debugging
kubectl port-forward svc/agriculture-backend-service 8000:80

# Access shell in pod
kubectl exec -it <pod-name> -- /bin/bash
```

## 💰 Cost Optimization

### Resource Optimization
- Use preemptible nodes for non-critical workloads
- Right-size your instances
- Use committed use discounts

### Monitoring Costs
```bash
# View billing
gcloud billing accounts list
gcloud billing projects describe $PROJECT_ID
```

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup
gcloud sql backups create --instance=agriculture-db

# List backups
gcloud sql backups list --instance=agriculture-db
```

### Application Backup
```bash
# Export Kubernetes resources
kubectl get all -o yaml > backup.yaml

# Backup secrets
kubectl get secrets -o yaml > secrets-backup.yaml
```

## 📞 Support

### GCP Support
- [GCP Documentation](https://cloud.google.com/docs)
- [GCP Support](https://cloud.google.com/support)

### Application Support
- Check logs: `kubectl logs`
- Monitor metrics in Cloud Console
- Use Stackdriver for debugging

---

**🎉 Your Agriculture Platform is now deployed on GCP!**

**Next Steps:**
1. Configure your custom domain
2. Set up monitoring and alerts
3. Configure backup strategies
4. Set up CI/CD pipeline
5. Monitor costs and optimize resources 