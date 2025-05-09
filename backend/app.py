import modal
from fastapi import FastAPI, Request, Response
import asyncio
from datetime import datetime, timedelta
import os
import json

# Define container image
image = modal.Image.debian_slim().pip_install(
    "fastapi", "uvicorn", "pydantic", 
    "motor", "sqlalchemy", "httpx", 
    "python-jose", "passlib", "python-multipart",
    "pymongo", "psycopg2-binary", "redis"
)

# Define Modal app
app = modal.App("news-room", image=image)

# Define secrets
app.mongo_url = modal.Secret.from_name("mongo-url")
app.postgres_url = modal.Secret.from_name("postgres-url")
app.redis_url = modal.Secret.from_name("redis-url")
app.jwt_secret = modal.Secret.from_name("jwt-secret")
app.news_api_key = modal.Secret.from_name("news-api-key")

# Import services
from services.news_fetcher import fetch_news_articles, categorize_articles, find_related_articles, store_articles
from services.recommendation import update_article_popularity, generate_trending_topics
from utils.database import mongo_db, redis_client

# Database connections
@app.function()
async def db_conn():
    """
    Initialize database connections.
    This is a utility function that can be called by other functions.
    """
    # MongoDB connection
    from motor.motor_asyncio import AsyncIOMotorClient
    mongo_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    return mongo_client.newsroom

# API endpoints as Modal web endpoints
@app.function(method=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
@modal.web_endpoint(method=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def api_handler(request: Request):
    """
    Main API handler that forwards requests to the FastAPI application.
    """
    # Import the FastAPI app
    from api.main import app as fastapi_app
    
    # Get the path and method
    path = request.url.path
    method = request.method
    
    # Get query parameters
    query_params = dict(request.query_params)
    
    # Get headers
    headers = dict(request.headers)
    
    # Get body if present
    body = await request.body()
    body = body.decode() if body else None
    
    # Create a mock request context for FastAPI
    scope = {
        "type": "http",
        "http_version": "1.1",
        "method": method,
        "path": path,
        "query_string": request.url.query.encode(),
        "headers": [(k.encode(), v.encode()) for k, v in headers.items()],
    }
    
    # Create a response object
    response = Response()
    
    # Call the FastAPI app
    await fastapi_app(scope, lambda: None, lambda: None)
    
    return response

# Background job for news fetching
@app.function()
@modal.schedule(cron="0 */6 * * *")  # Run every 6 hours
async def fetch_news():
    """
    Scheduled job to fetch news articles from external sources.
    """
    print(f"Starting news fetch job at {datetime.utcnow()}")
    
    # Get MongoDB connection
    mongo_client = await db_conn.call()
    
    # Fetch news articles
    articles = await fetch_news_articles()
    print(f"Fetched {len(articles)} articles")
    
    # Categorize articles
    categorized_articles = await categorize_articles(articles)
    print(f"Categorized {len(categorized_articles)} articles")
    
    # Find related articles
    articles_with_related = await find_related_articles(categorized_articles, mongo_client)
    print(f"Found related articles for {len(articles_with_related)} articles")
    
    # Store articles in database
    new_count = await store_articles(articles_with_related, mongo_client)
    print(f"Stored {new_count} new articles")
    
    return {"status": "success", "new_articles": new_count}

# Background job for updating article popularity
@app.function()
@modal.schedule(cron="0 0 * * *")  # Run daily at midnight
async def update_popularity():
    """
    Scheduled job to update article popularity scores.
    """
    print(f"Starting popularity update job at {datetime.utcnow()}")
    
    # Get MongoDB connection
    mongo_client = await db_conn.call()
    
    # Update article popularity
    await update_article_popularity(mongo_client)
    print("Updated article popularity scores")
    
    # Generate trending topics
    trending_topics = await generate_trending_topics(mongo_client)
    print(f"Generated {len(trending_topics)} trending topics")
    
    # Store trending topics in Redis for quick access
    redis_client.set(
        "trending_topics",
        json.dumps(trending_topics),
        ex=timedelta(days=1).total_seconds()
    )
    
    return {"status": "success", "trending_topics": len(trending_topics)}

if __name__ == "__main__":
    # For local development
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
