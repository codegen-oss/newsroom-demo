"""
Article router for the News Room API.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database import get_db, Article, User
from database.schema import AccessTier, SubscriptionTier
from backend.models.articles import ArticleCreate, ArticleResponse, ArticleUpdate
from backend.routers.auth import get_current_user

router = APIRouter()

def check_article_access(article: Article, user: Optional[User] = None):
    """Check if a user has access to an article based on subscription tier."""
    # Free articles are accessible to everyone
    if article.access_tier == AccessTier.FREE:
        return True
    
    # If no user is logged in, only free articles are accessible
    if user is None:
        return False
    
    # Premium articles are accessible to individual and organization subscribers
    if article.access_tier == AccessTier.PREMIUM:
        return user.subscription_tier in [SubscriptionTier.INDIVIDUAL, SubscriptionTier.ORGANIZATION]
    
    # Organization articles are only accessible to organization subscribers
    if article.access_tier == AccessTier.ORGANIZATION:
        return user.subscription_tier == SubscriptionTier.ORGANIZATION
    
    return False

@router.get("/articles", response_model=List[ArticleResponse])
async def read_articles(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Article)
    
    # Filter by category if provided
    if category:
        # This is a simplification; in a real app, you'd need a more sophisticated query
        # to search within the JSON array
        query = query.filter(Article.categories.contains(f'["{category}"]'))
    
    articles = query.offset(skip).limit(limit).all()
    
    # Filter articles based on user's subscription tier
    accessible_articles = [
        article for article in articles
        if check_article_access(article, current_user)
    ]
    
    return accessible_articles

@router.get("/articles/{article_id}", response_model=ArticleResponse)
async def read_article(
    article_id: str,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if not check_article_access(article, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this article"
        )
    
    return article

@router.post("/articles", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    article: ArticleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, you might want to check if the user has permission to create articles
    db_article = Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        source=article.source,
        source_url=article.source_url,
        author=article.author,
        categories=article.categories,
        access_tier=article.access_tier,
        featured_image=article.featured_image
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.put("/articles/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, you might want to check if the user has permission to update articles
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Update article fields if provided
    if article_update.title is not None:
        db_article.title = article_update.title
    if article_update.content is not None:
        db_article.content = article_update.content
    if article_update.summary is not None:
        db_article.summary = article_update.summary
    if article_update.source is not None:
        db_article.source = article_update.source
    if article_update.source_url is not None:
        db_article.source_url = article_update.source_url
    if article_update.author is not None:
        db_article.author = article_update.author
    if article_update.categories is not None:
        db_article.categories = article_update.categories
    if article_update.access_tier is not None:
        db_article.access_tier = article_update.access_tier
    if article_update.featured_image is not None:
        db_article.featured_image = article_update.featured_image
    
    db.commit()
    db.refresh(db_article)
    return db_article

@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, you might want to check if the user has permission to delete articles
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
    return None

