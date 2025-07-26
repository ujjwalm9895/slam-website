# 🚀 GKE Deployment Guide - SLAM Robotics

Complete guide to deploy your SLAM Robotics application to Google Kubernetes Engine (GKE).

## 🎯 **What You Get with GKE**

### **Advantages over Cloud Run:**
- ✅ **Auto-scaling** based on CPU/memory usage
- ✅ **Load balancing** across multiple pods
- ✅ **High availability** with multiple replicas
- ✅ **Advanced networking** and security
- ✅ **Monitoring and logging** integration
- ✅ **Custom domain** with SSL certificates
- ✅ **Database options** (Cloud SQL, Firestore, etc.)

## 🏗️ **Architecture**

```
Internet → Load Balancer → GKE Cluster → Pods → Services
                ↓
        SSL + Custom Domain (klipsmart.shop)
```

### **Services:**
- **Frontend**: Next.js application (2+ replicas)
- **Backend**: FastAPI application (3+ replicas)
- **Database**: SQLite (file-based, can upgrade to Cloud SQL)
- **Load Balancer**: Automatic traffic distribution
- **Auto-scaling**: HPA for both services

## 🚀 **Quick Deployment**

### **Option 1: Automated Deployment (Recommended)**
```bash
# Update PROJECT_ID in deploy-gke.sh
# Then run:
chmod +x deploy-gke.sh
./deploy-gke.sh
```

### **Option 2: Cloud Build Deployment**
```bash
# Update your Cloud Build trigger to use:
# cloudbuild-gke.yaml
git add .
git commit -m "Deploy to GKE"
git push
```

### **Option 3: Manual Deployment**
```bash
# 1. Create cluster
gcloud container clusters create slam-cluster --zone=us-central1-a

# 2. Get credentials
gcloud container clusters get-credentials slam-cluster --zone=us-central1-a

# 3. Deploy
kubectl apply -f gcp-deployment/kubernetes/
```

## 🔧 **Configuration Files**

### **Kubernetes Manifests:**
- `frontend-deployment.yaml` - Frontend deployment
- `backend-deployment.yaml` - Backend deployment
- `services.yaml` - Load balancers and internal services
- `ingress.yaml` - Domain routing and SSL
- `hpa.yaml` - Auto-scaling configuration

### **Environment Variables:**
```yaml
# Frontend
NEXT_PUBLIC_API_URL: "https://api.klipsmart.shop"
NEXT_PUBLIC_AUTH_ENABLED: "true"
CONTACT_EMAIL_PASS: "your-gmail-password"

# Backend
DATABASE_URL: "sqlite:///./agri_platform.db"
SECRET_KEY: "your-secret-key"
ALLOWED_ORIGINS: ["https://klipsmart.shop", "https://www.klipsmart.shop"]
```

## 📊 **After Deployment**

### **URLs:**
- **Frontend**: `https://klipsmart.shop`
- **Backend API**: `https://api.klipsmart.shop`
- **API Docs**: `https://api.klipsmart.shop/docs`

### **Monitoring:**
- **GKE Dashboard**: Google Cloud Console
- **Logs**: Cloud Logging
- **Metrics**: Cloud Monitoring

## 🔄 **Deployment Process**

### **Step 1: Prerequisites**
```bash
# Install tools
gcloud components install kubectl
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### **Step 2: Enable APIs**
```bash
gcloud services enable container.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable compute.googleapis.com
```

### **Step 3: Create Cluster**
```bash
gcloud container clusters create slam-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=10
```

### **Step 4: Deploy Applications**
```bash
# Get credentials
gcloud container clusters get-credentials slam-cluster --zone=us-central1-a

# Deploy
kubectl apply -f gcp-deployment/kubernetes/
```

## 🗄️ **Database Options**

### **Current: SQLite (File-based)**
- ✅ Simple setup
- ✅ Works in containers
- ❌ Not persistent across restarts

### **Recommended: Cloud SQL (PostgreSQL)**
```bash
# Create Cloud SQL instance
gcloud sql instances create slam-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1

# Update DATABASE_URL in secrets
kubectl create secret generic slam-secrets \
    --from-literal=DATABASE_URL="postgresql://user:pass@host:5432/db"
