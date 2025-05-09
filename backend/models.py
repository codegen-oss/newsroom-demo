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

class EmailFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    NONE = "none"

class UserPreferences(BaseModel):
    theme: str
    notifications: bool
    emailFrequency: EmailFrequency

class User(BaseModel):
    id: str
    email: str
    passwordHash: str
    displayName: str
    profileImage: Optional[str] = None
    subscriptionTier: SubscriptionTier = SubscriptionTier.FREE
    subscriptionStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE
    subscriptionExpiry: Optional[datetime] = None
    createdAt: datetime
    lastLogin: Optional[datetime] = None
    preferences: UserPreferences

class UserInterest(BaseModel):
    id: str
    userId: str
    categories: List[str]
    regions: List[str]
    topics: List[str]
    sources: List[str]
    followedAuthors: List[str]
    createdAt: datetime
    updatedAt: datetime

class UserHistory(BaseModel):
    id: str
    userId: str
    articleId: str
    readAt: datetime
    timeSpent: int
    completed: bool
    reactions: List[str]
    saved: bool

class OrganizationSubscription(BaseModel):
    plan: str
    seats: int
    usedSeats: int
    startDate: datetime
    renewalDate: datetime
    paymentMethod: Dict[str, Any]

class Organization(BaseModel):
    id: str
    name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    billingEmail: str
    billingAddress: Dict[str, Any]
    subscription: OrganizationSubscription
    createdAt: datetime
    updatedAt: datetime

class OrganizationRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

class OrganizationMember(BaseModel):
    id: str
    organizationId: str
    userId: str
    role: OrganizationRole
    joinedAt: datetime
    invitedBy: str

class ArticleAccessTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class ArticleSentiment(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"

class Article(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    content: str
    summary: str
    source: str
    sourceUrl: str
    author: str
    publishedAt: datetime
    categories: List[str]
    regions: List[str]
    topics: List[str]
    readTimeMinutes: int
    accessTier: ArticleAccessTier
    featuredImage: Optional[str] = None
    sentiment: ArticleSentiment
    popularity: int
    relatedArticles: List[str]

