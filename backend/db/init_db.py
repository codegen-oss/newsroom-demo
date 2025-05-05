"""
Database initialization script for the News Room application.
"""
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

from postgres.connection import Base, engine
from postgres.models import User, Organization, Subscription
from mongodb.connection import client, database
from auth.password import get_password_hash

# Create tables in PostgreSQL
def init_postgres():
    """Initialize PostgreSQL database."""
    Base.metadata.create_all(bind=engine)
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.username == "admin").first()
        
        if not admin:
            # Create admin user
            admin_password = os.getenv("ADMIN_PASSWORD", "Admin123!")
            admin = User(
                email="admin@example.com",
                username="admin",
                hashed_password=get_password_hash(admin_password),
                full_name="Admin User",
                is_active=True,
                is_superuser=True
            )
            db.add(admin)
            db.commit()
            print("Admin user created")
    
    finally:
        db.close()

# Create collections in MongoDB
async def init_mongodb():
    """Initialize MongoDB database."""
    # Create collections if they don't exist
    collections = await database.list_collection_names()
    
    if "articles" not in collections:
        await database.create_collection("articles")
        # Create indexes
        await database.articles.create_index("article_id", unique=True)
        await database.articles.create_index("publishedAt")
        await database.articles.create_index("trending_score")
        await database.articles.create_index([("title", "text"), ("description", "text"), ("content", "text")])
        print("Articles collection created")
    
    if "user_history" not in collections:
        await database.create_collection("user_history")
        # Create indexes
        await database.user_history.create_index("user_id")
        await database.user_history.create_index("article_id")
        await database.user_history.create_index("timestamp")
        print("User history collection created")
    
    if "analytics" not in collections:
        await database.create_collection("analytics")
        # Create indexes
        await database.analytics.create_index("timestamp")
        print("Analytics collection created")

# Initialize all databases
def init_db():
    """Initialize all databases."""
    # Initialize PostgreSQL
    init_postgres()
    
    # Initialize MongoDB
    asyncio.run(init_mongodb())
    
    print("Database initialization complete")

if __name__ == "__main__":
    init_db()

