"""
Utility script to seed the database with sample data.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from database import engine, SessionLocal, Base
from database.schema import User, Article, SubscriptionTier, AccessTier
from backend.routers.auth import get_password_hash

def seed_database():
    """Seed the database with sample data."""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Check if database is already seeded
        if db.query(User).first() is not None:
            print("Database already contains data. Skipping seed operation.")
            return
        
        # Seed users
        print("Seeding users...")
        users = [
            User(
                email="admin@example.com",
                password_hash=get_password_hash("admin123"),
                display_name="Admin User",
                subscription_tier=SubscriptionTier.ORGANIZATION,
                preferences={"theme": "dark", "notifications": True}
            ),
            User(
                email="premium@example.com",
                password_hash=get_password_hash("premium123"),
                display_name="Premium User",
                subscription_tier=SubscriptionTier.INDIVIDUAL,
                preferences={"theme": "light", "notifications": True}
            ),
            User(
                email="free@example.com",
                password_hash=get_password_hash("free123"),
                display_name="Free User",
                subscription_tier=SubscriptionTier.FREE,
                preferences={"theme": "auto", "notifications": False}
            )
        ]
        db.add_all(users)
        db.commit()
        
        # Seed articles
        print("Seeding articles...")
        articles_file = Path(__file__).parent.parent / "data" / "sample_articles.json"
        with open(articles_file, "r") as f:
            articles_data = json.load(f)
        
        articles = []
        for article_data in articles_data:
            # Convert string access_tier to enum
            access_tier_str = article_data.pop("access_tier", "free").upper()
            access_tier = getattr(AccessTier, access_tier_str)
            
            # Convert published_at string to datetime
            published_at_str = article_data.pop("published_at", None)
            published_at = datetime.fromisoformat(published_at_str.replace("Z", "+00:00")) if published_at_str else datetime.utcnow()
            
            articles.append(
                Article(
                    **article_data,
                    access_tier=access_tier,
                    published_at=published_at
                )
            )
        
        db.add_all(articles)
        db.commit()
        
        print("Database seeded successfully!")
    
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

