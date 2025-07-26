#!/usr/bin/env python3
"""
Agriculture Platform Setup Script
Complete setup for the full-stack application
"""

import os
import sys
import subprocess
import asyncio
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {command}")
        print(f"Error: {e.stderr}")
        return None

def setup_backend():
    """Setup the Python backend"""
    print("🔧 Setting up Python Backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    # Create virtual environment
    print("📦 Creating virtual environment...")
    if not run_command("python -m venv venv", cwd=backend_dir):
        return False
    
    # Activate virtual environment and install dependencies
    print("📦 Installing Python dependencies...")
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
    else:  # Unix/Linux/Mac
        pip_cmd = "venv/bin/pip"
    
    if not run_command(f"{pip_cmd} install -r requirements.txt", cwd=backend_dir):
        return False
    
    print("✅ Backend setup completed!")
    return True

def setup_frontend():
    """Setup the React frontend"""
    print("🔧 Setting up React Frontend...")
    
    # Install Node.js dependencies
    print("📦 Installing Node.js dependencies...")
    if not run_command("npm install"):
        return False
    
    print("✅ Frontend setup completed!")
    return True

def create_admin_user():
    """Create an admin user"""
    print("👤 Creating admin user...")
    
    backend_dir = Path("backend")
    if os.name == 'nt':  # Windows
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        python_cmd = "venv/bin/python"
    
    # Create admin user
    admin_cmd = f"{python_cmd} admin_script.py create-admin --name 'Admin User' --email 'admin@slamrobotics.com' --password 'admin123' --phone '+91-98765-43210'"
    
    if not run_command(admin_cmd, cwd=backend_dir):
        print("⚠️  Admin user creation failed. You can create it manually later.")
        return False
    
    print("✅ Admin user created successfully!")
    return True

def seed_sample_data():
    """Seed the database with sample data"""
    print("🌱 Seeding sample data...")
    
    backend_dir = Path("backend")
    if os.name == 'nt':  # Windows
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        python_cmd = "venv/bin/python"
    
    seed_cmd = f"{python_cmd} admin_script.py seed"
    
    if not run_command(seed_cmd, cwd=backend_dir):
        print("⚠️  Sample data seeding failed. You can seed it manually later.")
        return False
    
    print("✅ Sample data seeded successfully!")
    return True

def create_env_files():
    """Create environment files"""
    print("📝 Creating environment files...")
    
    # Backend .env
    backend_env_content = """# Database Configuration
DATABASE_URL=sqlite:///./agri_platform.db

# JWT Configuration
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:3001"]

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=slam.robots@gmail.com
EMAIL_PASSWORD=your-app-password
"""
    
    with open("backend/.env", "w") as f:
        f.write(backend_env_content)
    
    # Frontend .env.local
    frontend_env_content = """# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
"""
    
    with open(".env.local", "w") as f:
        f.write(frontend_env_content)
    
    print("✅ Environment files created!")
    return True

def print_startup_instructions():
    """Print startup instructions"""
    print("\n" + "="*60)
    print("🚀 AGRICULTURE PLATFORM SETUP COMPLETED!")
    print("="*60)
    
    print("\n📋 Next Steps:")
    print("1. Start the backend server:")
    print("   cd backend")
    print("   python main.py")
    print("   # Or on Windows: venv\\Scripts\\python main.py")
    
    print("\n2. Start the frontend server:")
    print("   npm run dev")
    
    print("\n3. Access the application:")
    print("   Frontend: http://localhost:3000")
    print("   Backend API: http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("   Admin Panel: http://localhost:3000/admin")
    
    print("\n4. Admin Access:")
    print("   Email: admin@slamrobotics.com")
    print("   Password: admin123")
    
    print("\n5. Test the platform:")
    print("   - Register as a farmer/expert/dealer")
    print("   - Login as admin to approve users")
    print("   - Explore the product page")
    
    print("\n🔧 Additional Commands:")
    print("   # Create admin user manually:")
    print("   cd backend && python admin_script.py create-admin --name 'Admin' --email 'admin@example.com' --password 'password' --phone '+91-1234567890'")
    
    print("   # List pending users:")
    print("   cd backend && python admin_script.py list-pending")
    
    print("   # Approve user:")
    print("   cd backend && python admin_script.py approve --user-id 1")
    
    print("   # Get platform stats:")
    print("   cd backend && python admin_script.py stats")
    
    print("\n" + "="*60)

def main():
    """Main setup function"""
    print("🚀 Agriculture Platform Full-Stack Setup")
    print("="*50)
    
    # Check if we're in the right directory
    if not Path("package.json").exists():
        print("❌ Please run this script from the project root directory!")
        return
    
    # Setup steps
    steps = [
        ("Creating environment files", create_env_files),
        ("Setting up backend", setup_backend),
        ("Setting up frontend", setup_frontend),
        ("Creating admin user", create_admin_user),
        ("Seeding sample data", seed_sample_data),
    ]
    
    for step_name, step_func in steps:
        print(f"\n{step_name}...")
        if not step_func():
            print(f"❌ {step_name} failed!")
            return
    
    print_startup_instructions()

if __name__ == "__main__":
    main() 