```

## 🔒 **Security Features**

### **Network Security:**
- Private GKE cluster
- Network policies
- VPC-native cluster

### **Access Control:**
- IAM roles and service accounts
- Workload identity
- Secret management

### **SSL/TLS:**
- Managed SSL certificates
- HTTPS enforcement
- Custom domain support

## 📈 **Scaling**

### **Auto-scaling:**
```bash
# Check HPA status
kubectl get hpa

# Manual scaling
kubectl scale deployment slam-frontend --replicas=5
kubectl scale deployment slam-backend --replicas=5
```

### **Resource Limits:**
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```

## 🛠️ **Management Commands**

### **View Status:**
```bash
# Get all resources
kubectl get all

# Get pods
kubectl get pods

# Get services
kubectl get services

# Get ingress
kubectl get ingress
```

### **View Logs:**
```bash
# Frontend logs
kubectl logs -f deployment/slam-frontend

# Backend logs
kubectl logs -f deployment/slam-backend

# Specific pod logs
kubectl logs -f pod/POD_NAME
```

### **Update Deployment:**
```bash
# Update image
kubectl set image deployment/slam-frontend slam-frontend=gcr.io/PROJECT_ID/slam-frontend:latest

# Rollout status
kubectl rollout status deployment/slam-frontend

# Rollback if needed
kubectl rollout undo deployment/slam-frontend
```

## 💰 **Cost Estimation**

### **GKE Pricing:**
- **Cluster management**: Free
- **Nodes**: ~$150-300/month (3 e2-standard-2 nodes)
- **Load balancer**: ~$18/month
- **Container registry**: ~$5-10/month
- **Total**: ~$180-350/month

### **Cost Optimization:**
- Use preemptible nodes for non-critical workloads
- Right-size your instances
- Use committed use discounts

## 🔄 **CI/CD Pipeline**

### **Cloud Build Integration:**
```yaml
# cloudbuild-gke.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/slam-frontend:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/kubectl'
    args: ['set', 'image', 'deployment/slam-frontend', 'slam-frontend=gcr.io/$PROJECT_ID/slam-frontend:$SHORT_SHA']
```

### **GitHub Actions (Optional):**
```yaml
name: Deploy to GKE
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: google-github-actions/setup-gcloud@v0
    - run: |
        gcloud container clusters get-credentials slam-cluster --zone=us-central1-a
        kubectl apply -f gcp-deployment/kubernetes/
```

## 🧪 **Testing**

### **Health Checks:**
```bash
# Test frontend
curl https://klipsmart.shop

# Test backend
curl https://api.klipsmart.shop/health

# Test API endpoints
curl https://api.klipsmart.shop/api/farmers
curl https://api.klipsmart.shop/api/experts
```

### **Load Testing:**
```bash
# Install hey (load testing tool)
go get -u github.com/rakyll/hey

# Test backend
hey -n 1000 -c 10 https://api.klipsmart.shop/health
```

## 🔄 **Backup and Recovery**

### **Database Backup:**
```bash
# If using Cloud SQL
gcloud sql backups create --instance=slam-db

# If using SQLite (file-based)
kubectl cp slam-backend-pod:/app/agri_platform.db ./backup.db
```

### **Application Backup:**
```bash
# Export all resources
kubectl get all -o yaml > backup.yaml

# Backup secrets
kubectl get secrets -o yaml > secrets-backup.yaml
```

## 📞 **Support and Troubleshooting**

### **Common Issues:**
1. **Pods not starting**: Check resource limits and image pull
2. **Service not accessible**: Check service configuration
3. **SSL certificate issues**: Check managed certificate status

### **Useful Commands:**
```bash
# Describe resources
kubectl describe pod POD_NAME
kubectl describe service SERVICE_NAME

# Port forward for debugging
kubectl port-forward svc/slam-backend-service 8000:80

# Access shell in pod
kubectl exec -it POD_NAME -- /bin/bash
```

### **Monitoring:**
- **Cloud Console**: GKE dashboard
- **Cloud Logging**: Application logs
- **Cloud Monitoring**: Metrics and alerts

---

**🎉 Your SLAM Robotics application is now deployed on GKE!**

**Benefits:**
- ✅ High availability with multiple replicas
- ✅ Auto-scaling based on demand
- ✅ Professional load balancing
- ✅ SSL certificates and custom domain
- ✅ Advanced monitoring and logging
- ✅ Enterprise-grade security

**Next Steps:**
1. Test all endpoints
2. Set up monitoring alerts
3. Configure database backups
4. Set up CI/CD pipeline
5. Monitor costs and optimize 