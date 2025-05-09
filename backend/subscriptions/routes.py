from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime, timedelta
import modal

from backend.subscriptions.models import (
    SubscriptionPlan, 
    UserSubscription, 
    SubscriptionTransaction,
    SubscriptionTier,
    SubscriptionStatus
)
from backend.auth.utils import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

# Define Modal app
app = modal.App("news-room-subscriptions")

# Get all subscription plans
@app.function(method=["GET"])
@modal.web_endpoint(method=["GET"])
async def get_plans():
    # In a real app, this would fetch from database
    plans = [
        SubscriptionPlan(
            id="free-monthly",
            name="Free",
            tier=SubscriptionTier.FREE,
            price=0,
            interval="month",
            features=["Limited articles (10 per day)", "Basic personalization", "Standard news updates"],
            articleLimit=10,
            adFree=False,
            premiumContent=False,
            earlyAccess=False,
            offlineReading=False,
            newsletter=False,
        ),
        SubscriptionPlan(
            id="individual-monthly",
            name="Individual Monthly",
            tier=SubscriptionTier.INDIVIDUAL,
            price=9.99,
            interval="month",
            features=[
                "Unlimited articles", 
                "Advanced personalization", 
                "Ad-free experience", 
                "Premium content", 
                "Early access", 
                "Offline reading", 
                "Newsletter subscription"
            ],
            adFree=True,
            premiumContent=True,
            earlyAccess=True,
            offlineReading=True,
            newsletter=True,
        ),
        SubscriptionPlan(
            id="individual-yearly",
            name="Individual Yearly",
            tier=SubscriptionTier.INDIVIDUAL,
            price=99,
            interval="year",
            features=[
                "Unlimited articles", 
                "Advanced personalization", 
                "Ad-free experience", 
                "Premium content", 
                "Early access", 
                "Offline reading", 
                "Newsletter subscription"
            ],
            adFree=True,
            premiumContent=True,
            earlyAccess=True,
            offlineReading=True,
            newsletter=True,
        ),
        SubscriptionPlan(
            id="organization-monthly",
            name="Organization Monthly",
            tier=SubscriptionTier.ORGANIZATION,
            price=49.99,
            interval="month",
            features=[
                "All individual features",
                "Team sharing",
                "Collaborative workspaces",
                "Custom dashboards",
                "API access",
                "Usage analytics",
                "Dedicated support"
            ],
            adFree=True,
            premiumContent=True,
            earlyAccess=True,
            offlineReading=True,
            newsletter=True,
            teamSharing=True,
            collaborativeWorkspaces=True,
            customDashboards=True,
            apiAccess=True,
            usageAnalytics=True,
            dedicatedSupport=True,
        ),
        SubscriptionPlan(
            id="organization-yearly",
            name="Organization Yearly",
            tier=SubscriptionTier.ORGANIZATION,
            price=499,
            interval="year",
            features=[
                "All individual features",
                "Team sharing",
                "Collaborative workspaces",
                "Custom dashboards",
                "API access",
                "Usage analytics",
                "Dedicated support"
            ],
            adFree=True,
            premiumContent=True,
            earlyAccess=True,
            offlineReading=True,
            newsletter=True,
            teamSharing=True,
            collaborativeWorkspaces=True,
            customDashboards=True,
            apiAccess=True,
            usageAnalytics=True,
            dedicatedSupport=True,
        ),
    ]
    return {"plans": plans}

# Subscribe to a plan
@app.function(method=["POST"])
@modal.web_endpoint(method=["POST"])
async def subscribe(plan_id: str, payment_method: dict, current_user: dict = Depends(get_current_user)):
    # In a real app, this would:
    # 1. Validate the payment method
    # 2. Process the payment through a payment processor (e.g., Stripe)
    # 3. Create a subscription record in the database
    
    # Mock implementation
    now = datetime.now()
    
    # Get the plan details
    plans_response = await get_plans()
    plans = plans_response["plans"]
    
    plan = next((p for p in plans if p.id == plan_id), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    # Calculate end date based on interval
    if plan.interval == "month":
        end_date = now + timedelta(days=30)
    else:  # year
        end_date = now + timedelta(days=365)
    
    # Create subscription
    subscription = UserSubscription(
        id=f"sub_{now.timestamp()}",
        userId=current_user["id"],
        planId=plan_id,
        status=SubscriptionStatus.ACTIVE,
        startDate=now,
        endDate=end_date,
        autoRenew=True,
        paymentMethod=payment_method,
        articleCount=0 if plan.tier == SubscriptionTier.FREE else None
    )
    
    # Create transaction record
    transaction = SubscriptionTransaction(
        id=f"txn_{now.timestamp()}",
        subscriptionId=subscription.id,
        amount=plan.price,
        status="succeeded",
        paymentMethod=payment_method,
        createdAt=now
    )
    
    # In a real app, save these to the database
    
    return {
        "subscription": subscription,
        "transaction": transaction,
        "message": f"Successfully subscribed to {plan.name} plan"
    }

# Cancel subscription
@app.function(method=["PUT"])
@modal.web_endpoint(method=["PUT"])
async def cancel_subscription(subscription_id: str, current_user: dict = Depends(get_current_user)):
    # In a real app, this would:
    # 1. Validate the subscription belongs to the user
    # 2. Update the subscription status in the database
    # 3. Handle any refund logic if applicable
    
    # Mock implementation
    return {
        "message": f"Subscription {subscription_id} has been canceled",
        "status": SubscriptionStatus.CANCELED
    }

# Change subscription plan
@app.function(method=["PUT"])
@modal.web_endpoint(method=["PUT"])
async def change_plan(subscription_id: str, new_plan_id: str, current_user: dict = Depends(get_current_user)):
    # In a real app, this would:
    # 1. Validate the subscription belongs to the user
    # 2. Calculate prorated charges or credits
    # 3. Update the subscription in the database
    
    # Mock implementation
    plans_response = await get_plans()
    plans = plans_response["plans"]
    
    new_plan = next((p for p in plans if p.id == new_plan_id), None)
    if not new_plan:
        raise HTTPException(status_code=404, detail="New subscription plan not found")
    
    return {
        "message": f"Subscription changed to {new_plan.name}",
        "newPlanId": new_plan_id
    }

# Get user's current subscription
@app.function(method=["GET"])
@modal.web_endpoint(method=["GET"])
async def get_user_subscription(current_user: dict = Depends(get_current_user)):
    # In a real app, this would fetch from database
    
    # Mock implementation - assume user has a subscription
    now = datetime.now()
    
    subscription = UserSubscription(
        id=f"sub_mock",
        userId=current_user["id"],
        planId="individual-monthly",
        status=SubscriptionStatus.ACTIVE,
        startDate=now - timedelta(days=15),
        endDate=now + timedelta(days=15),
        autoRenew=True,
        paymentMethod={"type": "credit_card", "last4": "4242"}
    )
    
    return {"subscription": subscription}

# Get subscription usage (for free tier article count)
@app.function(method=["GET"])
@modal.web_endpoint(method=["GET"])
async def get_usage(current_user: dict = Depends(get_current_user)):
    # In a real app, this would fetch from database
    
    # Mock implementation
    subscription_response = await get_user_subscription(current_user)
    subscription = subscription_response["subscription"]
    
    # For free tier, return article count
    if subscription.planId == "free-monthly":
        return {
            "articleCount": 5,  # Mock value
            "articleLimit": 10,
            "resetDate": subscription.endDate
        }
    
    # For paid tiers, return null (unlimited)
    return {
        "articleCount": None,
        "articleLimit": None,
        "resetDate": None
    }

