import os
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import redis

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
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

# PostgreSQL Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB Collections
users_collection = mongo_db.users
articles_collection = mongo_db.articles
user_interests_collection = mongo_db.user_interests
user_history_collection = mongo_db.user_history
organizations_collection = mongo_db.organizations
organization_members_collection = mongo_db.organization_members

