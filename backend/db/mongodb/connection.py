"""
MongoDB connection module for the News Room application.
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Get MongoDB URL from environment variable or use default
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "newsroom")

# Create MongoDB client
client = AsyncIOMotorClient(MONGODB_URL)
database = client[MONGODB_DB]

# Collections
articles_collection = database.articles
user_history_collection = database.user_history
analytics_collection = database.analytics

