from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Article, User
from app.schemas import Article as ArticleSchema, ArticleCreate, ArticleUpdate
from app.auth.auth import get_current_active_user

router = APIRouter(
    prefix="/articles",
    tags=["articles"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ArticleSchema])
def read_articles(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    query = db.query(Article)
    
    # Filter by category if provided
    if category:
        # This is a simplified approach - in a real app, you'd use a proper JSON query
        query = query.filter(Article.categories.contains(f'["{category}"]'))
    
    # Apply access tier filtering based on user subscription
    if not current_user:
        # Unauthenticated users can only see free content
        query = query.filter(Article.access_tier == "free")
    elif current_user.subscription_tier == "free":
        query = query.filter(Article.access_tier == "free")
    elif current_user.subscription_tier == "individual":
        query = query.filter(Article.access_tier.in_(["free", "premium"]))
    # Organization users can see all content
    
    articles = query.order_by(Article.published_at.desc()).offset(skip).limit(limit).all()
    return articles

@router.get("/{article_id}", response_model=ArticleSchema)
def read_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check if user has access to this article
    if not current_user:
        if article.access_tier != "free":
            raise HTTPException(status_code=403, detail="Access denied. This content requires a subscription.")
    elif current_user.subscription_tier == "free":
        if article.access_tier != "free":
            raise HTTPException(status_code=403, detail="Access denied. This content requires a higher subscription tier.")
    elif current_user.subscription_tier == "individual":
        if article.access_tier == "organization":
            raise HTTPException(status_code=403, detail="Access denied. This content requires an organization subscription.")
    
    return article

@router.post("/", response_model=ArticleSchema)
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # In a real app, you'd check if the user has admin privileges
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

@router.put("/{article_id}", response_model=ArticleSchema)
def update_article(
    article_id: str,
    article: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # In a real app, you'd check if the user has admin privileges
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Update article fields
    for key, value in article.dict(exclude_unset=True).items():
        setattr(db_article, key, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article

@router.delete("/{article_id}")
def delete_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # In a real app, you'd check if the user has admin privileges
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
    return {"detail": "Article deleted"}

