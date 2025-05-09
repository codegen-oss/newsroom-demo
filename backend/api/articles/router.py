from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from ...utils.auth.jwt import get_current_user, TokenData, has_subscription_tier
from ...utils.database import mongo_db
from ...models.article.article_model import ArticleResponse, ArticleCreate, ArticleUpdate

router = APIRouter()


@router.get("/", response_model=List[ArticleResponse])
async def get_articles(
    current_user: TokenData = Depends(get_current_user),
    limit: int = 10,
    skip: int = 0,
    category: Optional[str] = None,
    region: Optional[str] = None,
    topic: Optional[str] = None,
    access_tier: Optional[str] = None,
):
    # Build query filters
    query = {}
    
    if category:
        query["categories"] = category
    
    if region:
        query["regions"] = region
    
    if topic:
        query["topics"] = topic
    
    # Filter by access tier based on user's subscription
    if access_tier:
        query["access_tier"] = access_tier
    else:
        # Only show articles the user has access to based on their subscription tier
        if current_user.subscription_tier == "free":
            query["access_tier"] = "free"
        elif current_user.subscription_tier == "individual":
            query["access_tier"] = {"$in": ["free", "premium"]}
        elif current_user.subscription_tier == "organization":
            query["access_tier"] = {"$in": ["free", "premium", "organization"]}
    
    # Get articles with pagination
    cursor = mongo_db.articles.find(query).sort("published_at", -1).skip(skip).limit(limit)
    articles = await cursor.to_list(length=limit)
    
    # Convert MongoDB _id to string for each article
    for article in articles:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    return articles


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    # Get article
    article = await mongo_db.articles.find_one({"_id": ObjectId(article_id)})
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Check if user has access to this article based on subscription tier
    user_tier = current_user.subscription_tier
    article_tier = article["access_tier"]
    
    if (
        (article_tier == "premium" and user_tier == "free") or
        (article_tier == "organization" and user_tier not in ["organization"])
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Subscription tier not sufficient for this article",
        )
    
    # Record user history
    history_entry = {
        "user_id": current_user.user_id,
        "article_id": article_id,
        "read_at": datetime.utcnow(),
        "time_spent": 0,  # Will be updated later
        "completed": False,
        "reactions": [],
        "saved": False
    }
    
    await mongo_db.user_history.update_one(
        {"user_id": current_user.user_id, "article_id": article_id},
        {"$set": history_entry},
        upsert=True
    )
    
    # Increment article popularity
    await mongo_db.articles.update_one(
        {"_id": ObjectId(article_id)},
        {"$inc": {"popularity": 1}}
    )
    
    # Convert MongoDB _id to string for the response
    article["id"] = str(article["_id"])
    del article["_id"]
    
    return article


@router.get("/featured", response_model=List[ArticleResponse])
async def get_featured_articles(
    current_user: TokenData = Depends(get_current_user),
    limit: int = 5
):
    # Get featured articles (highest popularity)
    # Filter by access tier based on user's subscription
    query = {}
    if current_user.subscription_tier == "free":
        query["access_tier"] = "free"
    elif current_user.subscription_tier == "individual":
        query["access_tier"] = {"$in": ["free", "premium"]}
    elif current_user.subscription_tier == "organization":
        query["access_tier"] = {"$in": ["free", "premium", "organization"]}
    
    cursor = mongo_db.articles.find(query).sort("popularity", -1).limit(limit)
    articles = await cursor.to_list(length=limit)
    
    # Convert MongoDB _id to string for each article
    for article in articles:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    return articles


@router.get("/trending", response_model=List[ArticleResponse])
async def get_trending_articles(
    current_user: TokenData = Depends(get_current_user),
    limit: int = 5,
    days: int = 7
):
    # Get trending articles (highest popularity in the last X days)
    # Calculate the date threshold
    threshold_date = datetime.utcnow() - timedelta(days=days)
    
    # Filter by access tier based on user's subscription
    query = {"published_at": {"$gte": threshold_date}}
    if current_user.subscription_tier == "free":
        query["access_tier"] = "free"
    elif current_user.subscription_tier == "individual":
        query["access_tier"] = {"$in": ["free", "premium"]}
    elif current_user.subscription_tier == "organization":
        query["access_tier"] = {"$in": ["free", "premium", "organization"]}
    
    cursor = mongo_db.articles.find(query).sort("popularity", -1).limit(limit)
    articles = await cursor.to_list(length=limit)
    
    # Convert MongoDB _id to string for each article
    for article in articles:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    return articles


