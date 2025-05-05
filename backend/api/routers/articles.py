"""
Articles router for the News Room application.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path, Body
from typing import List, Optional, Dict, Any
from datetime import datetime

from ...db.mongodb.connection import articles_collection, user_history_collection
from ...auth.jwt import get_current_active_user
from ...db.postgres.models import User
from ...services.news_api.client import fetch_top_headlines, search_news
from ...services.news_api.processor import search_and_store_news
from ...db.redis.connection import get_cache, set_cache

router = APIRouter()

# Get articles with filtering and pagination
@router.get("/")
async def get_articles(
    category: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    # Build query
    query = {}
    
    if category:
        query["source.category"] = category
    
    if source:
        query["source.name"] = source
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    # Try to get from cache first
    cache_key = f"articles:{category}:{source}:{search}:{limit}:{skip}"
    cached_articles = await get_cache(cache_key)
    
    if cached_articles:
        return cached_articles
    
    # Fetch from database
    articles = await articles_collection.find(query).sort(
        "publishedAt", -1
    ).skip(skip).limit(limit).to_list(length=limit)
    
    # Store in cache for 5 minutes
    await set_cache(cache_key, articles, 300)
    
    # If user is authenticated, record this in their history
    if current_user:
        await user_history_collection.insert_one({
            "user_id": current_user.id,
            "action": "list_articles",
            "filters": {
                "category": category,
                "source": source,
                "search": search
            },
            "timestamp": datetime.utcnow()
        })
    
    return articles

# Get a single article by ID
@router.get("/{article_id}")
async def get_article(
    article_id: str = Path(...),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    # Try to get from cache first
    cache_key = f"article:{article_id}"
    cached_article = await get_cache(cache_key)
    
    if cached_article:
        return cached_article
    
    # Fetch from database
    article = await articles_collection.find_one({"article_id": article_id})
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Store in cache for 1 hour
    await set_cache(cache_key, article, 3600)
    
    # If user is authenticated, record this in their history
    if current_user:
        await user_history_collection.insert_one({
            "user_id": current_user.id,
            "action": "view_article",
            "article_id": article_id,
            "timestamp": datetime.utcnow()
        })
        
        # Increment view count
        await articles_collection.update_one(
            {"article_id": article_id},
            {"$inc": {"view_count": 1}}
        )
    
    return article

# Get featured articles
@router.get("/featured")
async def get_featured_articles(
    limit: int = Query(10, ge=1, le=20),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    # Try to get from cache first
    cache_key = f"featured_articles:{limit}"
    cached_articles = await get_cache(cache_key)
    
    if cached_articles:
        return cached_articles
    
    # Fetch from database
    # In a real implementation, you would have a more sophisticated algorithm
    # to determine featured articles
    articles = await articles_collection.find({}).sort(
        [("publishedAt", -1), ("trending_score", -1)]
    ).limit(limit).to_list(length=limit)
    
    # Store in cache for 30 minutes
    await set_cache(cache_key, articles, 1800)
    
    return articles

# Get trending articles
@router.get("/trending")
async def get_trending_articles(
    limit: int = Query(10, ge=1, le=20),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    # Try to get from cache first
    cache_key = f"trending_articles:{limit}"
    cached_articles = await get_cache(cache_key)
    
    if cached_articles:
        return cached_articles
    
    # Fetch from database
    articles = await articles_collection.find({}).sort(
        "trending_score", -1
    ).limit(limit).to_list(length=limit)
    
    # Store in cache for 15 minutes
    await set_cache(cache_key, articles, 900)
    
    return articles

# Get recommended articles for user
@router.get("/recommended")
async def get_recommended_articles(
    limit: int = Query(10, ge=1, le=20),
    current_user: User = Depends(get_current_active_user)
):
    # In a real implementation, you would have a recommendation algorithm
    # based on user interests and history
    # For now, we'll just return recent articles
    
    # Get user interests (placeholder)
    interests = ["technology", "business", "science"]
    
    # Fetch articles matching user interests
    articles = await articles_collection.find({
        "source.category": {"$in": interests}
    }).sort("publishedAt", -1).limit(limit).to_list(length=limit)
    
    return articles

# React to an article
@router.post("/{article_id}/react")
async def react_to_article(
    article_id: str = Path(...),
    reaction_type: str = Body(...),  # "like", "dislike", "share", "comment"
    comment_text: Optional[str] = Body(None),
    current_user: User = Depends(get_current_active_user)
):
    # Validate reaction type
    valid_reactions = ["like", "dislike", "share", "comment"]
    if reaction_type not in valid_reactions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid reaction type. Must be one of: {', '.join(valid_reactions)}"
        )
    
    # Check if article exists
    article = await articles_collection.find_one({"article_id": article_id})
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Update reaction count
    update_field = f"reactions.{reaction_type}s"
    
    await articles_collection.update_one(
        {"article_id": article_id},
        {"$inc": {update_field: 1}}
    )
    
    # If it's a comment, store the comment
    if reaction_type == "comment" and comment_text:
        await articles_collection.update_one(
            {"article_id": article_id},
            {"$push": {
                "comments": {
                    "user_id": current_user.id,
                    "username": current_user.username,
                    "text": comment_text,
                    "timestamp": datetime.utcnow()
                }
            }}
        )
    
    # Record in user history
    await user_history_collection.insert_one({
        "user_id": current_user.id,
        "action": f"{reaction_type}_article",
        "article_id": article_id,
        "timestamp": datetime.utcnow()
    })
    
    return {"message": f"Article {reaction_type} recorded successfully"}

# Save/unsave article
@router.post("/{article_id}/save")
async def save_article(
    article_id: str = Path(...),
    current_user: User = Depends(get_current_active_user)
):
    # Check if article exists
    article = await articles_collection.find_one({"article_id": article_id})
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Save article for user
    await user_history_collection.insert_one({
        "user_id": current_user.id,
        "action": "save_article",
        "article_id": article_id,
        "timestamp": datetime.utcnow()
    })
    
    return {"message": "Article saved successfully"}

@router.delete("/{article_id}/save")
async def unsave_article(
    article_id: str = Path(...),
    current_user: User = Depends(get_current_active_user)
):
    # Delete saved article record
    result = await user_history_collection.delete_one({
        "user_id": current_user.id,
        "action": "save_article",
        "article_id": article_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved article not found"
        )
    
    return {"message": "Article unsaved successfully"}

