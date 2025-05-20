from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import models
import schemas
import auth
from database import engine, get_db
import json
import os
from typing import List

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="News Room API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# User endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        display_name=user.display_name,
        subscription_tier=user.subscription_tier,
        preferences=user.preferences
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@app.put("/users/me/", response_model=schemas.User)
async def update_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if user_update.email is not None:
        current_user.email = user_update.email
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.subscription_tier is not None:
        current_user.subscription_tier = user_update.subscription_tier
    if user_update.preferences is not None:
        current_user.preferences = user_update.preferences
    
    db.commit()
    db.refresh(current_user)
    return current_user

# User Interest endpoints
@app.post("/user-interests/", response_model=schemas.UserInterest)
async def create_user_interest(
    interest: schemas.UserInterestCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Ensure the user can only create interests for themselves
    if interest.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to create interests for other users")
    
    db_interest = models.UserInterest(
        user_id=interest.user_id,
        categories=interest.categories,
        regions=interest.regions,
        topics=interest.topics
    )
    db.add(db_interest)
    db.commit()
    db.refresh(db_interest)
    return db_interest

@app.get("/user-interests/me/", response_model=List[schemas.UserInterest])
async def read_user_interests(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    interests = db.query(models.UserInterest).filter(models.UserInterest.user_id == current_user.id).all()
    return interests

# Article endpoints
@app.get("/articles/", response_model=List[schemas.Article])
async def read_articles(
    skip: int = 0, 
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Filter articles based on user's subscription tier
    if current_user.subscription_tier == models.SubscriptionTier.FREE:
        articles = db.query(models.Article).filter(
            models.Article.access_tier == models.AccessTier.FREE
        ).offset(skip).limit(limit).all()
    elif current_user.subscription_tier == models.SubscriptionTier.INDIVIDUAL:
        articles = db.query(models.Article).filter(
            models.Article.access_tier.in_([models.AccessTier.FREE, models.AccessTier.PREMIUM])
        ).offset(skip).limit(limit).all()
    else:  # ORGANIZATION tier
        articles = db.query(models.Article).offset(skip).limit(limit).all()
    
    return articles

@app.get("/articles/{article_id}", response_model=schemas.Article)
async def read_article(
    article_id: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check if user has access to this article
    if article.access_tier == models.AccessTier.PREMIUM and current_user.subscription_tier == models.SubscriptionTier.FREE:
        raise HTTPException(status_code=403, detail="Premium content requires a paid subscription")
    
    if article.access_tier == models.AccessTier.ORGANIZATION and current_user.subscription_tier != models.SubscriptionTier.ORGANIZATION:
        raise HTTPException(status_code=403, detail="Organization content requires an organization subscription")
    
    return article

# Organization endpoints
@app.post("/organizations/", response_model=schemas.Organization)
async def create_organization(
    org: schemas.OrganizationCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Only users with INDIVIDUAL or ORGANIZATION tier can create organizations
    if current_user.subscription_tier == models.SubscriptionTier.FREE:
        raise HTTPException(status_code=403, detail="Free tier users cannot create organizations")
    
    db_org = models.Organization(
        name=org.name,
        subscription=org.subscription
    )
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    
    # Add the creator as an admin member
    db_member = models.OrganizationMember(
        organization_id=db_org.id,
        user_id=current_user.id,
        role=models.OrganizationRole.ADMIN
    )
    db.add(db_member)
    db.commit()
    
    return db_org

@app.get("/organizations/", response_model=List[schemas.Organization])
async def read_user_organizations(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get all organizations the user is a member of
    memberships = db.query(models.OrganizationMember).filter(
        models.OrganizationMember.user_id == current_user.id
    ).all()
    
    org_ids = [membership.organization_id for membership in memberships]
    organizations = db.query(models.Organization).filter(
        models.Organization.id.in_(org_ids)
    ).all()
    
    return organizations

# Seed data endpoint (for development only)
@app.post("/seed-data/")
async def seed_data(db: Session = Depends(get_db)):
    # Check if data already exists
    if db.query(models.Article).count() > 0:
        return {"message": "Data already seeded"}
    
    # Create sample articles
    sample_articles = [
        {
            "title": "Global Economic Outlook 2025",
            "content": "Detailed analysis of global economic trends for the coming year...",
            "summary": "A comprehensive look at what to expect in the global economy in 2025.",
            "source": "Economic Times",
            "source_url": "https://example.com/economic-outlook-2025",
            "author": "Jane Smith",
            "categories": ["economy", "global"],
            "access_tier": "free",
            "featured_image": "https://example.com/images/economy2025.jpg"
        },
        {
            "title": "New Technological Breakthroughs in AI",
            "content": "Recent advancements in artificial intelligence are reshaping industries...",
            "summary": "How the latest AI technologies are transforming business and society.",
            "source": "Tech Insider",
            "source_url": "https://example.com/ai-breakthroughs",
            "author": "John Doe",
            "categories": ["technology", "ai"],
            "access_tier": "premium",
            "featured_image": "https://example.com/images/ai-tech.jpg"
        },
        {
            "title": "Geopolitical Tensions in Southeast Asia",
            "content": "Analysis of the growing tensions between major powers in Southeast Asia...",
            "summary": "Understanding the complex geopolitical landscape in Southeast Asia.",
            "source": "World Politics Review",
            "source_url": "https://example.com/southeast-asia-tensions",
            "author": "Robert Chen",
            "categories": ["geopolitics", "asia"],
            "access_tier": "organization",
            "featured_image": "https://example.com/images/sea-map.jpg"
        }
    ]
    
    for article_data in sample_articles:
        article = models.Article(
            title=article_data["title"],
            content=article_data["content"],
            summary=article_data["summary"],
            source=article_data["source"],
            source_url=article_data["source_url"],
            author=article_data["author"],
            categories=article_data["categories"],
            access_tier=article_data["access_tier"],
            featured_image=article_data["featured_image"]
        )
        db.add(article)
    
    db.commit()
    return {"message": "Sample data seeded successfully"}

@app.get("/")
async def root():
    return {"message": "Welcome to the News Room API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

