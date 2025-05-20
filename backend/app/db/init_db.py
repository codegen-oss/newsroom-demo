import logging
from sqlalchemy.orm import Session

from app.db.session import Base, engine
from app.db import seed_data
from app.models import user, article, organization

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    # Seed initial data
    seed_data.create_initial_data(db)
    logger.info("Initial data seeded")

