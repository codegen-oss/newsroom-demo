import json
import os
from datetime import datetime, timedelta
import uuid
from ..database.database import SessionLocal
from ..models.user import User
from ..models.article import Article
from ..models.organization import Organization
from ..models.organization_member import OrganizationMember
from ..models.user_interest import UserInterest
from ..auth.auth import get_password_hash

def seed_database():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(User).count() > 0:
        print("Database already seeded")
        db.close()
        return
    
    # Create users
    users = [
        {
            "id": str(uuid.uuid4()),
            "email": "user@example.com",
            "password_hash": get_password_hash("password123"),
            "display_name": "Regular User",
            "subscription_tier": "free",
            "created_at": datetime.utcnow(),
            "preferences": {}
        },
        {
            "id": str(uuid.uuid4()),
            "email": "premium@example.com",
            "password_hash": get_password_hash("password123"),
            "display_name": "Premium User",
            "subscription_tier": "individual",
            "created_at": datetime.utcnow(),
            "preferences": {"theme": "dark"}
        },
        {
            "id": str(uuid.uuid4()),
            "email": "org@example.com",
            "password_hash": get_password_hash("password123"),
            "display_name": "Organization User",
            "subscription_tier": "organization",
            "created_at": datetime.utcnow(),
            "preferences": {"notifications": True}
        }
    ]
    
    for user_data in users:
        user = User(**user_data)
        db.add(user)
    
    db.commit()
    
    # Create user interests
    for user in db.query(User).all():
        if user.email == "user@example.com":
            interests = UserInterest(
                id=str(uuid.uuid4()),
                user_id=user.id,
                categories=["politics", "technology"],
                regions=["North America", "Europe"],
                topics=["elections", "startups"]
            )
        elif user.email == "premium@example.com":
            interests = UserInterest(
                id=str(uuid.uuid4()),
                user_id=user.id,
                categories=["economy", "technology", "science"],
                regions=["Asia", "Europe"],
                topics=["markets", "AI", "space"]
            )
        else:
            interests = UserInterest(
                id=str(uuid.uuid4()),
                user_id=user.id,
                categories=["politics", "economy", "technology", "science"],
                regions=["Global"],
                topics=["diplomacy", "trade", "innovation"]
            )
        
        db.add(interests)
    
    db.commit()
    
    # Create articles
    articles = [
        {
            "id": str(uuid.uuid4()),
            "title": "Global Markets Update",
            "content": "Detailed analysis of global market trends...",
            "summary": "Markets showed strong performance across all sectors.",
            "source": "Financial Times",
            "source_url": "https://ft.com/markets",
            "author": "Jane Smith",
            "published_at": datetime.utcnow() - timedelta(days=1),
            "categories": ["economy", "markets"],
            "access_tier": "free",
            "featured_image": "https://example.com/images/markets.jpg"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "New AI Breakthrough",
            "content": "Researchers have developed a new AI model that...",
            "summary": "Revolutionary AI model shows human-like reasoning capabilities.",
            "source": "Tech Review",
            "source_url": "https://techreview.com/ai",
            "author": "John Doe",
            "published_at": datetime.utcnow() - timedelta(days=2),
            "categories": ["technology", "AI"],
            "access_tier": "premium",
            "featured_image": "https://example.com/images/ai.jpg"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Diplomatic Relations Shift",
            "content": "A comprehensive analysis of changing diplomatic relations...",
            "summary": "Major powers announce new diplomatic initiatives.",
            "source": "Global Affairs",
            "source_url": "https://globalaffairs.org/diplomacy",
            "author": "Robert Johnson",
            "published_at": datetime.utcnow() - timedelta(days=3),
            "categories": ["politics", "diplomacy"],
            "access_tier": "organization",
            "featured_image": "https://example.com/images/diplomacy.jpg"
        }
    ]
    
    for article_data in articles:
        article = Article(**article_data)
        db.add(article)
    
    db.commit()
    
    # Create organization
    org = Organization(
        id=str(uuid.uuid4()),
        name="Global News Corp",
        subscription={"plan": "enterprise", "seats": 50},
        created_at=datetime.utcnow()
    )
    
    db.add(org)
    db.commit()
    
    # Add organization member
    org_user = db.query(User).filter(User.email == "org@example.com").first()
    member = OrganizationMember(
        id=str(uuid.uuid4()),
        organization_id=org.id,
        user_id=org_user.id,
        role="admin"
    )
    
    db.add(member)
    db.commit()
    
    print("Database seeded successfully")
    db.close()

if __name__ == "__main__":
    seed_database()

