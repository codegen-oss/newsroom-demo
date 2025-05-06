import logging
from sqlalchemy.orm import Session

from app.database.session import SessionLocal, engine
from app.models import models
from app.utils.mock_data import create_mock_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    db = SessionLocal()
    try:
        # Create tables
        models.Base.metadata.create_all(bind=engine)
        logger.info("Created database tables")
        
        # Create mock data
        result = create_mock_data(db)
        logger.info(f"Created mock data: {result}")
    finally:
        db.close()

def main() -> None:
    logger.info("Creating initial data")
    init_db()
    logger.info("Initial data created")

if __name__ == "__main__":
    main()

