from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from config import settings
import os

# Database URL
DATABASE_URL = settings.database_url

# Create async engine for PostgreSQL
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Create sync engine for migrations
sync_engine = create_engine(
    DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"),
    echo=settings.debug,
)

# Session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Dependency to get database session
async def get_session() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

# Create all tables
def create_db_and_tables():
    SQLModel.metadata.create_all(sync_engine)

# Database initialization
async def init_db():
    """Initialize database with tables"""
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(SQLModel.metadata.create_all)
    
    print("✅ Database tables created successfully!")

# Database cleanup
async def close_db():
    """Close database connections"""
    await engine.dispose()
    print("🔌 Database connections closed!")

# Get database session for sync operations
def get_sync_session():
    with Session(sync_engine) as session:
        return session 