"""
Modal application for the News Room backend.
"""
import modal
import os
from datetime import datetime

# Define container image
image = modal.Image.debian_slim().pip_install(
    "fastapi", "uvicorn", "pydantic", 
    "motor", "sqlalchemy", "httpx", 
    "python-jose", "passlib", "python-multipart",
    "redis", "pymongo", "psycopg2-binary"
)

# Define Modal app
app = modal.App("news-room", image=image)

# Environment variables
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/newsroom")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "your-api-key")  # Change in production
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")  # Change in production

# Database connections
@app.function()
def db_conn():
    """Database connection function."""
    from sqlalchemy import create_engine
    from motor.motor_asyncio import AsyncIOMotorClient
    import redis.asyncio as redis
    
    # PostgreSQL
    engine = create_engine(POSTGRES_URL)
    
    # MongoDB
    mongo_client = AsyncIOMotorClient(MONGODB_URL)
    
    # Redis
    redis_client = redis.from_url(REDIS_URL)
    
    return {
        "postgres": engine,
        "mongodb": mongo_client,
        "redis": redis_client
    }

# API endpoints as Modal web endpoints
@app.function(method=["GET", "POST", "PUT", "DELETE"])
@modal.web_endpoint(method=["GET", "POST", "PUT", "DELETE"])
async def auth_endpoints(request):
    """Authentication endpoints."""
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    import httpx
    
    # Forward request to FastAPI app
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"http://localhost:8000/api/auth{request.url.path}",
            headers=dict(request.headers),
            content=await request.body()
        )
        
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )

@app.function(method=["GET", "POST", "PUT", "DELETE"])
@modal.web_endpoint(method=["GET", "POST", "PUT", "DELETE"])
async def users_endpoints(request):
    """User management endpoints."""
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    import httpx
    
    # Forward request to FastAPI app
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"http://localhost:8000/api/users{request.url.path}",
            headers=dict(request.headers),
            content=await request.body()
        )
        
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )

@app.function(method=["GET", "POST", "PUT", "DELETE"])
@modal.web_endpoint(method=["GET", "POST", "PUT", "DELETE"])
async def articles_endpoints(request):
    """Article endpoints."""
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    import httpx
    
    # Forward request to FastAPI app
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"http://localhost:8000/api/articles{request.url.path}",
            headers=dict(request.headers),
            content=await request.body()
        )
        
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )

@app.function(method=["GET", "POST", "PUT", "DELETE"])
@modal.web_endpoint(method=["GET", "POST", "PUT", "DELETE"])
async def organizations_endpoints(request):
    """Organization endpoints."""
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    import httpx
    
    # Forward request to FastAPI app
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"http://localhost:8000/api/organizations{request.url.path}",
            headers=dict(request.headers),
            content=await request.body()
        )
        
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )

@app.function(method=["GET", "POST", "PUT", "DELETE"])
@modal.web_endpoint(method=["GET", "POST", "PUT", "DELETE"])
async def subscriptions_endpoints(request):
    """Subscription endpoints."""
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    import httpx
    
    # Forward request to FastAPI app
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"http://localhost:8000/api/subscriptions{request.url.path}",
            headers=dict(request.headers),
            content=await request.body()
        )
        
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )

# Background jobs
@app.function()
@modal.scheduled(cron="0 */1 * * *")  # Run every hour
def fetch_news():
    """Scheduled job to fetch news articles."""
    import asyncio
    from services.news_api.processor import fetch_and_store_top_headlines
    
    # Run the async function
    result = asyncio.run(fetch_and_store_top_headlines())
    
    print(f"Fetched {result['total_fetched']} articles, stored {result['total_stored']} articles")
    
    return result

@app.function()
@modal.scheduled(cron="0 0 * * *")  # Run daily at midnight
def update_trending_scores():
    """Scheduled job to update trending scores for articles."""
    import asyncio
    from datetime import datetime, timedelta
    from db.mongodb.connection import articles_collection, user_history_collection
    
    async def update_scores():
        # Get articles from the last 7 days
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        # Get all articles
        articles = await articles_collection.find({
            "publishedAt": {"$gte": seven_days_ago.isoformat()}
        }).to_list(length=1000)
        
        for article in articles:
            article_id = article.get("article_id")
            
            # Count views
            views = await user_history_collection.count_documents({
                "action": "view_article",
                "article_id": article_id,
                "timestamp": {"$gte": seven_days_ago}
            })
            
            # Count likes
            likes = await user_history_collection.count_documents({
                "action": "like_article",
                "article_id": article_id,
                "timestamp": {"$gte": seven_days_ago}
            })
            
            # Count shares
            shares = await user_history_collection.count_documents({
                "action": "share_article",
                "article_id": article_id,
                "timestamp": {"$gte": seven_days_ago}
            })
            
            # Calculate trending score
            # Simple algorithm: views + (likes * 2) + (shares * 3)
            trending_score = views + (likes * 2) + (shares * 3)
            
            # Update article
            await articles_collection.update_one(
                {"article_id": article_id},
                {"$set": {"trending_score": trending_score}}
            )
        
        return len(articles)
    
    # Run the async function
    result = asyncio.run(update_scores())
    
    print(f"Updated trending scores for {result} articles")
    
    return {"articles_updated": result}

# Secrets management
@app.function()
def get_secrets():
    """Get secrets for the application."""
    return {
        "NEWS_API_KEY": NEWS_API_KEY,
        "JWT_SECRET_KEY": JWT_SECRET_KEY
    }

if __name__ == "__main__":
    # For local development
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)

