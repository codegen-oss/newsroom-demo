from typing import Dict, List, Any
from datetime import datetime, timedelta
from bson import ObjectId

async def track_user_activity(user_id: str, activity_type: str, details: Dict, mongo_db):
    """
    Track user activity for analytics.
    
    Args:
        user_id: User ID
        activity_type: Type of activity (e.g., 'view', 'save', 'react')
        details: Activity details
        mongo_db: MongoDB database connection
    """
    activity = {
        "user_id": user_id,
        "activity_type": activity_type,
        "details": details,
        "timestamp": datetime.utcnow()
    }
    
    await mongo_db.user_activities.insert_one(activity)


async def get_user_activity_summary(user_id: str, days: int, mongo_db) -> Dict[str, Any]:
    """
    Get summary of user activity over a period.
    
    Args:
        user_id: User ID
        days: Number of days to look back
        mongo_db: MongoDB database connection
        
    Returns:
        Summary of user activity
    """
    # Calculate date threshold
    threshold_date = datetime.utcnow() - timedelta(days=days)
    
    # Get article views
    views_pipeline = [
        {"$match": {
            "user_id": user_id,
            "read_at": {"$gte": threshold_date}
        }},
        {"$group": {
            "_id": None,
            "count": {"$sum": 1},
            "saved_count": {"$sum": {"$cond": [{"$eq": ["$saved", True]}, 1, 0]}},
            "reaction_count": {"$sum": {"$size": "$reactions"}}
        }}
    ]
    
    views_result = await mongo_db.user_history.aggregate(views_pipeline).to_list(length=1)
    
    # Get category distribution
    category_pipeline = [
        {"$match": {"user_id": user_id, "read_at": {"$gte": threshold_date}}},
        {"$lookup": {
            "from": "articles",
            "localField": "article_id",
            "foreignField": "_id",
            "as": "article"
        }},
        {"$unwind": "$article"},
        {"$unwind": "$article.categories"},
        {"$group": {
            "_id": "$article.categories",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    
    category_results = await mongo_db.user_history.aggregate(category_pipeline).to_list(length=5)
    
    # Get topic distribution
    topic_pipeline = [
        {"$match": {"user_id": user_id, "read_at": {"$gte": threshold_date}}},
        {"$lookup": {
            "from": "articles",
            "localField": "article_id",
            "foreignField": "_id",
            "as": "article"
        }},
        {"$unwind": "$article"},
        {"$unwind": "$article.topics"},
        {"$group": {
            "_id": "$article.topics",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    
    topic_results = await mongo_db.user_history.aggregate(topic_pipeline).to_list(length=5)
    
    # Format results
    views_data = views_result[0] if views_result else {"count": 0, "saved_count": 0, "reaction_count": 0}
    
    categories = [
        {"category": result["_id"], "count": result["count"]}
        for result in category_results
    ]
    
    topics = [
        {"topic": result["_id"], "count": result["count"]}
        for result in topic_results
    ]
    
    return {
        "period_days": days,
        "article_views": views_data["count"],
        "saved_articles": views_data["saved_count"],
        "reactions": views_data["reaction_count"],
        "top_categories": categories,
        "top_topics": topics
    }


async def get_organization_activity_summary(org_id: str, days: int, mongo_db) -> Dict[str, Any]:
    """
    Get summary of organization activity over a period.
    
    Args:
        org_id: Organization ID
        days: Number of days to look back
        mongo_db: MongoDB database connection
        
    Returns:
        Summary of organization activity
    """
    # Calculate date threshold
    threshold_date = datetime.utcnow() - timedelta(days=days)
    
    # Get organization members
    members = await mongo_db.organization_members.find(
        {"organization_id": org_id}
    ).to_list(length=100)
    
    member_ids = [member["user_id"] for member in members]
    
    # Get article views by all members
    views_pipeline = [
        {"$match": {
            "user_id": {"$in": member_ids},
            "read_at": {"$gte": threshold_date}
        }},
        {"$group": {
            "_id": None,
            "count": {"$sum": 1},
            "saved_count": {"$sum": {"$cond": [{"$eq": ["$saved", True]}, 1, 0]}},
            "reaction_count": {"$sum": {"$size": "$reactions"}}
        }}
    ]
    
    views_result = await mongo_db.user_history.aggregate(views_pipeline).to_list(length=1)
    
    # Get activity by member
    member_activity_pipeline = [
        {"$match": {
            "user_id": {"$in": member_ids},
            "read_at": {"$gte": threshold_date}
        }},
        {"$group": {
            "_id": "$user_id",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    
    member_activity_results = await mongo_db.user_history.aggregate(member_activity_pipeline).to_list(length=5)
    
    # Get category distribution
    category_pipeline = [
        {"$match": {"user_id": {"$in": member_ids}, "read_at": {"$gte": threshold_date}}},
        {"$lookup": {
            "from": "articles",
            "localField": "article_id",
            "foreignField": "_id",
            "as": "article"
        }},
        {"$unwind": "$article"},
        {"$unwind": "$article.categories"},
        {"$group": {
            "_id": "$article.categories",
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    
    category_results = await mongo_db.user_history.aggregate(category_pipeline).to_list(length=5)
    
    # Format results
    views_data = views_result[0] if views_result else {"count": 0, "saved_count": 0, "reaction_count": 0}
    
    # Get user details for member activity
    member_activity = []
    for result in member_activity_results:
        user = await mongo_db.users.find_one({"_id": ObjectId(result["_id"])})
        if user:
            member_activity.append({
                "user_id": result["_id"],
                "display_name": user["display_name"],
                "article_views": result["count"]
            })
    
    categories = [
        {"category": result["_id"], "count": result["count"]}
        for result in category_results
    ]
    
    return {
        "period_days": days,
        "total_article_views": views_data["count"],
        "total_saved_articles": views_data["saved_count"],
        "total_reactions": views_data["reaction_count"],
        "active_members": member_activity,
        "top_categories": categories
    }

