from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = "free"
    INDIVIDUAL = "individual"
    ORGANIZATION = "organization"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    TRIAL = "trial"
    CANCELED = "canceled"

class SubscriptionPlan(BaseModel):
    id: str
    name: str
    tier: SubscriptionTier
    price: float
    interval: str  # 'month' or 'year'
    features: List[str]
    articleLimit: Optional[int] = None  # Only for free tier
    adFree: bool = False
    premiumContent: bool = False
    earlyAccess: bool = False
    offlineReading: bool = False
    newsletter: bool = False
    teamSharing: bool = False
    collaborativeWorkspaces: bool = False
    customDashboards: bool = False
    apiAccess: bool = False
    usageAnalytics: bool = False
    dedicatedSupport: bool = False

class UserSubscription(BaseModel):
    id: str
    userId: str
    planId: str
    status: SubscriptionStatus
    startDate: datetime
    endDate: datetime
    autoRenew: bool = True
    paymentMethod: Dict[str, Any]
    articleCount: Optional[int] = None  # For tracking free tier usage
    trialEndsAt: Optional[datetime] = None

class SubscriptionTransaction(BaseModel):
    id: str
    subscriptionId: str
    amount: float
    currency: str = "USD"
    status: str  # 'succeeded', 'failed', 'pending'
    paymentMethod: Dict[str, Any]
    createdAt: datetime

