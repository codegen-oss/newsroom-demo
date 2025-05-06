from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from app.database.database import get_db
from app.models import models
from app.schemas.article import Article, ArticleCreate, ArticleUpdate, PaginatedArticles, Category, CategoryCreate
from app.utils.access_control import get_current_active_user, check_article_access
from app.utils.search import search_articles

router = APIRouter(tags=["articles"])

# Category endpoints
@router.post("/categories/", response_model=Category, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # In a real app, check if user has admin privileges
    db_category = models.Category(name=category.name, description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories/", response_model=List[Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

# Article endpoints
@router.post("/articles/", response_model=Article, status_code=status.HTTP_201_CREATED)
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # In a real app, check if user has author privileges
    db_article = models.Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.get("/articles/", response_model=PaginatedArticles)
def get_articles(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_active_user),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    category_id: Optional[int] = None,
    access_tier: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search_query: Optional[str] = None,
    sort_by: Optional[str] = "published_date",
    sort_order: Optional[str] = "desc"
):
    # Base query
    query = db.query(models.Article)
    
    # Apply filters
    if category_id:
        query = query.filter(models.Article.category_id == category_id)
    
    # Filter by access tier based on user's subscription
    max_access_tier = current_user.subscription_tier if current_user else 0
    if access_tier is not None:
        # If specific access tier is requested, it must be <= user's tier
        if access_tier > max_access_tier:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You don't have access to tier {access_tier} articles"
            )
        query = query.filter(models.Article.access_tier == access_tier)
    else:
        # Otherwise, show all articles up to user's tier
        query = query.filter(models.Article.access_tier <= max_access_tier)
    
    # Date range filter
    if start_date:
        query = query.filter(models.Article.published_date >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.filter(models.Article.published_date <= datetime.combine(end_date, datetime.max.time()))
    
    # Search functionality
    if search_query:
        search_results = search_articles(db, search_query, category_id, max_access_tier)
        query = search_results
    
    # Only show published articles
    query = query.filter(models.Article.is_published == True)
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply sorting
    if sort_by == "title":
        query = query.order_by(models.Article.title.asc() if sort_order == "asc" else models.Article.title.desc())
    else:  # Default to published_date
        query = query.order_by(models.Article.published_date.asc() if sort_order == "asc" else models.Article.published_date.desc())
    
    # Apply pagination
    query = query.offset((page - 1) * page_size).limit(page_size)
    
    # Return paginated response
    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "items": query.all()
    }

@router.get("/articles/{article_id}", response_model=Article)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_active_user)
):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check if user has access to this article
    if not check_article_access(article, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This article requires a higher subscription tier"
        )
    
    return article

@router.put("/articles/{article_id}", response_model=Article)
def update_article(
    article_id: int,
    article_update: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # In a real app, check if user has author/editor privileges
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Update article fields
    update_data = article_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_article, key, value)
    
    db.commit()
    db.refresh(db_article)
    return db_article

@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # In a real app, check if user has author/editor privileges
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
    return None

# Search endpoint
@router.get("/articles/search/", response_model=PaginatedArticles)
def search_articles_endpoint(
    query: str,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_active_user),
    category_id: Optional[int] = None,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page")
):
    # Get user's subscription tier (0 if not logged in)
    access_tier = current_user.subscription_tier if current_user else 0
    
    # Search articles
    search_results = search_articles(db, query, category_id, access_tier)
    
    # Get total count before pagination
    total_count = search_results.count()
    
    # Apply pagination
    paginated_results = search_results.offset((page - 1) * page_size).limit(page_size).all()
    
    # Return paginated response
    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "items": paginated_results
    }