@router.get("/recommended", response_model=List[ArticleResponse])
async def get_recommended_articles(
    current_user: TokenData = Depends(get_current_user),
    limit: int = 5
):
    # Get user interests
    user_interests = await mongo_db.user_interests.find_one({"user_id": current_user.user_id})
    
    if not user_interests:
        # If no interests, return featured articles
        return await get_featured_articles(current_user, limit)
    
    # Build query based on user interests
    query = {"$or": []}
    
    if user_interests.get("categories"):
        query["$or"].append({"categories": {"$in": user_interests["categories"]}})
    
    if user_interests.get("regions"):
        query["$or"].append({"regions": {"$in": user_interests["regions"]}})
    
    if user_interests.get("topics"):
        query["$or"].append({"topics": {"$in": user_interests["topics"]}})
    
    if user_interests.get("sources"):
        query["$or"].append({"source": {"$in": user_interests["sources"]}})
    
    if user_interests.get("followed_authors"):
        query["$or"].append({"author": {"$in": user_interests["followed_authors"]}})
    
    # If no interests were found, return featured articles
    if not query["$or"]:
        return await get_featured_articles(current_user, limit)
    
    # Filter by access tier based on user's subscription
    access_query = {}
    if current_user.subscription_tier == "free":
        access_query["access_tier"] = "free"
    elif current_user.subscription_tier == "individual":
        access_query["access_tier"] = {"$in": ["free", "premium"]}
    elif current_user.subscription_tier == "organization":
        access_query["access_tier"] = {"$in": ["free", "premium", "organization"]}
    
    # Combine queries
    final_query = {"$and": [query, access_query]}
    
    # Get recommended articles
    cursor = mongo_db.articles.find(final_query).sort("published_at", -1).limit(limit)
    articles = await cursor.to_list(length=limit)
    
    # If no articles found with interests, return featured articles
    if not articles:
        return await get_featured_articles(current_user, limit)
    
    # Convert MongoDB _id to string for each article
    for article in articles:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    return articles


@router.post("/{article_id}/reactions")
async def add_article_reaction(
    article_id: str,
    reaction: str = Query(..., description="Reaction type (like, dislike, etc.)"),
    current_user: TokenData = Depends(get_current_user)
):
    # Check if article exists
    article = await mongo_db.articles.find_one({"_id": ObjectId(article_id)})
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Update user history with reaction
    result = await mongo_db.user_history.update_one(
        {"user_id": current_user.user_id, "article_id": article_id},
        {"$addToSet": {"reactions": reaction}}
    )
    
    if result.matched_count == 0:
        # Create history entry if it doesn't exist
        history_entry = {
            "user_id": current_user.user_id,
            "article_id": article_id,
            "read_at": datetime.utcnow(),
            "time_spent": 0,
            "completed": False,
            "reactions": [reaction],
            "saved": False
        }
        await mongo_db.user_history.insert_one(history_entry)
    
    return {"detail": "Reaction added successfully"}


@router.put("/{article_id}/save")
async def save_article(
    article_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if article exists
    article = await mongo_db.articles.find_one({"_id": ObjectId(article_id)})
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Update user history to mark article as saved
    result = await mongo_db.user_history.update_one(
        {"user_id": current_user.user_id, "article_id": article_id},
        {"$set": {"saved": True}}
    )
    
    if result.matched_count == 0:
        # Create history entry if it doesn't exist
        history_entry = {
            "user_id": current_user.user_id,
            "article_id": article_id,
            "read_at": datetime.utcnow(),
            "time_spent": 0,
            "completed": False,
            "reactions": [],
            "saved": True
        }
        await mongo_db.user_history.insert_one(history_entry)
    
    return {"detail": "Article saved successfully"}


@router.delete("/{article_id}/save")
async def unsave_article(
    article_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    # Update user history to mark article as not saved
    result = await mongo_db.user_history.update_one(
        {"user_id": current_user.user_id, "article_id": article_id},
        {"$set": {"saved": False}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved article not found",
        )
    
    return {"detail": "Article unsaved successfully"}


# Admin endpoints for article management
@router.post("/", response_model=ArticleResponse, dependencies=[Depends(has_subscription_tier(["organization"]))])
async def create_article(
    article: ArticleCreate,
    current_user: TokenData = Depends(get_current_user)
):
    # Convert article to dict
    article_dict = article.dict()
    
    # Insert article into database
    result = await mongo_db.articles.insert_one(article_dict)
    
    # Get the created article
    created_article = await mongo_db.articles.find_one({"_id": result.inserted_id})
    
    # Convert MongoDB _id to string for the response
    created_article["id"] = str(created_article["_id"])
    del created_article["_id"]
    
    return created_article


@router.put("/{article_id}", response_model=ArticleResponse, dependencies=[Depends(has_subscription_tier(["organization"]))])
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    # Check if article exists
    existing_article = await mongo_db.articles.find_one({"_id": ObjectId(article_id)})
    if not existing_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Convert update data to dict and remove None values
    update_data = {k: v for k, v in article_update.dict().items() if v is not None}
    
    if update_data:
        # Update article in database
        await mongo_db.articles.update_one(
            {"_id": ObjectId(article_id)},
            {"$set": update_data}
        )
    
    # Get updated article
    updated_article = await mongo_db.articles.find_one({"_id": ObjectId(article_id)})
    
    # Convert MongoDB _id to string for the response
    updated_article["id"] = str(updated_article["_id"])
    del updated_article["_id"]
    
    return updated_article

