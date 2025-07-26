#!/bin/bash

# Domain Setup Script for Agriculture Platform
set -e

# Configuration
PROJECT_ID="your-project-id"
DOMAIN="your-domain.com"
API_SUBDOMAIN="api.your-domain.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🌐 Setting up custom domain and SSL for Agriculture Platform${NC}"

# Check if domain is provided
if [ "$DOMAIN" = "your-domain.com" ]; then
    echo -e "${RED}❌ Please update the DOMAIN variable in this script${NC}"
    exit 1
fi

# Get external IPs
echo -e "${YELLOW}📋 Getting external IPs...${NC}"
FRONTEND_IP=$(kubectl get service agriculture-frontend-loadbalancer -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
BACKEND_IP=$(kubectl get service agriculture-backend-loadbalancer -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

echo -e "${GREEN}✅ Frontend IP: $FRONTEND_IP${NC}"
echo -e "${GREEN}✅ Backend IP: $BACKEND_IP${NC}"

# Create DNS records
echo -e "${YELLOW}📝 Creating DNS records...${NC}"
echo -e "${YELLOW}Please add the following DNS records to your domain provider:${NC}"
echo ""
echo "Type: A"
echo "Name: @"
echo "Value: $FRONTEND_IP"
echo "TTL: 300"
echo ""
echo "Type: A"
echo "Name: api"
echo "Value: $BACKEND_IP"
echo "TTL: 300"
echo ""

# Wait for DNS propagation
echo -e "${YELLOW}⏳ Waiting for DNS propagation (this may take up to 24 hours)...${NC}"
echo -e "${YELLOW}You can check propagation using:${NC}"
echo "nslookup $DOMAIN"
echo "nslookup $API_SUBDOMAIN"

# Update ingress with custom domain
echo -e "${YELLOW}🔧 Updating ingress configuration...${NC}"
cat > ingress-custom.yaml << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agriculture-ingress
  annotations:
    kubernetes.io/ingress.class: "gce"
    kubernetes.io/ingress.global-static-ip-name: "agriculture-ip"
    networking.gke.io/managed-certificates: "agriculture-cert"
    kubernetes.io/ingress.allow-http: "false"
spec:
  rules:
  - host: $DOMAIN
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: agriculture-frontend-service
            port:
              number: 80
  - host: $API_SUBDOMAIN
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: agriculture-backend-service
            port:
              number: 80
---
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: agriculture-cert
spec:
  domains:
  - $DOMAIN
  - $API_SUBDOMAIN
EOF

kubectl apply -f ingress-custom.yaml

# Reserve static IP
echo -e "${YELLOW}🌐 Reserving static IP...${NC}"
gcloud compute addresses create agriculture-ip --global

# Get static IP
STATIC_IP=$(gcloud compute addresses describe agriculture-ip --global --format="value(address)")
echo -e "${GREEN}✅ Static IP reserved: $STATIC_IP${NC}"

# Update DNS with static IP
echo -e "${YELLOW}📝 Update your DNS records to use the static IP:${NC}"
echo ""
echo "Type: A"
echo "Name: @"
echo "Value: $STATIC_IP"
echo "TTL: 300"
echo ""
echo "Type: A"
echo "Name: api"
echo "Value: $STATIC_IP"
echo "TTL: 300"
echo ""

# Wait for SSL certificate
echo -e "${YELLOW}🔒 Waiting for SSL certificate to be provisioned...${NC}"
echo -e "${YELLOW}This may take up to 60 minutes...${NC}"

# Check certificate status
kubectl get managedcertificate agriculture-cert -o yaml

echo -e "${GREEN}✅ Domain setup completed!${NC}"
echo -e "${GREEN}🌐 Your application will be available at:${NC}"
echo -e "${GREEN}   Frontend: https://$DOMAIN${NC}"
echo -e "${GREEN}   Backend: https://$API_SUBDOMAIN${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Update your DNS records with the static IP"
echo "2. Wait for DNS propagation (up to 24 hours)"
echo "3. SSL certificate will be automatically provisioned"
echo "4. Test your application at the new URLs" 