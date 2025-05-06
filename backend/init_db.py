import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models import Base
from backend.utils.auth import get_password_hash
from backend.models import User

# Database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./newsroom.db"

# Create engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize the database with tables and sample data"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Check if we already have users
        user_count = db.query(User).count()
        
        if user_count == 0:
            print("Creating sample user...")
            
            # Create a sample user
            sample_user = User(
                email="user@example.com",
                password_hash=get_password_hash("password123"),
                display_name="Sample User",
                subscription_tier="free",
                preferences={"theme": "light", "notifications": True}
            )
            
            db.add(sample_user)
            db.commit()
            
            print(f"Sample user created with email: {sample_user.email}")
        else:
            print(f"Database already contains {user_count} users. Skipping sample data creation.")
    
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization completed.")

