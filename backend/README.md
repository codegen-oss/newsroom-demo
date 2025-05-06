# News Room Backend

This is the backend for the News Room application, featuring a complete user authentication system built with FastAPI.

## Features

- User registration and login
- JWT token authentication
- Password hashing and verification
- User profile management
- Password reset functionality

## Technical Stack

- FastAPI: Modern, fast web framework for building APIs
- SQLAlchemy: SQL toolkit and ORM
- Pydantic: Data validation and settings management
- Python-jose: JWT token handling
- Passlib: Password hashing
- SQLite: Database

## Setup and Installation

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   python run.py
   ```

3. Access the API documentation:
   ```
   http://localhost:8000/docs
   ```

## API Endpoints

### Authentication

- `POST /api/register`: Register a new user
- `POST /api/token`: Login and get access token

### User Management

- `GET /api/users/me`: Get current user profile
- `PUT /api/users/me`: Update current user profile

### Password Reset

- `POST /api/password-reset/request`: Request password reset
- `POST /api/password-reset/confirm`: Reset password with token

## Development

The application structure follows modern FastAPI practices:

- `app/main.py`: Main application entry point
- `app/database.py`: Database connection setup
- `app/models/`: SQLAlchemy models
- `app/schemas/`: Pydantic schemas for request/response validation
- `app/routes/`: API route handlers
- `app/utils/`: Utility functions including security

