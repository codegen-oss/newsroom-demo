"""
Subscriptions router for the News Room application.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Path, Body, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime, timedelta

from ...db.postgres.connection import get_db
from ...db.postgres.models import User, Subscription
from ...auth.jwt import get_current_active_user

router = APIRouter()

# Subscription plan data (in a real app, this would be in the database)
SUBSCRIPTION_PLANS = {
    "free": {
        "name": "Free",
        "price": 0.0,
        "features": ["Basic access to articles", "Limited search"]
    },
    "basic": {
        "name": "Basic",
        "price": 4.99,
        "features": ["Full access to articles", "Advanced search", "No ads"]
    },
    "premium": {
        "name": "Premium",
        "price": 9.99,
        "features": ["Full access to articles", "Advanced search", "No ads", "Early access to content", "Exclusive newsletters"]
    }
}

# Subscription schemas
class SubscriptionPlan(BaseModel):
    id: str
    name: str
    price: float
    features: List[str]

class SubscriptionResponse(BaseModel):
    id: int
    plan_name: str
    price: float
    is_active: bool
    start_date: datetime
    end_date: Optional[datetime] = None

# Get available subscription plans
@router.get("/plans", response_model=List[SubscriptionPlan])
async def get_subscription_plans():
    plans = []
    for plan_id, plan_data in SUBSCRIPTION_PLANS.items():
        plans.append({
            "id": plan_id,
            "name": plan_data["name"],
            "price": plan_data["price"],
            "features": plan_data["features"]
        })
    return plans

# Get current user's subscription
@router.get("/me", response_model=Optional[SubscriptionResponse])
async def get_user_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get active subscription
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).first()
    
    return subscription

# Subscribe to a plan
@router.post("/subscribe", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def subscribe(
    plan_id: str = Body(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if plan exists
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription plan"
        )
    
    plan_data = SUBSCRIPTION_PLANS[plan_id]
    
    # Check if user already has an active subscription
    existing_subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).first()
    
    if existing_subscription:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has an active subscription"
        )
    
    # Create new subscription
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=30)  # 30-day subscription
    
    new_subscription = Subscription(
        user_id=current_user.id,
        plan_name=plan_data["name"],
        price=plan_data["price"],
        is_active=True,
        start_date=start_date,
        end_date=end_date
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription

# Cancel subscription
@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get active subscription
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    
    # Cancel subscription
    subscription.is_active = False
    db.commit()
    
    return {"message": "Subscription cancelled successfully"}

# Change subscription plan
@router.post("/change-plan", response_model=SubscriptionResponse)
async def change_plan(
    plan_id: str = Body(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if plan exists
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid subscription plan"
        )
    
    plan_data = SUBSCRIPTION_PLANS[plan_id]
    
    # Get active subscription
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    
    # Cancel current subscription
    subscription.is_active = False
    db.commit()
    
    # Create new subscription
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=30)  # 30-day subscription
    
    new_subscription = Subscription(
        user_id=current_user.id,
        plan_name=plan_data["name"],
        price=plan_data["price"],
        is_active=True,
        start_date=start_date,
        end_date=end_date
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return new_subscription

