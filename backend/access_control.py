from fastapi import Depends, HTTPException, status
from typing import Optional, List
from datetime import datetime

from backend.auth.utils import get_current_user
from backend.subscriptions.models import SubscriptionTier, SubscriptionStatus

async def get_user_subscription_tier(current_user: dict = Depends(get_current_user)):
    """
    Get the user's current subscription tier.
    In a real app, this would fetch from the database.
    """
    # Mock implementation - in a real app, fetch from database
    # For demo purposes, we'll return a mock subscription tier
    return SubscriptionTier.INDIVIDUAL

async def check_article_access(
    article_id: str, 
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Check if the user has access to the specified article based on their subscription tier.
    """
    # In a real app, this would:
    # 1. Get the article details from the database
    # 2. Get the user's subscription details
    # 3. Check if the user has access based on the article's tier and user's subscription
    
    # Mock implementation
    # Get user's subscription tier
    user_tier = await get_user_subscription_tier(current_user)
    
    # Mock article tier (in a real app, fetch from database)
    article_tier = "premium"  # Assume this is a premium article
    
    # Check access based on tiers
    if article_tier == "free":
        # Free articles are accessible to all
        return True
    
    if article_tier == "premium" and user_tier in [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION]:
        # Premium articles require individual or organization tier
        return True
    
    if article_tier == "organization" and user_tier == SubscriptionTier.ORGANIZATION:
        # Organization articles require organization tier
        return True
    
    # If we get here, user doesn't have access
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You don't have access to this article. Please upgrade your subscription."
    )

async def check_feature_access(
    feature_name: str,
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Check if the user has access to the specified feature based on their subscription tier.
    """
    # Get user's subscription tier
    user_tier = await get_user_subscription_tier(current_user)
    
    # Define feature access by tier
    feature_access = {
        "advanced_personalization": [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION],
        "ad_free": [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION],
        "premium_content": [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION],
        "early_access": [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION],
        "offline_reading": [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION],
        "newsletter": [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION],
        "team_sharing": [SubscriptionTier.ORGANIZATION],
        "collaborative_workspaces": [SubscriptionTier.ORGANIZATION],
        "custom_dashboards": [SubscriptionTier.ORGANIZATION],
        "api_access": [SubscriptionTier.ORGANIZATION],
        "usage_analytics": [SubscriptionTier.ORGANIZATION],
        "dedicated_support": [SubscriptionTier.ORGANIZATION],
    }
    
    # Check if feature exists
    if feature_name not in feature_access:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature '{feature_name}' not found"
        )
    
    # Check if user's tier has access to the feature
    if user_tier not in feature_access[feature_name]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Your subscription tier does not include access to '{feature_name}'. Please upgrade your subscription."
        )
    
    return True

async def check_article_limit(
    current_user: dict = Depends(get_current_user)
):
    """
    Check if the user has reached their article limit (for free tier).
    """
    # Get user's subscription tier
    user_tier = await get_user_subscription_tier(current_user)
    
    # Paid tiers have unlimited articles
    if user_tier != SubscriptionTier.FREE:
        return True
    
    # For free tier, check article count
    # In a real app, this would fetch from database
    
    # Mock implementation
    article_count = 8  # Mock value
    article_limit = 10
    
    if article_count >= article_limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You've reached your daily article limit ({article_limit}). Please upgrade your subscription for unlimited access."
        )
    
    # If we get here, user has not reached their limit
    return True

async def check_api_rate_limit(
    current_user: dict = Depends(get_current_user)
):
    """
    Check if the user has exceeded their API rate limit based on their subscription tier.
    """
    # Get user's subscription tier
    user_tier = await get_user_subscription_tier(current_user)
    
    # Define rate limits by tier
    rate_limits = {
        SubscriptionTier.FREE: 10,  # 10 requests per hour
        SubscriptionTier.INDIVIDUAL: 100,  # 100 requests per hour
        SubscriptionTier.ORGANIZATION: 1000,  # 1000 requests per hour
    }
    
    # In a real app, this would check the user's request count in a time window
    # For now, we'll just return the rate limit
    
    return {
        "rate_limit": rate_limits[user_tier],
        "remaining": rate_limits[user_tier] - 1  # Mock value
    }

