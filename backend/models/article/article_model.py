from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Literal
from datetime import datetime
import uuid

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
    access_tier: Literal["free", "premium", "organization"] = "free"
    featured_image: Optional[str] = None
    sentiment: Literal["positive", "neutral", "negative"] = "neutral"
    popularity: int = 0
    related_articles: List[str] = []

class ArticleCreate(BaseModel):
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
    access_tier: Literal["free", "premium", "organization"] = "free"
    featured_image: Optional[str] = None
    sentiment: Literal["positive", "neutral", "negative"] = "neutral"
    related_articles: List[str] = []

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    categories: Optional[List[str]] = None
    regions: Optional[List[str]] = None
    topics: Optional[List[str]] = None
    read_time_minutes: Optional[int] = None
    access_tier: Optional[Literal["free", "premium", "organization"]] = None
    featured_image: Optional[str] = None
    sentiment: Optional[Literal["positive", "neutral", "negative"]] = None
    popularity: Optional[int] = None
    related_articles: Optional[List[str]] = None

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
    access_tier: str
    featured_image: Optional[str] = None
    sentiment: str
    popularity: int

