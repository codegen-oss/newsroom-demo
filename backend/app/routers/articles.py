from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.database import get_db
from ..models.article import Article
from ..models.user import User
from ..schemas.article import ArticleCreate, ArticleUpdate, ArticleResponse
from ..auth.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ArticleResponse])
async def get_articles(
    skip: int = 0,
    limit: int = 10,
    category: Optional[str] = None,
    access_tier: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Base query
    query = db.query(Article)
    
    # Apply filters if provided
    if category:
        # Filter by category (this is a simplification, as categories is a JSON field)
        # In a real implementation, you might need a more complex query or a different DB schema
        query = query.filter(Article.categories.contains([category]))
    
    if access_tier:
        # Filter by access tier
        query = query.filter(Article.access_tier == access_tier)
    else:
        # If no specific tier is requested, filter based on user's subscription
        if current_user.subscription_tier == "free":
            query = query.filter(Article.access_tier == "free")
        elif current_user.subscription_tier == "individual":
            query = query.filter(Article.access_tier.in_(["free", "premium"]))
        # Organization users can see all content
    
    # Apply pagination
    articles = query.offset(skip).limit(limit).all()
    return articles

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check if user has access to this article
    if article.access_tier == "premium" and current_user.subscription_tier == "free":
        raise HTTPException(status_code=403, detail="Premium content requires a paid subscription")
    if article.access_tier == "organization" and current_user.subscription_tier not in ["organization"]:
        raise HTTPException(status_code=403, detail="This content is only available to organization members")
    
    return article

@router.post("/", response_model=ArticleResponse)
async def create_article(
    article: ArticleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, you might want to check if the user has permission to create articles
    new_article = Article(
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
    
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return new_article

@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, you might want to check if the user has permission to update articles
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Update fields if provided
    for field, value in article_update.dict(exclude_unset=True).items():
        setattr(db_article, field, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article

@router.delete("/{article_id}")
async def delete_article(
    article_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, you might want to check if the user has permission to delete articles
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
    return {"message": "Article deleted successfully"}

