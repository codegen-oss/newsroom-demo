from sqlalchemy.orm import Session
import logging
from datetime import datetime, timedelta

from app.core.security import get_password_hash
from app.models.user import User
from app.models.article import Article
from app.models.organization import Organization, OrganizationMember
from app.models.user_interest import UserInterest
from app.models.enums import SubscriptionTier, AccessTier, OrganizationRole

logger = logging.getLogger(__name__)

def create_initial_data(db: Session) -> None:
    # Check if data already exists
    user_count = db.query(User).count()
    if user_count > 0:
        logger.info("Database already contains data, skipping seed")
        return

    # Create users
    admin_user = User(
        email="admin@newsroom.com",
        password_hash=get_password_hash("admin123"),
        display_name="Admin User",
        subscription_tier=SubscriptionTier.ORGANIZATION,
    )
    db.add(admin_user)
    
    premium_user = User(
        email="premium@example.com",
        password_hash=get_password_hash("premium123"),
        display_name="Premium User",
        subscription_tier=SubscriptionTier.INDIVIDUAL,
    )
    db.add(premium_user)
    
    free_user = User(
        email="free@example.com",
        password_hash=get_password_hash("free123"),
        display_name="Free User",
        subscription_tier=SubscriptionTier.FREE,
    )
    db.add(free_user)
    
    db.commit()
    
    # Create user interests
    admin_interests = UserInterest(
        user_id=admin_user.id,
        categories=["politics", "technology", "business"],
        regions=["global", "north-america", "europe"],
        topics=["ai", "climate", "economy"],
    )
    db.add(admin_interests)
    
    premium_interests = UserInterest(
        user_id=premium_user.id,
        categories=["technology", "science"],
        regions=["asia", "north-america"],
        topics=["space", "ai", "medicine"],
    )
    db.add(premium_interests)
    
    free_interests = UserInterest(
        user_id=free_user.id,
        categories=["entertainment", "sports"],
        regions=["north-america"],
        topics=["movies", "celebrities"],
    )
    db.add(free_interests)
    
    db.commit()
    
    # Create organization
    org = Organization(
        name="News Corp",
        subscription={"plan": "enterprise", "seats": 50, "expires_at": (datetime.utcnow() + timedelta(days=365)).isoformat()},
    )
    db.add(org)
    db.commit()
    
    # Add organization members
    org_admin = OrganizationMember(
        organization_id=org.id,
        user_id=admin_user.id,
        role=OrganizationRole.ADMIN,
    )
    db.add(org_admin)
    
    org_member = OrganizationMember(
        organization_id=org.id,
        user_id=premium_user.id,
        role=OrganizationRole.MEMBER,
    )
    db.add(org_member)
    
    db.commit()
    
    # Create articles
    articles = [
        Article(
            title="The Future of AI in Journalism",
            content="Long form content about AI in journalism...",
            summary="AI is transforming how news is created and consumed.",
            source="Tech Today",
            source_url="https://techtoday.example.com/ai-journalism",
            author="Jane Smith",
            published_at=datetime.utcnow() - timedelta(days=2),
            categories=["technology", "media"],
            access_tier=AccessTier.FREE,
            featured_image="https://example.com/images/ai-journalism.jpg",
        ),
        Article(
            title="Global Markets Report Q2 2023",
            content="Detailed analysis of global markets in Q2 2023...",
            summary="Markets showed resilience despite economic challenges.",
            source="Financial Times",
            source_url="https://ft.example.com/markets-q2-2023",
            author="John Doe",
            published_at=datetime.utcnow() - timedelta(days=5),
            categories=["business", "economy"],
            access_tier=AccessTier.PREMIUM,
            featured_image="https://example.com/images/markets-q2.jpg",
        ),
        Article(
            title="Exclusive: Inside the New Trade Deal",
            content="Confidential details about the new international trade agreement...",
            summary="New trade deal set to reshape global commerce.",
            source="Business Insider",
            source_url="https://businessinsider.example.com/trade-deal",
            author="Robert Johnson",
            published_at=datetime.utcnow() - timedelta(days=1),
            categories=["politics", "business"],
            access_tier=AccessTier.ORGANIZATION,
            featured_image="https://example.com/images/trade-deal.jpg",
        ),
    ]
    
    for article in articles:
        db.add(article)
    
    db.commit()
    logger.info("Seed data created successfully")

