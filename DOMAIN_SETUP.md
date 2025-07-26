# 🌐 klipsmart.shop Domain Setup Guide

## 📋 **Overview**
Complete setup guide to connect your custom domain `klipsmart.shop` to your Cloud Run frontend service.

## 🚀 **Deployment Architecture**
```
klipsmart.shop → Cloud Run Frontend → Cloud Run Backend
     ↓              ↓                    ↓
   Custom        Next.js App         FastAPI API
   Domain        (React 18)          (Python)
```

## 🔧 **Step 1: DNS Configuration**

### **Option A: Using Google Domains (Recommended)**
If your domain is registered with Google Domains:

1. **Go to Google Domains Console**
   ```
   https://domains.google.com/registrar/klipsmart.shop
   ```

2. **Configure DNS Records**
   - Go to **DNS** → **Manage custom records**
   - Add these records:

   ```
   Type: A
   Name: @
   Value: 199.36.158.100
   TTL: 3600
   ```

   ```
   Type: CNAME
   Name: www
   Value: klipsmart.shop
   TTL: 3600
   ```

### **Option B: Using Other DNS Providers**
If using Namecheap, GoDaddy, etc.:

1. **Add A Record**
   ```
   Type: A
   Host: @ (or leave blank)
   Value: 199.36.158.100
   TTL: 3600
   ```

2. **Add CNAME Record**
   ```
   Type: CNAME
   Host: www
   Value: klipsmart.shop
   TTL: 3600
   ```

## 🔒 **Step 2: SSL Certificate**

Cloud Run automatically provisions SSL certificates for custom domains:

1. **Domain mapping is handled by Cloud Build**
   - The deployment automatically maps `klipsmart.shop`
   - SSL certificate is provisioned automatically
   - Takes 5-10 minutes to propagate

2. **Verify SSL Status**
   ```bash
   # Check domain mapping
   gcloud run domain-mappings list --region=us-central1
   
   # Check SSL certificate
   curl -I https://klipsmart.shop
   ```

## 🚀 **Step 3: Deploy with Custom Domain**

### **Automatic Deployment**
Your Cloud Build configuration now includes domain mapping:

```bash
# Deploy everything including domain mapping
git add .
git commit -m "Add custom domain mapping for klipsmart.shop"
git push origin master
```

### **Manual Domain Mapping (if needed)**
```bash
# Map domain to frontend service
gcloud run domain-mappings create \
  --service=slam-frontend \
  --domain=klipsmart.shop \
  --region=us-central1 \
  --force-override
```

## 🔍 **Step 4: Verify Setup**

### **Check Domain Mapping**
```bash
# List domain mappings
gcloud run domain-mappings list --region=us-central1

# Expected output:
# DOMAIN          SERVICE        REGION       ROUTE_NAME
# klipsmart.shop  slam-frontend  us-central1  slam-frontend
```

### **Test Your Website**
```bash
# Test frontend
curl -I https://klipsmart.shop

# Test backend API
curl -I https://slam-backend-[PROJECT_ID]-uc.a.run.app/health
```

## 📊 **Expected URLs After Deployment**

### **Production URLs**
- **Frontend**: `https://klipsmart.shop`
- **Backend API**: `https://slam-backend-[PROJECT_ID]-uc.a.run.app`
- **API Documentation**: `https://slam-backend-[PROJECT_ID]-uc.a.run.app/docs`

### **Health Check Endpoints**
- **Frontend Health**: `https://klipsmart.shop/api/health`
- **Backend Health**: `https://slam-backend-[PROJECT_ID]-uc.a.run.app/health`

## 🔧 **Troubleshooting**

### **Domain Not Working**
1. **Check DNS Propagation**
   ```bash
   # Check if DNS is propagated
   nslookup klipsmart.shop
   dig klipsmart.shop
   ```

2. **Check Domain Mapping**
   ```bash
   gcloud run domain-mappings describe \
     --domain=klipsmart.shop \
     --region=us-central1
   ```

3. **Verify SSL Certificate**
   ```bash
   # Check SSL status
   openssl s_client -connect klipsmart.shop:443 -servername klipsmart.shop
   ```

### **Common Issues**

#### **DNS Not Propagated**
- **Wait 24-48 hours** for DNS propagation
- **Check with different DNS servers**
- **Verify A record points to 199.36.158.100**

#### **SSL Certificate Issues**
- **Wait 5-10 minutes** after domain mapping
- **Check domain mapping status**
- **Verify domain ownership**

#### **Service Not Responding**
- **Check Cloud Run service status**
- **Verify service is deployed**
- **Check service logs**

## 📈 **Monitoring**

### **Domain Health**
```bash
# Monitor domain mapping
gcloud run domain-mappings list --region=us-central1

# Check service status
gcloud run services describe slam-frontend --region=us-central1
```

### **Performance Monitoring**
- **Cloud Run Console**: Real-time metrics
- **Cloud Monitoring**: Custom dashboards
- **Cloud Logging**: Request logs

## ✅ **Success Checklist**

- [ ] **DNS A record** points to `199.36.158.100`
- [ ] **CNAME record** for `www` subdomain
- [ ] **Domain mapping** created in Cloud Run
- [ ] **SSL certificate** provisioned
- [ ] **Website accessible** at `https://klipsmart.shop`
- [ ] **API working** at backend URL
- [ ] **Health checks** passing

## 🎉 **You're Live!**

Once deployed, your website will be available at:
**🌐 https://klipsmart.shop**

Your SLAM Robotics Agriculture Platform is now live with a professional custom domain! 🚀 