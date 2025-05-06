from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from . import models, schemas, crud
from .database import engine, SessionLocal, Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="News Room API",
    description="API for the News Room application",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Article endpoints
@app.get("/articles", response_model=List[schemas.Article])
def read_articles(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Get all articles with pagination.
    """
    articles = crud.get_articles(db, skip=skip, limit=limit)
    return articles

@app.get("/articles/{article_id}", response_model=schemas.Article)
def read_article(article_id: int, db: Session = Depends(get_db)):
    """
    Get a specific article by ID.
    """
    article = crud.get_article(db, article_id=article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@app.post("/articles", response_model=schemas.Article, status_code=status.HTTP_201_CREATED)
def create_article(
    article: schemas.ArticleCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a new article.
    """
    return crud.create_article(db=db, article=article)

@app.put("/articles/{article_id}", response_model=schemas.Article)
def update_article(
    article_id: int, 
    article: schemas.ArticleUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update an existing article.
    """
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return crud.update_article(db=db, article_id=article_id, article=article)

@app.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(article_id: int, db: Session = Depends(get_db)):
    """
    Delete an article.
    """
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    crud.delete_article(db=db, article_id=article_id)
    return None

# Category endpoints
@app.get("/categories", response_model=List[schemas.Category])
def read_categories(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Get all categories with pagination.
    """
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

@app.get("/categories/{category_id}", response_model=schemas.Category)
def read_category(category_id: int, db: Session = Depends(get_db)):
    """
    Get a specific category by ID.
    """
    category = crud.get_category(db, category_id=category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@app.post("/categories", response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def create_category(
    category: schemas.CategoryCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a new category.
    """
    db_category = crud.get_category_by_name(db, name=category.name)
    if db_category:
        raise HTTPException(
            status_code=400, 
            detail=f"Category with name '{category.name}' already exists"
        )
    return crud.create_category(db=db, category=category)

@app.get("/categories/{category_id}/articles", response_model=List[schemas.Article])
def read_category_articles(
    category_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Get all articles in a specific category.
    """
    category = crud.get_category(db, category_id=category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return crud.get_category_articles(db, category_id=category_id, skip=skip, limit=limit)

# Root endpoint
@app.get("/")
def read_root():
    """
    Root endpoint with API information.
    """
    return {
        "name": "News Room API",
        "version": "1.0.0",
        "documentation": "/docs",
    }

