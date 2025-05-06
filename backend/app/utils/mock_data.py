from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.models.models import Article, Category, User
from app.utils.access_control import create_access_token

def create_mock_data(db: Session):
    """
    Create mock data for testing the application
    """
    # Check if data already exists
    if db.query(Category).count() > 0:
        return "Mock data already exists"
    
    # Create categories
    categories = [
        Category(name="Politics", description="Political news and analysis"),
        Category(name="Technology", description="Latest tech news and reviews"),
        Category(name="Business", description="Business and financial news"),
        Category(name="Health", description="Health and wellness information"),
        Category(name="Entertainment", description="Entertainment and celebrity news"),
        Category(name="Sports", description="Sports news and analysis"),
        Category(name="Science", description="Scientific discoveries and research")
    ]
    
    db.add_all(categories)
    db.commit()
    
    # Create users with different subscription tiers
    users = [
        User(
            username="free_user",
            email="free@example.com",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            subscription_tier=0,
            is_active=True
        ),
        User(
            username="basic_user",
            email="basic@example.com",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            subscription_tier=1,
            is_active=True
        ),
        User(
            username="premium_user",
            email="premium@example.com",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            subscription_tier=2,
            is_active=True
        ),
        User(
            username="admin_user",
            email="admin@example.com",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            subscription_tier=2,
            is_active=True
        )
    ]
    
    db.add_all(users)
    db.commit()
    
    # Create articles with different access tiers
    articles = []
    authors = ["John Smith", "Jane Doe", "Michael Johnson", "Sarah Williams", "Robert Brown"]
    
    # Helper function to generate article content
    def generate_content(length=5):
        paragraphs = []
        for _ in range(length):
            words = random.randint(50, 100)
            paragraph = " ".join(["lorem ipsum"] * words)
            paragraphs.append(paragraph)
        return "\n\n".join(paragraphs)
    
    # Create 50 articles with varying properties
    for i in range(1, 51):
        # Determine category
        category_id = random.randint(1, len(categories))
        
        # Determine access tier (more free articles than premium)
        access_tier_weights = [0.6, 0.3, 0.1]  # 60% free, 30% basic, 10% premium
        access_tier = random.choices([0, 1, 2], weights=access_tier_weights)[0]
        
        # Create published date (between 30 days ago and now)
        days_ago = random.randint(0, 30)
        published_date = datetime.utcnow() - timedelta(days=days_ago)
        
        # Create article
        article = Article(
            title=f"Article {i}: {'Premium' if access_tier == 2 else 'Basic' if access_tier == 1 else 'Free'} Content",
            content=generate_content(),
            summary=f"This is a {'premium' if access_tier == 2 else 'basic' if access_tier == 1 else 'free'} article about {categories[category_id-1].name.lower()}.",
            category_id=category_id,
            author=random.choice(authors),
            published_date=published_date,
            updated_date=published_date,
            access_tier=access_tier,
            is_published=True
        )
        
        articles.append(article)
    
    db.add_all(articles)
    db.commit()
    
    return "Mock data created successfully"

