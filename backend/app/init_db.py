from app.database.database import engine, SessionLocal
from app.models import models
from app.utils.mock_data import create_mock_data

def init_db():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    # Create session
    db = SessionLocal()
    
    # Create mock data
    result = create_mock_data(db)
    
    # Close session
    db.close()
    
    return result

if __name__ == "__main__":
    print(init_db())

