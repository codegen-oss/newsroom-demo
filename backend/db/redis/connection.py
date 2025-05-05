"""
Redis connection module for the News Room application.
"""
import os
import redis.asyncio as redis

# Get Redis URL from environment variable or use default
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Create Redis client
redis_client = redis.from_url(REDIS_URL)

# Helper functions for common Redis operations
async def get_cache(key):
    """Get a value from Redis cache."""
    return await redis_client.get(key)

async def set_cache(key, value, expiration=3600):
    """Set a value in Redis cache with expiration in seconds."""
    await redis_client.set(key, value, ex=expiration)

async def delete_cache(key):
    """Delete a value from Redis cache."""
    await redis_client.delete(key)

async def get_session(session_id):
    """Get a session from Redis."""
    session_key = f"session:{session_id}"
    return await redis_client.get(session_key)

async def set_session(session_id, session_data, expiration=86400):
    """Set a session in Redis with expiration in seconds (default 24 hours)."""
    session_key = f"session:{session_id}"
    await redis_client.set(session_key, session_data, ex=expiration)

