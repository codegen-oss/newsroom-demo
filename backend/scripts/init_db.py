import asyncio
import os
import json
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import redis

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://root:rootpassword@localhost:27017")
mongo_client = AsyncIOMotorClient(MONGODB_URL)
mongo_db = mongo_client.newsroom

# PostgreSQL Configuration
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost/newsroom")
engine = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis Configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL)


async def init_mongodb():
    """Initialize MongoDB collections and indexes."""
    print("Initializing MongoDB collections and indexes...")
    
    # Create indexes for users collection
    await mongo_db.users.create_index("email", unique=True)
    
    # Create indexes for articles collection
    await mongo_db.articles.create_index("title")
    await mongo_db.articles.create_index("categories")
    await mongo_db.articles.create_index("topics")
    await mongo_db.articles.create_index("access_tier")
    await mongo_db.articles.create_index("published_at")
    await mongo_db.articles.create_index("popularity")
    
    # Create indexes for user_history collection
    await mongo_db.user_history.create_index([("user_id", 1), ("article_id", 1)], unique=True)
    await mongo_db.user_history.create_index("read_at")
    
    # Create indexes for user_interests collection
    await mongo_db.user_interests.create_index("user_id", unique=True)
    
    # Create indexes for organizations collection
    await mongo_db.organizations.create_index("name")
    
    # Create indexes for organization_members collection
    await mongo_db.organization_members.create_index([("organization_id", 1), ("user_id", 1)], unique=True)
    
    print("MongoDB initialization complete.")


def init_postgresql():
    """Initialize PostgreSQL tables."""
    print("Initializing PostgreSQL tables...")
    
    # Import models (would be defined in SQLAlchemy models)
    # from models.sql.user import User
    # from models.sql.article import Article
    # etc.
    
    # Create tables
    # Base.metadata.create_all(bind=engine)
    
    print("PostgreSQL initialization complete.")


def init_redis():
    """Initialize Redis data."""
    print("Initializing Redis...")
    
    # Set some initial data
    redis_client.set("app_version", "0.1.0")
    redis_client.set("app_start_time", datetime.utcnow().isoformat())
    
    # Set expiration for session data
    redis_client.config_set("maxmemory-policy", "allkeys-lru")
    
    print("Redis initialization complete.")


