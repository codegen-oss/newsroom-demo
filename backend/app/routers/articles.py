from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import Article, User
from app.schemas import ArticleCreate, ArticleUpdate, ArticleResponse, AccessTierEnum
from app.auth.utils import get_current_user

router = APIRouter()

@router.post("/", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In a real app, we'd check if the user has permission to create articles
    
    db_article = Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        source=article.source,
        source_url=article.source_url,
        author=article.author,
        published_at=article.published_at or datetime.utcnow(),
        categories=article.categories,
        access_tier=article.access_tier,
        featured_image=article.featured_image
    )
    
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.get("/", response_model=List[ArticleResponse])
def read_articles(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    access_tier: Optional[AccessTierEnum] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(Article)
    
    # Filter by category if provided
    if category:
        # This is a simplified approach - in a real app, we'd need a more sophisticated
        # way to query JSON arrays in SQLite
        query = query.filter(Article.categories.like(f'%{category}%'))
    
    # Filter by access tier based on user's subscription
    if current_user:
        if current_user.subscription_tier == "free":
            query = query.filter(Article.access_tier == "free")
        elif current_user.subscription_tier == "individual":
            query = query.filter(Article.access_tier.in_(["free", "premium"]))
        # Organization users can access all tiers
    else:
        # Unauthenticated users can only see free articles
        query = query.filter(Article.access_tier == "free")
    
    # Additional filter by access_tier if provided
    if access_tier:
        query = query.filter(Article.access_tier == access_tier)
    
    # Order by published date (newest first)
    query = query.order_by(Article.published_at.desc())
    
    articles = query.offset(skip).limit(limit).all()
    return articles

@router.get("/{article_id}", response_model=ArticleResponse)
def read_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Check if user has access to this article
    if article.access_tier != "free":
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required for premium content"
            )
        
        if article.access_tier == "premium" and current_user.subscription_tier == "free":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Premium subscription required for this content"
            )
        
        if article.access_tier == "organization" and current_user.subscription_tier != "organization":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Organization subscription required for this content"
            )
    
    return article

@router.put("/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # In a real app, we'd check if the user has permission to update articles
    
    db_article = db.query(Article).filter(Article.id == article_id).first()
    
    if not db_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Update fields if provided
    for key, value in article_update.dict(exclude_unset=True).items():
        setattr(db_article, key, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article

