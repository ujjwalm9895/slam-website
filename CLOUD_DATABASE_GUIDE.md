# ☁️ Cloud पर Database देखने का Guide

## 🔍 **Cloud Run में Database देखने के तरीके**

### **1. 📊 Cloud Run Logs से Database Status**

```bash
# Backend service के logs देखें
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend" --limit=50

# Real-time logs देखें
gcloud logs tail "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend"

# Database initialization logs देखें
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend AND textPayload:database" --limit=20
```

### **2. 🌐 API Endpoints से Database Data देखें**

#### **Health Check:**
```bash
curl https://api.klipsmart.shop/health
```

#### **Users देखें:**
```bash
curl https://api.klipsmart.shop/api/users
```

#### **Products देखें:**
```bash
curl https://api.klipsmart.shop/api/products
```

#### **Farmers देखें:**
```bash
curl https://api.klipsmart.shop/api/farmers
```

#### **Experts देखें:**
```bash
curl https://api.klipsmart.shop/api/experts
```

#### **Dealers देखें:**
```bash
curl https://api.klipsmart.shop/api/dealers
```

### **3. 🖥️ Admin Panel से Database देखें**

**Admin Panel URL**: `https://klipsmart.shop/admin`

**Login Credentials:**
- **Username**: `admin`
- **Password**: `slam2024`

**Admin Panel में देख सकते हैं:**
- ✅ Pending user approvals
- ✅ User details
- ✅ User statistics
- ✅ Approve/reject users

### **4. 🔧 Cloud Console से Database देखें**

#### **Google Cloud Console में:**
1. **Cloud Run** → `slam-backend` service
2. **Logs** tab में database logs देखें
3. **Revisions** में container logs देखें

#### **Cloud Build Logs:**
```bash
# Latest build logs देखें
gcloud builds list --limit=5

# Specific build logs देखें
gcloud builds log [BUILD_ID]
```

### **5. 📱 Browser से Direct API Calls**

#### **Browser में ये URLs खोलें:**

1. **Health Check:**
   ```
   https://api.klipsmart.shop/health
   ```

2. **API Documentation:**
   ```
   https://api.klipsmart.shop/docs
   ```

3. **Users API:**
   ```
   https://api.klipsmart.shop/api/users
   ```

4. **Products API:**
   ```
   https://api.klipsmart.shop/api/products
   ```

### **6. 🛠️ Database Management Script (Cloud में)**

#### **Cloud Run में Database Script चलाने के लिए:**

```bash
# Cloud Run service में execute करें
gcloud run services update slam-backend --region=us-central1 --set-env-vars=ENABLE_DB_MANAGEMENT=true

# या temporary container में चलाएं
gcloud run jobs create db-manager --image=gcr.io/[PROJECT_ID]/slam-backend --command="python" --args="manage_db.py" --region=us-central1
```

### **7. 📊 Database Statistics देखने के लिए**

#### **Admin Panel Statistics:**
- Total pending users
- Users by role (farmers, experts, dealers)
- Recent registrations
- Approval status

#### **API Statistics:**
```bash
# User count
curl https://api.klipsmart.shop/api/users | jq '. | length'

# Product count
curl https://api.klipsmart.shop/api/products | jq '. | length'
```

### **8. 🔍 Database Debugging**

#### **Database Connection Test:**
```bash
# Health endpoint से database status
curl https://api.klipsmart.shop/health
```

#### **Error Logs देखें:**
```bash
# Database errors
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend AND severity>=ERROR" --limit=20
```

### **9. 📈 Database Monitoring**

#### **Cloud Monitoring Setup:**
```bash
# Custom metrics create करें
gcloud monitoring metrics create --display-name="Database Users" --type="custom.googleapis.com/database/users"

# Alerts setup करें
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

### **10. 🗄️ Database Backup (Cloud में)**

#### **Cloud Storage में Backup:**
```bash
# Database backup to Cloud Storage
gsutil cp agri_platform.db gs://[BUCKET_NAME]/backups/agri_platform_$(date +%Y%m%d_%H%M%S).db
```

## 🚀 **Quick Commands Summary**

### **Database Status Check:**
```bash
# Health check
curl https://api.klipsmart.shop/health

# Users count
curl https://api.klipsmart.shop/api/users | jq '. | length'

# Recent logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend" --limit=10
```

### **Admin Panel Access:**
```
URL: https://klipsmart.shop/admin
Username: admin
Password: slam2024
```

### **API Documentation:**
```
URL: https://api.klipsmart.shop/docs
```

## 🎯 **Best Practices**

1. **Regular Monitoring**: Daily health checks
2. **Log Analysis**: Weekly log reviews
3. **Backup Strategy**: Automated backups
4. **Performance Monitoring**: Track response times
5. **Security**: Regular credential updates

## 🔧 **Troubleshooting**

### **Database Not Accessible:**
```bash
# Check service status
gcloud run services describe slam-backend --region=us-central1

# Check logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend" --limit=20
```

### **API Not Responding:**
```bash
# Test API endpoints
curl -v https://api.klipsmart.shop/health
curl -v https://api.klipsmart.shop/api/users
```

---

**💡 Tip**: Admin Panel सबसे आसान तरीका है database देखने के लिए! 