#!/usr/bin/env python3
"""
Database Management Script for SLAM Robotics Platform
"""

import asyncio
import os
import shutil
from datetime import datetime
from database import init_db, AsyncSessionLocal
from models import User, Farmer, Expert, Dealer, Product, Order, Appointment, Review
from sqlmodel import select
from config import settings

class DatabaseManager:
    def __init__(self):
        self.db_path = "agri_platform.db"
    
    async def init_database(self):
        """Initialize database tables"""
        print("🔄 Initializing database...")
        await init_db()
        print("✅ Database initialized successfully!")
    
    async def reset_database(self):
        """Delete and recreate database"""
        if os.path.exists(self.db_path):
            os.remove(self.db_path)
            print(f"🗑️ Deleted existing database: {self.db_path}")
        
        await self.init_database()
        print("✅ Database reset successfully!")
    
    async def backup_database(self):
        """Create a backup of the database"""
        if not os.path.exists(self.db_path):
            print("❌ Database file not found!")
            return
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"agri_platform_backup_{timestamp}.db"
        
        # Create backups directory if it doesn't exist
        os.makedirs("backups", exist_ok=True)
        
        shutil.copy2(self.db_path, f"backups/{backup_name}")
        print(f"💾 Database backed up to: backups/{backup_name}")
    
    async def view_tables(self):
        """View all tables in the database"""
        async with AsyncSessionLocal() as session:
            result = await session.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = result.fetchall()
            
            print("📋 Database Tables:")
            for table in tables:
                print(f"  - {table[0]}")
    
    async def view_users(self):
        """View all users"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User))
            users = result.scalars().all()
            
            print(f"👥 Total Users: {len(users)}")
            for user in users:
                print(f"  - {user.name} ({user.email}) - {user.role} - {user.status}")
    
    async def view_pending_users(self):
        """View pending user approvals"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User).where(User.status == "pending"))
            users = result.scalars().all()
            
            print(f"⏳ Pending Users: {len(users)}")
            for user in users:
                print(f"  - {user.name} ({user.email}) - {user.role}")
    
    async def view_products(self):
        """View all products"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(Product))
            products = result.scalars().all()
            
            print(f"📦 Total Products: {len(products)}")
            for product in products:
                print(f"  - {product.name} (₹{product.price}) - {product.category}")
    
    async def create_sample_data(self):
        """Create sample data for testing"""
        async with AsyncSessionLocal() as session:
            # Create sample users
            sample_users = [
                User(
                    email="farmer1@example.com",
                    phone="+91-98765-43210",
                    name="Rajesh Kumar",
                    role="farmer",
                    status="approved",
                    hashed_password="hashed_password_here"
                ),
                User(
                    email="expert1@example.com",
                    phone="+91-98765-43211",
                    name="Dr. Priya Sharma",
                    role="expert",
                    status="approved",
                    hashed_password="hashed_password_here"
                ),
                User(
                    email="dealer1@example.com",
                    phone="+91-98765-43212",
                    name="Amit Patel",
                    role="dealer",
                    status="approved",
                    hashed_password="hashed_password_here"
                )
            ]
            
            for user in sample_users:
                session.add(user)
            
            await session.commit()
            print("✅ Sample data created successfully!")
    
    def show_database_info(self):
        """Show database information"""
        if os.path.exists(self.db_path):
            size = os.path.getsize(self.db_path)
            modified = datetime.fromtimestamp(os.path.getmtime(self.db_path))
            
            print("📊 Database Information:")
            print(f"  - File: {self.db_path}")
            print(f"  - Size: {size:,} bytes ({size/1024:.1f} KB)")
            print(f"  - Modified: {modified.strftime('%Y-%m-%d %H:%M:%S')}")
        else:
            print("❌ Database file not found!")

async def main():
    """Main function"""
    manager = DatabaseManager()
    
    import sys
    
    if len(sys.argv) < 2:
        print("""
🗄️ SLAM Robotics Database Manager

Usage: python manage_db.py [command]

Commands:
  init      - Initialize database tables
  reset     - Reset database (delete and recreate)
  backup    - Create database backup
  tables    - View all tables
  users     - View all users
  pending   - View pending users
  products  - View all products
  sample    - Create sample data
  info      - Show database information
  help      - Show this help message

Examples:
  python manage_db.py init
  python manage_db.py backup
  python manage_db.py users
        """)
        return
    
    command = sys.argv[1].lower()
    
    try:
        if command == "init":
            await manager.init_database()
        elif command == "reset":
            await manager.reset_database()
        elif command == "backup":
            await manager.backup_database()
        elif command == "tables":
            await manager.view_tables()
        elif command == "users":
            await manager.view_users()
        elif command == "pending":
            await manager.view_pending_users()
        elif command == "products":
            await manager.view_products()
        elif command == "sample":
            await manager.create_sample_data()
        elif command == "info":
            manager.show_database_info()
        elif command == "help":
            print("See usage above")
        else:
            print(f"❌ Unknown command: {command}")
            print("Use 'python manage_db.py help' for usage information")
    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 