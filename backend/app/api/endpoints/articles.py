from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.core.auth import get_current_user, check_article_access
from app.db.session import get_db
from app.models.article import Article
from app.models.user import User
from app.schemas.article import Article as ArticleSchema, ArticleCreate, ArticleUpdate, ArticleDetail

router = APIRouter()

@router.get("/", response_model=List[ArticleSchema])
def read_articles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve articles with filtering and pagination.
    """
    query = db.query(Article)
    
    # Apply category filter if provided
    if category:
        query = query.filter(Article.categories.contains([category]))
    
    # Apply search filter if provided
    if search:
        search_filter = or_(
            Article.title.ilike(f"%{search}%"),
            Article.summary.ilike(f"%{search}%"),
            Article.content.ilike(f"%{search}%"),
        )
        query = query.filter(search_filter)
    
    # Get all articles but filter out those the user doesn't have access to
    articles = query.offset(skip).limit(limit).all()
    
    # Filter articles based on user's subscription tier
    return [
        article for article in articles 
        if check_article_access(current_user, article.access_tier)
    ]

@router.post("/", response_model=ArticleSchema)
def create_article(
    *,
    db: Session = Depends(get_db),
    article_in: ArticleCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new article.
    """
    article = Article(
        title=article_in.title,
        content=article_in.content,
        summary=article_in.summary,
        source=article_in.source,
        source_url=article_in.source_url,
        author=article_in.author,
        categories=article_in.categories,
        access_tier=article_in.access_tier,
        featured_image=article_in.featured_image,
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

@router.get("/{article_id}", response_model=ArticleDetail)
def read_article(
    *,
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get article by ID.
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Check if user has access to this article
    if not check_article_access(current_user, article.access_tier):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this article",
        )
    
    return article

@router.put("/{article_id}", response_model=ArticleSchema)
def update_article(
    *,
    article_id: str,
    db: Session = Depends(get_db),
    article_in: ArticleUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update an article.
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    # Update article fields
    if article_in.title is not None:
        article.title = article_in.title
    if article_in.content is not None:
        article.content = article_in.content
    if article_in.summary is not None:
        article.summary = article_in.summary
    if article_in.source is not None:
        article.source = article_in.source
    if article_in.source_url is not None:
        article.source_url = article_in.source_url
    if article_in.author is not None:
        article.author = article_in.author
    if article_in.categories is not None:
        article.categories = article_in.categories
    if article_in.access_tier is not None:
        article.access_tier = article_in.access_tier
    if article_in.featured_image is not None:
        article.featured_image = article_in.featured_image
    
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

@router.delete("/{article_id}", response_model=ArticleSchema)
def delete_article(
    *,
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Delete an article.
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    
    db.delete(article)
    db.commit()
    return article

