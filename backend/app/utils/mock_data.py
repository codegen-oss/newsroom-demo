from sqlalchemy.orm import Session
import uuid

from app.models.models import User, Organization, OrganizationMember, Article, OrganizationRole, SubscriptionTier
from app.core.security import get_password_hash

def create_mock_data(db: Session):
    """
    Create mock data for testing the application
    """
    # Create users
    users = [
        {
            "id": str(uuid.uuid4()),
            "email": "admin@example.com",
            "username": "admin",
            "full_name": "Admin User",
            "hashed_password": get_password_hash("password123"),
            "is_superuser": True
        },
        {
            "id": str(uuid.uuid4()),
            "email": "john@example.com",
            "username": "john",
            "full_name": "John Doe",
            "hashed_password": get_password_hash("password123")
        },
        {
            "id": str(uuid.uuid4()),
            "email": "jane@example.com",
            "username": "jane",
            "full_name": "Jane Smith",
            "hashed_password": get_password_hash("password123")
        },
        {
            "id": str(uuid.uuid4()),
            "email": "bob@example.com",
            "username": "bob",
            "full_name": "Bob Johnson",
            "hashed_password": get_password_hash("password123")
        }
    ]
    
    db_users = []
    for user_data in users:
        db_user = User(**user_data)
        db.add(db_user)
        db_users.append(db_user)
    
    db.flush()
    
    # Create organizations
    organizations = [
        {
            "id": str(uuid.uuid4()),
            "name": "Tech News Daily",
            "description": "Latest technology news and reviews",
            "website": "https://technewsdaily.example.com",
            "subscription_tier": SubscriptionTier.PREMIUM
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sports Central",
            "description": "All about sports and athletics",
            "website": "https://sportscentral.example.com",
            "subscription_tier": SubscriptionTier.BASIC
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Finance Today",
            "description": "Business and financial news",
            "website": "https://financetoday.example.com",
            "subscription_tier": SubscriptionTier.ENTERPRISE
        }
    ]
    
    db_organizations = []
    for org_data in organizations:
        db_org = Organization(**org_data)
        db.add(db_org)
        db_organizations.append(db_org)
    
    db.flush()
    
    # Create organization members
    org_members = [
        # Tech News Daily
        {
            "user_id": db_users[0].id,  # Admin
            "organization_id": db_organizations[0].id,
            "role": OrganizationRole.OWNER
        },
        {
            "user_id": db_users[1].id,  # John
            "organization_id": db_organizations[0].id,
            "role": OrganizationRole.ADMIN
        },
        {
            "user_id": db_users[2].id,  # Jane
            "organization_id": db_organizations[0].id,
            "role": OrganizationRole.EDITOR
        },
        
        # Sports Central
        {
            "user_id": db_users[1].id,  # John
            "organization_id": db_organizations[1].id,
            "role": OrganizationRole.OWNER
        },
        {
            "user_id": db_users[3].id,  # Bob
            "organization_id": db_organizations[1].id,
            "role": OrganizationRole.EDITOR
        },
        
        # Finance Today
        {
            "user_id": db_users[2].id,  # Jane
            "organization_id": db_organizations[2].id,
            "role": OrganizationRole.OWNER
        },
        {
            "user_id": db_users[3].id,  # Bob
            "organization_id": db_organizations[2].id,
            "role": OrganizationRole.MEMBER
        }
    ]
    
    for member_data in org_members:
        db_member = OrganizationMember(**member_data)
        db.add(db_member)
    
    db.flush()
    
    # Create articles
    articles = [
        # Tech News Daily articles
        {
            "title": "The Future of AI",
            "content": "Artificial Intelligence is transforming industries across the globe...",
            "author_id": db_users[1].id,  # John
            "organization_id": db_organizations[0].id,
            "is_published": True
        },
        {
            "title": "5G Technology Explained",
            "content": "5G is the fifth generation of cellular network technology...",
            "author_id": db_users[2].id,  # Jane
            "organization_id": db_organizations[0].id,
            "is_published": True
        },
        
        # Sports Central articles
        {
            "title": "World Cup Highlights",
            "content": "The World Cup delivered some unforgettable moments...",
            "author_id": db_users[1].id,  # John
            "organization_id": db_organizations[1].id,
            "is_published": True
        },
        {
            "title": "Olympic Training Techniques",
            "content": "Olympic athletes use these specialized training methods...",
            "author_id": db_users[3].id,  # Bob
            "organization_id": db_organizations[1].id,
            "is_published": False
        },
        
        # Finance Today articles
        {
            "title": "Stock Market Analysis",
            "content": "This week's stock market showed significant volatility...",
            "author_id": db_users[2].id,  # Jane
            "organization_id": db_organizations[2].id,
            "is_published": True
        }
    ]
    
    for article_data in articles:
        db_article = Article(**article_data)
        db.add(db_article)
    
    # Commit all changes
    db.commit()
    
    return {
        "users": len(users),
        "organizations": len(organizations),
        "members": len(org_members),
        "articles": len(articles)
    }

