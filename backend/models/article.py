from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid

class AccessTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ORGANIZATION = "organization"

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"

class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    content: str
    summary: str
    source: str
    source_url: HttpUrl
    author: str
    published_at: datetime
    categories: List[str] = []
    regions: List[str] = []
    topics: List[str] = []
    read_time_minutes: int
    access_tier: AccessTier = AccessTier.FREE
    featured_image: Optional[str] = None
    sentiment: Sentiment = Sentiment.NEUTRAL
    popularity: int = 0
    related_articles: List[str] = []

class ArticleResponse(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    summary: str
    source: str
    source_url: HttpUrl
    author: str
    published_at: datetime
    categories: List[str]
    regions: List[str]
    topics: List[str]
    read_time_minutes: int
    access_tier: AccessTier
    featured_image: Optional[str] = None
    sentiment: Sentiment
    popularity: int

class ArticleDetailResponse(ArticleResponse):
    content: str
    related_articles: List[str]

