from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL
# In production, this should be set via environment variables
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "sqlite:///./newsroom.db"
)

# Create SQLAlchemy engine
# For SQLite, connect_args is needed to allow multiple threads
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

# Create a SessionLocal class
# Each instance of this class will be a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class
# This class will be inherited by all models
Base = declarative_base()

