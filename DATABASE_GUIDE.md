# 🗄️ Database Management Guide

## 📁 Database Overview

Your SLAM Robotics application uses **SQLite** database with the following structure:

### **Database File:**
- **Local**: `backend/agri_platform.db`
- **Production**: `/app/agri_platform.db` (Docker container)

### **Database URL:**
```
sqlite+aiosqlite:////app/agri_platform.db
```

## 🏗️ Database Schema

### **Main Tables:**

1. **users** - Base user information
2. **farmers** - Farmer-specific data
3. **experts** - Agricultural experts
4. **dealers** - Product dealers
5. **products** - Available products
6. **orders** - Purchase orders
7. **appointments** - Expert consultations
8. **reviews** - User ratings and reviews

## 🔧 Database Management

### **1. Local Development**

#### **Start Backend with Database:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### **Reset Database (Delete and Recreate):**
```bash
# Stop the backend server first
rm agri_platform.db
python -c "from database import init_db; import asyncio; asyncio.run(init_db())"
```

#### **View Database with SQLite Browser:**
```bash
# Install SQLite browser (if not installed)
# Windows: Download from https://sqlitebrowser.org/
# Mac: brew install db-browser-for-sqlite
# Linux: sudo apt-get install sqlitebrowser

# Open database
sqlitebrowser agri_platform.db
```

### **2. Production (Cloud Run)**

#### **Access Database in Production:**
```bash
# Connect to Cloud Run service
gcloud run services describe slam-backend --region=us-central1

# View logs to see database status
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=slam-backend" --limit=50
```

#### **Backup Database:**
```bash
# Download database from Cloud Run (if needed)
gcloud run services describe slam-backend --region=us-central1 --format="value(status.url)"
```

## 📊 Database Operations

### **1. View All Tables:**
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

### **2. View Users:**
```sql
SELECT * FROM users;
```

### **3. View Pending Approvals:**
```sql
SELECT * FROM users WHERE status = 'pending';
```

### **4. View Products:**
```sql
SELECT * FROM products;
```

### **5. View Orders:**
```sql
SELECT * FROM orders;
```

## 🛠️ Database Tools

### **1. SQLite Command Line:**
```bash
# Connect to database
sqlite3 backend/agri_platform.db

# View tables
.tables

# View schema
.schema users

# Exit
.quit
```

### **2. Python Scripts for Database Management:**

#### **Create Sample Data:**
```python
# create_sample_data.py
import asyncio
from database import AsyncSessionLocal
from models import User, Farmer, Expert, Dealer, Product
from sqlmodel import select

async def create_sample_data():
    async with AsyncSessionLocal() as session:
        # Create sample users
        # Add your sample data here
        await session.commit()

if __name__ == "__main__":
    asyncio.run(create_sample_data())
```

#### **Database Backup Script:**
```python
# backup_db.py
import shutil
from datetime import datetime

def backup_database():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"agri_platform_backup_{timestamp}.db"
    shutil.copy2("agri_platform.db", f"backups/{backup_name}")
    print(f"Database backed up to: {backup_name}")

if __name__ == "__main__":
    backup_database()
```

## 🔐 Admin Database Access

### **Admin Credentials:**
- **Username**: `admin`
- **Password**: `slam2024`

### **Admin Panel Features:**
- View pending user registrations
- Approve/reject users
- View user details
- Manage user status

## 🚨 Important Notes

### **1. Database Persistence:**
- **Local**: Database file persists between restarts
- **Production**: Database is ephemeral (resets on container restart)
- **Solution**: Use Cloud SQL or persistent storage for production

### **2. Backup Strategy:**
- **Local**: Manual backup of `agri_platform.db`
- **Production**: Implement automated backups

### **3. Migration Strategy:**
- **Current**: Auto-create tables on startup
- **Future**: Use Alembic for schema migrations

## 🔧 Troubleshooting

### **Common Issues:**

1. **Database Locked:**
   ```bash
   # Stop all processes using the database
   # Delete the database file and restart
   rm agri_platform.db
   ```

2. **Permission Denied:**
   ```bash
   # Check file permissions
   chmod 644 agri_platform.db
   ```

3. **Database Corrupted:**
   ```bash
   # Delete and recreate
   rm agri_platform.db
   # Restart backend to recreate
   ```

## 📈 Monitoring

### **Database Health Check:**
```bash
# Check if database is accessible
curl https://localhost:8000/health
```

### **View Database Size:**
```bash
ls -lh backend/agri_platform.db
```

## 🎯 Next Steps

1. **Set up automated backups**
2. **Implement database migrations**
3. **Add database monitoring**
4. **Set up production database (Cloud SQL)**

---

**Need Help?** Check the backend logs or contact the development team. 