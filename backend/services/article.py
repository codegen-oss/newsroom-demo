from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import math
from ..models.article import Article, Category, Tag, AccessTier
from ..schemas.article import ArticleCreate, ArticleUpdate

def get_article(db: Session, article_id: str):
    return db.query(Article).filter(Article.id == article_id).first()

def get_articles(
    db: Session, 
    skip: int = 0, 
    limit: int = 10,
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    tag_id: Optional[str] = None,
    access_tier: Optional[AccessTier] = None
):
    query = db.query(Article)
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Article.title.ilike(search_term),
                Article.content.ilike(search_term),
                Article.summary.ilike(search_term)
            )
        )
    
    if category_id:
        query = query.join(Article.categories).filter(Category.id == category_id)
    
    if tag_id:
        query = query.join(Article.tags).filter(Tag.id == tag_id)
    
    if access_tier:
        query = query.filter(Article.access_tier == access_tier)
    
    # Get total count for pagination
    total = query.count()
    
    # Apply pagination
    articles = query.order_by(Article.published_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "items": articles,
        "total": total,
        "page": skip // limit + 1,
        "size": limit,
        "pages": math.ceil(total / limit) if total > 0 else 1
    }

def create_article(db: Session, article: ArticleCreate):
    # Create article
    db_article = Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        source=article.source,
        source_url=article.source_url,
        author=article.author,
        featured_image=article.featured_image,
        access_tier=article.access_tier
    )
    
    # Add categories
    if article.category_ids:
        categories = db.query(Category).filter(Category.id.in_(article.category_ids)).all()
        db_article.categories = categories
    
    # Add tags
    if article.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(article.tag_ids)).all()
        db_article.tags = tags
    
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def update_article(db: Session, article_id: str, article: ArticleUpdate):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    
    if not db_article:
        return None
    
    # Update article fields
    update_data = article.dict(exclude_unset=True)
    
    # Handle category and tag IDs separately
    category_ids = update_data.pop("category_ids", None)
    tag_ids = update_data.pop("tag_ids", None)
    
    # Update article attributes
    for key, value in update_data.items():
        setattr(db_article, key, value)
    
    # Update categories if provided
    if category_ids is not None:
        categories = db.query(Category).filter(Category.id.in_(category_ids)).all()
        db_article.categories = categories
    
    # Update tags if provided
    if tag_ids is not None:
        tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
        db_article.tags = tags
    
    db.commit()
    db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: str):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    
    if not db_article:
        return False
    
    db.delete(db_article)
    db.commit()
    return True

# Category services
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Category).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: str):
    return db.query(Category).filter(Category.id == category_id).first()

def get_category_by_name(db: Session, name: str):
    return db.query(Category).filter(Category.name == name).first()

def create_category(db: Session, name: str, description: Optional[str] = None):
    db_category = Category(name=name, description=description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: str):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    
    if not db_category:
        return False
    
    db.delete(db_category)
    db.commit()
    return True

# Tag services
def get_tags(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Tag).offset(skip).limit(limit).all()

def get_tag(db: Session, tag_id: str):
    return db.query(Tag).filter(Tag.id == tag_id).first()

def get_tag_by_name(db: Session, name: str):
    return db.query(Tag).filter(Tag.name == name).first()

def create_tag(db: Session, name: str):
    db_tag = Tag(name=name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def delete_tag(db: Session, tag_id: str):
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    
    if not db_tag:
        return False
    
    db.delete(db_tag)
    db.commit()
    return True

