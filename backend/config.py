from pydantic_settings import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # Database settings
    database_url: str = "sqlite+aiosqlite:////app/agri_platform.db"
    database_name: str = "agri_platform"
    
    # Security settings
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # CORS settings
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://klipsmart.shop",
        "https://www.klipsmart.shop",
        "https://api.klipsmart.shop",
        "https://*.run.app",
        "http://api.klipsmart.shop",  # Add HTTP version for fallback
        "*"  # Allow all origins for development
    ]
    
    # Email settings
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = "slam.robots@gmail.com"
    smtp_password: Optional[str] = None
    
    # Razorpay settings (for payments)
    razorpay_key_id: Optional[str] = None
    razorpay_key_secret: Optional[str] = None
    
    # Upload settings
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    # Logging settings
    log_level: str = "info"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings() 