async def create_sample_data():
    """Create sample data for development."""
    print("Creating sample data...")
    
    # Check if data already exists
    users_count = await mongo_db.users.count_documents({})
    if users_count > 0:
        print("Sample data already exists. Skipping...")
        return
    
    # Create sample users
    sample_users = [
        {
            "email": "user@example.com",
            "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            "display_name": "Demo User",
            "profile_image": None,
            "subscription_tier": "free",
            "subscription_status": "active",
            "subscription_expiry": None,
            "created_at": datetime.utcnow(),
            "last_login": None,
            "preferences": {
                "theme": "light",
                "notifications": True,
                "email_frequency": "daily"
            }
        },
        {
            "email": "premium@example.com",
            "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            "display_name": "Premium User",
            "profile_image": None,
            "subscription_tier": "individual",
            "subscription_status": "active",
            "subscription_expiry": datetime.utcnow() + timedelta(days=30),
            "created_at": datetime.utcnow(),
            "last_login": None,
            "preferences": {
                "theme": "dark",
                "notifications": True,
                "email_frequency": "daily"
            }
        },
        {
            "email": "org@example.com",
            "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            "display_name": "Organization Admin",
            "profile_image": None,
            "subscription_tier": "organization",
            "subscription_status": "active",
            "subscription_expiry": datetime.utcnow() + timedelta(days=30),
            "created_at": datetime.utcnow(),
            "last_login": None,
            "preferences": {
                "theme": "dark",
                "notifications": True,
                "email_frequency": "weekly"
            }
        }
    ]
    
    # Insert users
    user_ids = []
    for user in sample_users:
        result = await mongo_db.users.insert_one(user)
        user_ids.append(str(result.inserted_id))
    
    # Create sample articles
    sample_articles = [
        {
            "title": "The Future of AI in Business",
            "subtitle": "How artificial intelligence is transforming industries",
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            "summary": "AI is revolutionizing how businesses operate across all sectors.",
            "source": "Tech Insights",
            "source_url": "https://example.com/tech-insights/ai-business",
            "author": "Jane Smith",
            "published_at": datetime.utcnow() - timedelta(days=2),
            "categories": ["Technology", "Business"],
            "regions": ["Global"],
            "topics": ["AI", "Tech"],
            "read_time_minutes": 8,
            "access_tier": "free",
            "featured_image": "https://example.com/images/ai-business.jpg",
            "sentiment": "positive",
            "popularity": 120,
            "related_articles": []
        },
        {
            "title": "Global Markets React to Economic Policy Changes",
            "subtitle": "New policies trigger significant market movements",
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            "summary": "Markets worldwide are responding to major policy shifts.",
            "source": "Financial Times",
            "source_url": "https://example.com/financial-times/markets",
            "author": "John Doe",
            "published_at": datetime.utcnow() - timedelta(days=1),
            "categories": ["Economy", "Finance"],
            "regions": ["North America", "Europe"],
            "topics": ["Finance", "Politics"],
            "read_time_minutes": 6,
            "access_tier": "premium",
            "featured_image": "https://example.com/images/markets.jpg",
            "sentiment": "neutral",
            "popularity": 85,
            "related_articles": []
        },
        {
            "title": "Exclusive: Inside the New Tech Revolution",
            "subtitle": "A deep dive into emerging technologies",
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            "summary": "Exclusive report on the next wave of technological innovation.",
            "source": "Tech Insider",
            "source_url": "https://example.com/tech-insider/revolution",
            "author": "Alex Johnson",
            "published_at": datetime.utcnow() - timedelta(hours=12),
            "categories": ["Technology"],
            "regions": ["Global"],
            "topics": ["Tech", "Innovation"],
            "read_time_minutes": 12,
            "access_tier": "organization",
            "featured_image": "https://example.com/images/tech-revolution.jpg",
            "sentiment": "positive",
            "popularity": 50,
            "related_articles": []
        }
    ]
    
    # Insert articles
    article_ids = []
    for article in sample_articles:
        result = await mongo_db.articles.insert_one(article)
        article_ids.append(str(result.inserted_id))
    
    # Update related articles
    await mongo_db.articles.update_one(
        {"_id": article_ids[0]},
        {"$set": {"related_articles": [article_ids[1]]}}
    )
    await mongo_db.articles.update_one(
        {"_id": article_ids[1]},
        {"$set": {"related_articles": [article_ids[0], article_ids[2]]}}
    )
    await mongo_db.articles.update_one(
        {"_id": article_ids[2]},
        {"$set": {"related_articles": [article_ids[1]]}}
    )
    
    # Create sample organization
    org_data = {
        "name": "Demo Organization",
        "logo": None,
        "industry": "Technology",
        "size": "medium",
        "billing_email": "billing@example.com",
        "billing_address": {},
        "subscription": {
            "plan": "organization",
            "seats": 10,
            "used_seats": 1,
            "start_date": datetime.utcnow() - timedelta(days=5),
            "renewal_date": datetime.utcnow() + timedelta(days=25),
            "payment_method": {}
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert organization
    org_result = await mongo_db.organizations.insert_one(org_data)
    org_id = str(org_result.inserted_id)
    
    # Create organization member
    member_data = {
        "organization_id": org_id,
        "user_id": user_ids[2],  # Organization admin
        "role": "admin",
        "joined_at": datetime.utcnow(),
        "invited_by": user_ids[2]
    }
    await mongo_db.organization_members.insert_one(member_data)
    
    # Create user interests
    interests_data = {
        "user_id": user_ids[0],
        "categories": ["Technology", "Science"],
        "regions": ["North America", "Europe"],
        "topics": ["AI", "Tech", "Climate"],
        "sources": ["Tech Insights"],
        "followed_authors": ["Jane Smith"]
    }
    await mongo_db.user_interests.insert_one(interests_data)
    
    # Create user history
    history_data = {
        "user_id": user_ids[0],
        "article_id": article_ids[0],
        "read_at": datetime.utcnow() - timedelta(hours=6),
        "time_spent": 300,  # seconds
        "completed": True,
        "reactions": ["like"],
        "saved": True
    }
    await mongo_db.user_history.insert_one(history_data)
    
    print("Sample data created successfully.")


async def main():
    """Main initialization function."""
    print("Starting database initialization...")
    
    # Initialize MongoDB
    await init_mongodb()
    
    # Initialize PostgreSQL
    init_postgresql()
    
    # Initialize Redis
    init_redis()
    
    # Create sample data
    await create_sample_data()
    
    print("Database initialization complete.")


if __name__ == "__main__":
    asyncio.run(main())

