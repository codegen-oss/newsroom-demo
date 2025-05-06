import sys
import os
import uuid
from datetime import datetime, timedelta
import random

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from models import User, UserInterest, Article, Organization, OrganizationMember
from db import SessionLocal, engine
from utils.auth import get_password_hash

def create_mock_data():
    """Create mock data for testing"""
    db = SessionLocal()
    
    try:
        # Create users
        users = [
            User(
                id=str(uuid.uuid4()),
                email="admin@example.com",
                password_hash=get_password_hash("admin123"),
                display_name="Admin User",
                subscription_tier="organization",
                preferences={"theme": "dark", "notifications": True}
            ),
            User(
                id=str(uuid.uuid4()),
                email="premium@example.com",
                password_hash=get_password_hash("premium123"),
                display_name="Premium User",
                subscription_tier="individual",
                preferences={"theme": "light", "notifications": False}
            ),
            User(
                id=str(uuid.uuid4()),
                email="free@example.com",
                password_hash=get_password_hash("free123"),
                display_name="Free User",
                subscription_tier="free",
                preferences={"theme": "auto", "notifications": True}
            )
        ]
        
        db.add_all(users)
        db.commit()
        
        # Create user interests
        user_interests = [
            UserInterest(
                id=str(uuid.uuid4()),
                user_id=users[0].id,
                categories=["politics", "business", "technology"],
                regions=["US", "EU", "Asia"],
                topics=["AI", "Climate Change", "Economy"]
            ),
            UserInterest(
                id=str(uuid.uuid4()),
                user_id=users[1].id,
                categories=["technology", "science", "health"],
                regions=["US", "Canada"],
                topics=["Space", "Medicine", "Gadgets"]
            ),
            UserInterest(
                id=str(uuid.uuid4()),
                user_id=users[2].id,
                categories=["entertainment", "sports"],
                regions=["US"],
                topics=["Movies", "Football", "Basketball"]
            )
        ]
        
        db.add_all(user_interests)
        db.commit()
        
        # Create articles
        articles = []
        categories = ["politics", "business", "technology", "science", "health", "entertainment", "sports"]
        access_tiers = ["free", "premium", "organization"]
        
        for i in range(20):
            # Generate a random date within the last 30 days
            days_ago = random.randint(0, 30)
            published_date = datetime.now() - timedelta(days=days_ago)
            
            # Select random categories (1-3)
            num_categories = random.randint(1, 3)
            article_categories = random.sample(categories, num_categories)
            
            # Select random access tier
            access_tier = random.choice(access_tiers)
            
            articles.append(
                Article(
                    id=str(uuid.uuid4()),
                    title=f"Article {i+1}: {' '.join(article_categories)}",
                    content=f"This is the content of article {i+1}. It contains detailed information about {', '.join(article_categories)}.",
                    summary=f"Summary of article {i+1} about {', '.join(article_categories)}.",
                    source="News Source",
                    source_url=f"https://example.com/articles/{i+1}",
                    author=f"Author {(i % 5) + 1}",
                    published_at=published_date,
                    categories=article_categories,
                    access_tier=access_tier,
                    featured_image=f"https://example.com/images/{i+1}.jpg" if i % 3 == 0 else None
                )
            )
        
        db.add_all(articles)
        db.commit()
        
        # Create organizations
        organizations = [
            Organization(
                id=str(uuid.uuid4()),
                name="Tech Corp",
                subscription={"plan": "enterprise", "seats": 50, "features": ["premium_content", "api_access"]}
            ),
            Organization(
                id=str(uuid.uuid4()),
                name="News Media Inc",
                subscription={"plan": "standard", "seats": 20, "features": ["premium_content"]}
            )
        ]
        
        db.add_all(organizations)
        db.commit()
        
        # Create organization members
        org_members = [
            OrganizationMember(
                id=str(uuid.uuid4()),
                organization_id=organizations[0].id,
                user_id=users[0].id,
                role="admin"
            ),
            OrganizationMember(
                id=str(uuid.uuid4()),
                organization_id=organizations[0].id,
                user_id=users[1].id,
                role="member"
            ),
            OrganizationMember(
                id=str(uuid.uuid4()),
                organization_id=organizations[1].id,
                user_id=users[0].id,
                role="admin"
            )
        ]
        
        db.add_all(org_members)
        db.commit()
        
        print("Mock data created successfully!")
        
    except Exception as e:
        print(f"Error creating mock data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_mock_data()

