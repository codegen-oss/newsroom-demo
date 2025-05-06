# News Room Backend

This is the backend for the News Room application, built with FastAPI.

## Features

- RESTful API for managing news articles and categories
- OpenAPI/Swagger documentation
- SQLAlchemy ORM for database operations
- Comprehensive testing with pytest

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-organization/newsroom-demo.git
cd newsroom-demo/backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Server

Start the development server:

```bash
uvicorn app.main:app --reload
```

The server will run at `http://localhost:8000`.

### API Documentation

Once the server is running, you can access the OpenAPI documentation at:

```
http://localhost:8000/docs
```

## Testing

Run the tests:

```bash
pytest
```

Run tests with coverage:

```bash
pytest --cov=app
```

## Project Structure

- `app/`: Main application package
  - `main.py`: FastAPI application entry point
  - `database.py`: Database connection and session management
  - `models.py`: SQLAlchemy models
  - `schemas.py`: Pydantic schemas for request/response validation
  - `crud.py`: Database operations
- `tests/`: Test package
  - `conftest.py`: Test fixtures and configuration
  - `test_articles.py`: Tests for article endpoints
  - `test_categories.py`: Tests for category endpoints

## API Endpoints

- `GET /articles`: Get all articles
- `GET /articles/{article_id}`: Get a specific article
- `POST /articles`: Create a new article
- `PUT /articles/{article_id}`: Update an article
- `DELETE /articles/{article_id}`: Delete an article
- `GET /categories`: Get all categories
- `GET /categories/{category_id}`: Get a specific category
- `POST /categories`: Create a new category
- `GET /categories/{category_id}/articles`: Get articles in a category

For more details, see the API documentation.

