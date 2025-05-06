import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, Article, Organization, OrganizationMember, UserInterest
from app.auth.utils import get_password_hash

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).count() > 0:
            print("Database already has data, skipping seed.")
            return
        
        # Create users
        users = [
            {
                "email": "free@example.com",
                "password": "password123",
                "display_name": "Free User",
                "subscription_tier": "free",
                "preferences": {"theme": "light", "notifications": True}
            },
            {
                "email": "premium@example.com",
                "password": "password123",
                "display_name": "Premium User",
                "subscription_tier": "individual",
                "preferences": {"theme": "dark", "notifications": True}
            },
            {
                "email": "org@example.com",
                "password": "password123",
                "display_name": "Organization User",
                "subscription_tier": "organization",
                "preferences": {"theme": "auto", "notifications": False}
            }
        ]
        
        db_users = []
        for user_data in users:
            db_user = User(
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                display_name=user_data["display_name"],
                subscription_tier=user_data["subscription_tier"],
                preferences=user_data["preferences"]
            )
            db.add(db_user)
            db.flush()  # Flush to get the ID
            db_users.append(db_user)
        
        # Create user interests
        interests = [
            {
                "user_id": db_users[0].id,
                "categories": ["politics", "technology"],
                "regions": ["US", "Europe"],
                "topics": ["elections", "startups"]
            },
            {
                "user_id": db_users[1].id,
                "categories": ["business", "science"],
                "regions": ["Asia", "Global"],
                "topics": ["markets", "space"]
            },
            {
                "user_id": db_users[2].id,
                "categories": ["economy", "technology", "geopolitics"],
                "regions": ["Global"],
                "topics": ["trade", "AI", "diplomacy"]
            }
        ]
        
        for interest_data in interests:
            db_interest = UserInterest(
                user_id=interest_data["user_id"],
                categories=interest_data["categories"],
                regions=interest_data["regions"],
                topics=interest_data["topics"]
            )
            db.add(db_interest)
        
        # Create articles
        articles = [
            {
                "title": "Global Markets Reach New Heights",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.",
                "summary": "Markets continue to surge despite economic uncertainties.",
                "source": "Financial Times",
                "source_url": "https://example.com/markets",
                "author": "Jane Smith",
                "published_at": datetime.utcnow() - timedelta(days=1),
                "categories": ["business", "economy"],
                "access_tier": "free",
                "featured_image": "https://example.com/images/markets.jpg"
            },
            {
                "title": "New AI Breakthrough Changes Everything",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.",
                "summary": "Researchers develop AI system capable of human-like reasoning.",
                "source": "Tech Insider",
                "source_url": "https://example.com/ai-breakthrough",
                "author": "John Doe",
                "published_at": datetime.utcnow() - timedelta(days=2),
                "categories": ["technology", "science"],
                "access_tier": "premium",
                "featured_image": "https://example.com/images/ai.jpg"
            },
            {
                "title": "Diplomatic Tensions Rise in South China Sea",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.",
                "summary": "Naval exercises increase tensions between major powers.",
                "source": "Global Affairs",
                "source_url": "https://example.com/south-china-sea",
                "author": "Robert Chen",
                "published_at": datetime.utcnow() - timedelta(days=3),
                "categories": ["politics", "geopolitics"],
                "access_tier": "organization",
                "featured_image": "https://example.com/images/navy.jpg"
            }
        ]
        
        for article_data in articles:
            db_article = Article(**article_data)
            db.add(db_article)
        
        # Create organization
        db_organization = Organization(
            name="Global News Corp",
            subscription={"plan": "enterprise", "seats": 50, "features": ["all_access", "api", "custom_branding"]}
        )
        db.add(db_organization)
        db.flush()  # Flush to get the ID
        
        # Create organization members
        db_member = OrganizationMember(
            organization_id=db_organization.id,
            user_id=db_users[2].id,
            role="admin"
        )
        db.add(db_member)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

