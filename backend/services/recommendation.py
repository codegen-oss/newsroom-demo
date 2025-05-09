from typing import List, Dict, Any
from datetime import datetime, timedelta
import asyncio
from bson import ObjectId

async def generate_recommendations(user_id: str, mongo_db) -> List[Dict[Any, Any]]:
    """
    Generate article recommendations for a user.
    
    Args:
        user_id: User ID to generate recommendations for
        mongo_db: MongoDB database connection
        
    Returns:
        List of recommended articles
    """
    # Get user interests
    user_interests = await mongo_db.user_interests.find_one({"user_id": user_id})
    
    # Get user history
    history = await mongo_db.user_history.find(
        {"user_id": user_id}
    ).sort("read_at", -1).limit(20).to_list(length=20)
    
    # Extract article IDs from history
    history_article_ids = [ObjectId(item["article_id"]) for item in history]
    
    # Build query based on user interests and history
    query = {"_id": {"$nin": history_article_ids}}  # Exclude already read articles
    
    if user_interests:
        interest_conditions = []
        
        if user_interests.get("categories"):
            interest_conditions.append({"categories": {"$in": user_interests["categories"]}})
        
        if user_interests.get("regions"):
            interest_conditions.append({"regions": {"$in": user_interests["regions"]}})
        
        if user_interests.get("topics"):
            interest_conditions.append({"topics": {"$in": user_interests["topics"]}})
        
        if user_interests.get("sources"):
            interest_conditions.append({"source": {"$in": user_interests["sources"]}})
        
        if user_interests.get("followed_authors"):
            interest_conditions.append({"author": {"$in": user_interests["followed_authors"]}})
        
        if interest_conditions:
            query["$or"] = interest_conditions
    
    # Get user subscription tier
    user = await mongo_db.users.find_one({"_id": ObjectId(user_id)})
    user_tier = user["subscription_tier"] if user else "free"
    
    # Filter by access tier based on user's subscription
    if user_tier == "free":
        query["access_tier"] = "free"
    elif user_tier == "individual":
        query["access_tier"] = {"$in": ["free", "premium"]}
    elif user_tier == "organization":
        query["access_tier"] = {"$in": ["free", "premium", "organization"]}
    
    # Get recommendations
    recommendations = await mongo_db.articles.find(query).sort("published_at", -1).limit(10).to_list(length=10)
    
    # If not enough recommendations based on interests, add popular articles
    if len(recommendations) < 10:
        # How many more articles we need
        remaining = 10 - len(recommendations)
        
        # Get IDs of already recommended articles
        recommended_ids = [article["_id"] for article in recommendations]
        
        # Add history article IDs to exclusion list
        exclude_ids = history_article_ids + recommended_ids
        
        # Query for popular articles
        popular_query = {
            "_id": {"$nin": exclude_ids}
        }
        
        # Apply access tier filter
        if user_tier == "free":
            popular_query["access_tier"] = "free"
        elif user_tier == "individual":
            popular_query["access_tier"] = {"$in": ["free", "premium"]}
        elif user_tier == "organization":
            popular_query["access_tier"] = {"$in": ["free", "premium", "organization"]}
        
        # Get popular articles
        popular_articles = await mongo_db.articles.find(popular_query).sort("popularity", -1).limit(remaining).to_list(length=remaining)
        
        # Add to recommendations
        recommendations.extend(popular_articles)
    
    # Convert MongoDB _id to string for each article
    for article in recommendations:
        article["id"] = str(article["_id"])
        del article["_id"]
    
    return recommendations


async def update_article_popularity(mongo_db):
    """
    Update article popularity scores based on recent views.
    
    Args:
        mongo_db: MongoDB database connection
    """
    # Calculate date threshold (last 7 days)
    threshold_date = datetime.utcnow() - timedelta(days=7)
    
    # Aggregate recent views by article
    pipeline = [
        {"$match": {"read_at": {"$gte": threshold_date}}},
        {"$group": {
            "_id": "$article_id",
            "views": {"$sum": 1},
            "saves": {"$sum": {"$cond": [{"$eq": ["$saved", True]}, 1, 0]}},
            "reactions": {"$sum": {"$size": "$reactions"}}
        }}
    ]
    
    results = await mongo_db.user_history.aggregate(pipeline).to_list(length=1000)
    
    # Update popularity scores
    for result in results:
        article_id = result["_id"]
        
        # Calculate popularity score (views + 2*saves + reactions)
        popularity = result["views"] + (2 * result["saves"]) + result["reactions"]
        
        # Update article
        await mongo_db.articles.update_one(
            {"_id": ObjectId(article_id)},
            {"$set": {"popularity": popularity}}
        )


async def generate_trending_topics(mongo_db) -> List[Dict[str, Any]]:
    """
    Generate trending topics based on popular articles.
    
    Args:
        mongo_db: MongoDB database connection
        
    Returns:
        List of trending topics with counts
    """
    # Calculate date threshold (last 7 days)
    threshold_date = datetime.utcnow() - timedelta(days=7)
    
    # Aggregate topics from popular articles
    pipeline = [
        {"$match": {"published_at": {"$gte": threshold_date}}},
        {"$unwind": "$topics"},
        {"$group": {
            "_id": "$topics",
            "count": {"$sum": 1},
            "total_popularity": {"$sum": "$popularity"}
        }},
        {"$sort": {"total_popularity": -1}},
        {"$limit": 10}
    ]
    
    results = await mongo_db.articles.aggregate(pipeline).to_list(length=10)
    
    # Format results
    trending_topics = [
        {
            "topic": result["_id"],
            "count": result["count"],
            "popularity": result["total_popularity"]
        }
        for result in results
    ]
    
    return trending_topics

