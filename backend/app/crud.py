from sqlalchemy.orm import Session
from typing import List, Optional

from . import models, schemas

# Article CRUD operations
def get_article(db: Session, article_id: int):
    """
    Get a specific article by ID.
    """
    return db.query(models.Article).filter(models.Article.id == article_id).first()

def get_articles(db: Session, skip: int = 0, limit: int = 100):
    """
    Get all articles with pagination.
    """
    return db.query(models.Article).order_by(models.Article.published_date.desc()).offset(skip).limit(limit).all()

def create_article(db: Session, article: schemas.ArticleCreate):
    """
    Create a new article.
    """
    # Create article instance
    db_article = models.Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        author=article.author,
    )
    
    # Add article to database
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    
    # Add categories if provided
    if article.category_ids:
        categories = db.query(models.Category).filter(models.Category.id.in_(article.category_ids)).all()
        db_article.categories = categories
        db.commit()
        db.refresh(db_article)
    
    return db_article

def update_article(db: Session, article_id: int, article: schemas.ArticleUpdate):
    """
    Update an existing article.
    """
    # Get article from database
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    
    # Update article fields
    if article.title is not None:
        db_article.title = article.title
    if article.content is not None:
        db_article.content = article.content
    if article.summary is not None:
        db_article.summary = article.summary
    if article.author is not None:
        db_article.author = article.author
    
    # Update categories if provided
    if article.category_ids is not None:
        categories = db.query(models.Category).filter(models.Category.id.in_(article.category_ids)).all()
        db_article.categories = categories
    
    # Commit changes
    db.commit()
    db.refresh(db_article)
    
    return db_article

def delete_article(db: Session, article_id: int):
    """
    Delete an article.
    """
    # Get article from database
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    
    # Delete article
    db.delete(db_article)
    db.commit()
    
    return None

# Category CRUD operations
def get_category(db: Session, category_id: int):
    """
    Get a specific category by ID.
    """
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_category_by_name(db: Session, name: str):
    """
    Get a specific category by name.
    """
    return db.query(models.Category).filter(models.Category.name == name).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    """
    Get all categories with pagination.
    """
    return db.query(models.Category).order_by(models.Category.name).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    """
    Create a new category.
    """
    # Create category instance
    db_category = models.Category(
        name=category.name,
        description=category.description,
    )
    
    # Add category to database
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

def get_category_articles(db: Session, category_id: int, skip: int = 0, limit: int = 100):
    """
    Get all articles in a specific category.
    """
    # Get category from database
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    
    # Return articles in category
    return db_category.articles[skip:skip + limit]

