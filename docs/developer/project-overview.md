# Project Overview

This document provides a high-level overview of the News Room application architecture, technologies, and project structure.

## Application Purpose

News Room is a web application for publishing and browsing news articles. It allows users to:

- Browse articles by category
- Read full article content
- Filter and search for specific articles
- (Future) User accounts with saved articles and preferences

## Technology Stack

### Backend

- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM with SQLite (development) / PostgreSQL (production)
- **API Documentation**: OpenAPI/Swagger via FastAPI's built-in support
- **Testing**: pytest for unit and integration tests

### Frontend

- **Framework**: React.js
- **Routing**: React Router
- **HTTP Client**: Axios
- **Testing**: Jest and React Testing Library

## Project Structure

The project follows a standard structure with separate backend and frontend directories:

```
newsroom-demo/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── database.py      # Database connection and session management
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas for request/response validation
│   │   └── crud.py          # Database operations
│   ├── tests/               # Backend tests
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main React component
│   │   └── index.js         # React entry point
│   ├── package.json         # Node.js dependencies
│   └── README.md            # Frontend documentation
└── docs/                    # Project documentation
    ├── user/                # User documentation
    ├── developer/           # Developer documentation
    └── api/                 # API documentation
```

## Development Workflow

1. **Setup**: Clone the repository and install dependencies for both backend and frontend
2. **Backend Development**: Run the FastAPI server in development mode
3. **Frontend Development**: Run the React development server
4. **Testing**: Run tests for both backend and frontend
5. **Documentation**: Update documentation as needed

## Key Concepts

### Articles

The core content type in the application. Articles have:

- Title, content, and optional summary
- Author information
- Publication and update dates
- Categories (many-to-many relationship)

### Categories

Used to organize articles by topic. Categories have:

- Name and optional description
- Associated articles

## API Design

The API follows RESTful principles with endpoints for:

- Articles: CRUD operations
- Categories: CRUD operations
- Filtering and searching

All API endpoints are documented using OpenAPI/Swagger and accessible via the `/docs` endpoint when running the backend server.

## Testing Strategy

- **Backend**: Unit tests for models and services, integration tests for API endpoints
- **Frontend**: Unit tests for components, integration tests for pages and user flows

## Future Enhancements

Planned features for future development:

- User authentication and profiles
- Comments on articles
- Rich text editor for article content
- Image uploads and management
- Advanced search functionality
- Performance optimizations

