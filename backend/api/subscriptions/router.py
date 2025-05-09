from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
from datetime import datetime, timedelta
from bson import ObjectId

from ...utils.auth.jwt import get_current_user, TokenData
from ...utils.database import mongo_db

router = APIRouter()


# Subscription plans
SUBSCRIPTION_PLANS = {
    "free": {
        "name": "Free",
        "price_monthly": 0,
        "price_yearly": 0,
        "features": [
            "Limited articles per day (5-10)",
            "Basic personalization",
            "Ad-supported experience",
            "Standard news updates"
        ]
    },
    "individual": {
        "name": "Individual Premium",
        "price_monthly": 9.99,
        "price_yearly": 99.00,
        "features": [
            "Unlimited articles",
            "Advanced personalization",
            "Ad-free experience",
            "Premium content access",
            "Early access to features",
            "Offline reading",
            "Newsletter subscriptions"
        ]
    },
    "organization": {
        "name": "Organization",
        "price_monthly": 49.99,
        "price_yearly": 499.00,
        "features": [
            "All individual features",
            "Team sharing capabilities",
            "Collaborative workspaces",
            "Custom dashboards",
            "API access",
            "Usage analytics",
            "Dedicated support"
        ],
        "per_seat_price": 5.00
    }
}


@router.get("/plans")
async def get_subscription_plans():
    return SUBSCRIPTION_PLANS


@router.post("/subscribe")
async def subscribe_to_plan(
    plan_id: str,
    payment_method: Dict,
    current_user: TokenData = Depends(get_current_user)
):
    # Validate plan
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription plan",
        )
    
    # Get user
    user = await mongo_db.users.find_one({"_id": ObjectId(current_user.user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # In a real application, process payment here
    # For now, just update the user's subscription
    
    # Calculate expiry date (1 month from now)
    expiry_date = datetime.utcnow() + timedelta(days=30)
    
    # Update user subscription
    await mongo_db.users.update_one(
        {"_id": ObjectId(current_user.user_id)},
        {
            "$set": {
                "subscription_tier": plan_id,
                "subscription_status": "active",
                "subscription_expiry": expiry_date
            }
        }
    )
    
    # If organization plan, create an organization if it doesn't exist
    if plan_id == "organization":
        # Check if user already has an organization
        existing_org_member = await mongo_db.organization_members.find_one({
            "user_id": current_user.user_id,
            "role": "admin"
        })
        
        if not existing_org_member:
            # Create a default organization
            org_data = {
                "name": f"{user['display_name']}'s Organization",
                "logo": None,
                "industry": None,
                "size": "small",
                "billing_email": user["email"],
                "billing_address": {},
                "subscription": {
                    "plan": "organization",
                    "seats": 5,
                    "used_seats": 1,
                    "start_date": datetime.utcnow(),
                    "renewal_date": expiry_date,
                    "payment_method": payment_method
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            # Insert organization
            org_result = await mongo_db.organizations.insert_one(org_data)
            
            # Create organization member entry for the user (as admin)
            member_data = {
                "organization_id": str(org_result.inserted_id),
                "user_id": current_user.user_id,
                "role": "admin",
                "joined_at": datetime.utcnow(),
                "invited_by": current_user.user_id
            }
            await mongo_db.organization_members.insert_one(member_data)
    
    return {
        "detail": f"Successfully subscribed to {SUBSCRIPTION_PLANS[plan_id]['name']}",
        "subscription_tier": plan_id,
        "subscription_status": "active",
        "subscription_expiry": expiry_date
    }


@router.put("/cancel")
async def cancel_subscription(current_user: TokenData = Depends(get_current_user)):
    # Get user
    user = await mongo_db.users.find_one({"_id": ObjectId(current_user.user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Check if user has an active subscription
    if user["subscription_tier"] == "free":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active subscription to cancel",
        )
    
    # Update user subscription
    # Note: In a real application, you might want to keep the subscription active until the end of the billing period
    await mongo_db.users.update_one(
        {"_id": ObjectId(current_user.user_id)},
        {
            "$set": {
                "subscription_status": "expired"
            }
        }
    )
    
    return {
        "detail": "Subscription cancelled successfully",
        "subscription_status": "expired"
    }


@router.put("/change-plan")
async def change_subscription_plan(
    plan_id: str,
    payment_method: Dict,
    current_user: TokenData = Depends(get_current_user)
):
    # Validate plan
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription plan",
        )
    
    # Get user
    user = await mongo_db.users.find_one({"_id": ObjectId(current_user.user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Check if user is trying to change to the same plan
    if user["subscription_tier"] == plan_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You are already subscribed to the {SUBSCRIPTION_PLANS[plan_id]['name']} plan",
        )
    
    # In a real application, process payment here
    # For now, just update the user's subscription
    
    # Calculate expiry date (1 month from now)
    expiry_date = datetime.utcnow() + timedelta(days=30)
    
    # Update user subscription
    await mongo_db.users.update_one(
        {"_id": ObjectId(current_user.user_id)},
        {
            "$set": {
                "subscription_tier": plan_id,
                "subscription_status": "active",
                "subscription_expiry": expiry_date
            }
        }
    )
    
    # If changing to organization plan, create an organization if it doesn't exist
    if plan_id == "organization":
        # Check if user already has an organization
        existing_org_member = await mongo_db.organization_members.find_one({
            "user_id": current_user.user_id,
            "role": "admin"
        })
        
        if not existing_org_member:
            # Create a default organization
            org_data = {
                "name": f"{user['display_name']}'s Organization",
                "logo": None,
                "industry": None,
                "size": "small",
                "billing_email": user["email"],
                "billing_address": {},
                "subscription": {
                    "plan": "organization",
                    "seats": 5,
                    "used_seats": 1,
                    "start_date": datetime.utcnow(),
                    "renewal_date": expiry_date,
                    "payment_method": payment_method
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            # Insert organization
            org_result = await mongo_db.organizations.insert_one(org_data)
            
            # Create organization member entry for the user (as admin)
            member_data = {
                "organization_id": str(org_result.inserted_id),
                "user_id": current_user.user_id,
                "role": "admin",
                "joined_at": datetime.utcnow(),
                "invited_by": current_user.user_id
            }
            await mongo_db.organization_members.insert_one(member_data)
    
    return {
        "detail": f"Successfully changed to {SUBSCRIPTION_PLANS[plan_id]['name']} plan",
        "subscription_tier": plan_id,
        "subscription_status": "active",
        "subscription_expiry": expiry_date
    }

