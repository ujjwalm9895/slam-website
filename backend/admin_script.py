#!/usr/bin/env python3
"""
Agriculture Platform Admin Script
Command-line interface for managing users, approvals, and platform administration
"""

import asyncio
import sys
import os
from datetime import datetime
from typing import Optional
import argparse

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import select
from database import get_session
from models import User, UserRole, Farmer, Expert, Dealer
from utils.auth import get_password_hash

class AdminCLI:
    def __init__(self):
        self.session = None
    
    async def init_session(self):
        """Initialize database session"""
        self.session = await get_session().__anext__()
    
    async def close_session(self):
        """Close database session"""
        if self.session:
            await self.session.close()
    
    async def create_admin_user(self, name: str, email: str, password: str, phone: str):
        """Create an admin user"""
        try:
            # Check if admin already exists
            result = await self.session.execute(
                select(User).where(User.email == email)
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"❌ User with email {email} already exists!")
                return False
            
            # Create admin user
            hashed_password = get_password_hash(password)
            admin_user = User(
                name=name,
                email=email,
                phone=phone,
                hashed_password=hashed_password,
                role=UserRole.ADMIN,
                status="approved",
                is_active=True,
                is_verified=True
            )
            
            self.session.add(admin_user)
            await self.session.commit()
            await self.session.refresh(admin_user)
            
            print(f"✅ Admin user created successfully!")
            print(f"   Name: {admin_user.name}")
            print(f"   Email: {admin_user.email}")
            print(f"   Role: {admin_user.role}")
            return True
            
        except Exception as e:
            await self.session.rollback()
            print(f"❌ Error creating admin user: {str(e)}")
            return False
    
    async def list_pending_users(self):
        """List all pending user approvals"""
        try:
            result = await self.session.execute(
                select(User).where(User.status == "pending")
            )
            pending_users = result.scalars().all()
            
            if not pending_users:
                print("✅ No pending users found!")
                return
            
            print(f"\n📋 Found {len(pending_users)} pending users:")
            print("-" * 80)
            
            for user in pending_users:
                print(f"ID: {user.id}")
                print(f"Name: {user.name}")
                print(f"Email: {user.email}")
                print(f"Role: {user.role}")
                print(f"Phone: {user.phone}")
                print(f"Created: {user.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
                print("-" * 40)
                
        except Exception as e:
            print(f"❌ Error listing pending users: {str(e)}")
    
    async def approve_user(self, user_id: int):
        """Approve a user"""
        try:
            result = await self.session.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()
            
            if not user:
                print(f"❌ User with ID {user_id} not found!")
                return False
            
            if user.status == "approved":
                print(f"⚠️  User {user.name} is already approved!")
                return False
            
            user.status = "approved"
            user.updated_at = datetime.utcnow()
            
            await self.session.commit()
            
            print(f"✅ User {user.name} ({user.email}) approved successfully!")
            return True
            
        except Exception as e:
            await self.session.rollback()
            print(f"❌ Error approving user: {str(e)}")
            return False
    
    async def reject_user(self, user_id: int, reason: str = ""):
        """Reject a user"""
        try:
            result = await self.session.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()
            
            if not user:
                print(f"❌ User with ID {user_id} not found!")
                return False
            
            if user.status == "rejected":
                print(f"⚠️  User {user.name} is already rejected!")
                return False
            
            user.status = "rejected"
            user.updated_at = datetime.utcnow()
            
            await self.session.commit()
            
            print(f"❌ User {user.name} ({user.email}) rejected successfully!")
            if reason:
                print(f"   Reason: {reason}")
            return True
            
        except Exception as e:
            await self.session.rollback()
            print(f"❌ Error rejecting user: {str(e)}")
            return False
    
    async def get_platform_stats(self):
        """Get platform statistics"""
        try:
            # Total users by status
            pending_result = await self.session.execute(
                select(User).where(User.status == "pending")
            )
            pending_count = len(pending_result.scalars().all())
            
            approved_result = await self.session.execute(
                select(User).where(User.status == "approved")
            )
            approved_count = len(approved_result.scalars().all())
            
            rejected_result = await self.session.execute(
                select(User).where(User.status == "rejected")
            )
            rejected_count = len(rejected_result.scalars().all())
            
            # Users by role
            farmers_result = await self.session.execute(
                select(User).where(User.role == UserRole.FARMER, User.status == "approved")
            )
            farmers_count = len(farmers_result.scalars().all())
            
            experts_result = await self.session.execute(
                select(User).where(User.role == UserRole.EXPERT, User.status == "approved")
            )
            experts_count = len(experts_result.scalars().all())
            
            dealers_result = await self.session.execute(
                select(User).where(User.role == UserRole.DEALER, User.status == "approved")
            )
            dealers_count = len(dealers_result.scalars().all())
            
            admins_result = await self.session.execute(
                select(User).where(User.role == UserRole.ADMIN)
            )
            admins_count = len(admins_result.scalars().all())
            
            print("\n📊 Platform Statistics:")
            print("=" * 50)
            print(f"Total Users: {pending_count + approved_count + rejected_count}")
            print(f"  ├─ Pending: {pending_count}")
            print(f"  ├─ Approved: {approved_count}")
            print(f"  └─ Rejected: {rejected_count}")
            print()
            print("Users by Role (Approved):")
            print(f"  ├─ Farmers: {farmers_count}")
            print(f"  ├─ Experts: {experts_count}")
            print(f"  ├─ Dealers: {dealers_count}")
            print(f"  └─ Admins: {admins_count}")
            
        except Exception as e:
            print(f"❌ Error getting platform stats: {str(e)}")
    
    async def seed_sample_data(self):
        """Seed the database with sample data"""
        try:
            print("🌱 Seeding sample data...")
            
            # Create sample farmers
            farmer1 = User(
                name="Rajesh Patel",
                email="rajesh.farmer@example.com",
                phone="+91-98765-43210",
                hashed_password=get_password_hash("password123"),
                role=UserRole.FARMER,
                status="approved",
                is_active=True
            )
            self.session.add(farmer1)
            await self.session.flush()
            
            farmer_profile1 = Farmer(
                user_id=farmer1.id,
                location="Mumbai, Maharashtra",
                crop_type="Wheat, Rice",
                farm_size=50.0,
                farm_size_unit="acres",
                description="Experienced farmer with 20+ years in agriculture",
                is_online=True,
                rating=4.5,
                total_reviews=12
            )
            self.session.add(farmer_profile1)
            
            # Create sample experts
            expert1 = User(
                name="Dr. Priya Sharma",
                email="priya.expert@example.com",
                phone="+91-98765-43211",
                hashed_password=get_password_hash("password123"),
                role=UserRole.EXPERT,
                status="approved",
                is_active=True
            )
            self.session.add(expert1)
            await self.session.flush()
            
            expert_profile1 = Expert(
                user_id=expert1.id,
                domain="Soil Science",
                experience="15+ years",
                description="PhD in Agricultural Sciences with expertise in soil testing and crop management",
                consultation_fee=1500.0,
                rating=4.8,
                total_consultations=45
            )
            self.session.add(expert_profile1)
            
            # Create sample dealers
            dealer1 = User(
                name="Agricultural Equipment Co.",
                email="contact@agri-equipment.com",
                phone="+91-98765-43212",
                hashed_password=get_password_hash("password123"),
                role=UserRole.DEALER,
                status="approved",
                is_active=True
            )
            self.session.add(dealer1)
            await self.session.flush()
            
            dealer_profile1 = Dealer(
                user_id=dealer1.id,
                company_name="Agricultural Equipment Co.",
                location="Pune, Maharashtra",
                specialization="Tractors & Machinery",
                description="Leading supplier of agricultural equipment and machinery",
                rating=4.6
            )
            self.session.add(dealer_profile1)
            
            await self.session.commit()
            print("✅ Sample data seeded successfully!")
            
        except Exception as e:
            await self.session.rollback()
            print(f"❌ Error seeding sample data: {str(e)}")

async def main():
    parser = argparse.ArgumentParser(description="Agriculture Platform Admin CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Create admin user command
    create_admin_parser = subparsers.add_parser("create-admin", help="Create an admin user")
    create_admin_parser.add_argument("--name", required=True, help="Admin name")
    create_admin_parser.add_argument("--email", required=True, help="Admin email")
    create_admin_parser.add_argument("--password", required=True, help="Admin password")
    create_admin_parser.add_argument("--phone", required=True, help="Admin phone")
    
    # List pending users command
    subparsers.add_parser("list-pending", help="List pending user approvals")
    
    # Approve user command
    approve_parser = subparsers.add_parser("approve", help="Approve a user")
    approve_parser.add_argument("--user-id", type=int, required=True, help="User ID to approve")
    
    # Reject user command
    reject_parser = subparsers.add_parser("reject", help="Reject a user")
    reject_parser.add_argument("--user-id", type=int, required=True, help="User ID to reject")
    reject_parser.add_argument("--reason", help="Reason for rejection")
    
    # Get stats command
    subparsers.add_parser("stats", help="Get platform statistics")
    
    # Seed data command
    subparsers.add_parser("seed", help="Seed sample data")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize admin CLI
    admin_cli = AdminCLI()
    await admin_cli.init_session()
    
    try:
        if args.command == "create-admin":
            await admin_cli.create_admin_user(
                args.name, args.email, args.password, args.phone
            )
        elif args.command == "list-pending":
            await admin_cli.list_pending_users()
        elif args.command == "approve":
            await admin_cli.approve_user(args.user_id)
        elif args.command == "reject":
            await admin_cli.reject_user(args.user_id, args.reason or "")
        elif args.command == "stats":
            await admin_cli.get_platform_stats()
        elif args.command == "seed":
            await admin_cli.seed_sample_data()
    
    finally:
        await admin_cli.close_session()

if __name__ == "__main__":
    asyncio.run(main()) 