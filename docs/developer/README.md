# News Room Developer Documentation

This documentation provides technical details about the News Room Web App architecture, codebase structure, and development workflow.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Testing](#testing)
- [Development Workflow](#development-workflow)
- [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

The News Room Web App follows a client-server architecture:

- **Backend**: A RESTful API built with FastAPI that handles data storage, authentication, and business logic
- **Frontend**: A Next.js application that provides the user interface and interacts with the backend API
- **Database**: SQLite for local development (can be replaced with PostgreSQL for production)

## Technology Stack

### Backend

- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: pytest

### Frontend

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library, Cypress

## Project Structure

```
newsroom-demo/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── mock_data/
│   │   └── main.py
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── performance/
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── ...
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── public/
│   ├── __tests__/
│   │   ├── unit/
│   │   └── integration/
│   ├── cypress/
│   └── package.json
└── docs/
    ├── api/
    ├── user/
    ├── developer/
    └── deployment/
```

## Backend Development

### Setting Up the Backend

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run the development server:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

4. Access the API documentation at `http://localhost:8000/docs`

### Backend Code Structure

- **main.py**: Application entry point and configuration
- **auth/**: Authentication logic and JWT handling
- **database/**: Database connection and session management
- **models/**: SQLAlchemy ORM models
- **routers/**: API route handlers
- **schemas/**: Pydantic models for request/response validation
- **mock_data/**: Seed data for development

### Adding a New Endpoint

1. Define the schema in the appropriate file in `app/schemas/`
2. Create or update the model in `app/models/`
3. Add the endpoint to the appropriate router in `app/routers/`
4. Add tests for the new endpoint

Example of adding a new endpoint:

```python
# In app/schemas/comment.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    article_id: str
    
class CommentCreate(CommentBase):
    pass
    
class CommentResponse(CommentBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# In app/models/comment.py
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..database.database import Base
import uuid

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(String, nullable=False)
    article_id = Column(String, ForeignKey("articles.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())

# In app/routers/comments.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models.comment import Comment
from ..schemas.comment import CommentCreate, CommentResponse
from ..auth.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=CommentResponse)
async def create_comment(
    comment: CommentCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_comment = Comment(
        content=comment.content,
        article_id=comment.article_id,
        user_id=current_user.id
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

# In app/main.py
from .routers import comments

app.include_router(comments.router, prefix="/comments", tags=["Comments"])
```

## Frontend Development

### Setting Up the Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

### Frontend Code Structure

- **app/**: Next.js app router pages and layouts
- **components/**: Reusable React components
- **context/**: React context providers
- **lib/**: Utility functions and API clients
- **public/**: Static assets
- **__tests__/**: Jest tests
- **cypress/**: Cypress end-to-end tests

### Adding a New Component

1. Create the component file in `components/`
2. Write tests for the component in `__tests__/unit/components/`
3. Import and use the component in the appropriate page or parent component

Example of adding a new component:

```tsx
// In components/CommentForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createComment } from '../lib/api';

interface CommentFormProps {
  articleId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ articleId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createComment({ content, article_id: articleId }, token);
      setContent('');
      onCommentAdded();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Add a comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        type="submit"
        className="btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

// In __tests__/unit/components/CommentForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentForm from '../../../components/CommentForm';
import { useAuth } from '../../../context/AuthContext';
import { createComment } from '../../../lib/api';

// Mock dependencies
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../lib/api', () => ({
  createComment: jest.fn(),
}));

describe('CommentForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ token: 'fake-token' });
  });
  
  it('renders the comment form correctly', () => {
    render(<CommentForm articleId="123" onCommentAdded={() => {}} />);
    
    expect(screen.getByLabelText(/add a comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
  });
  
  it('validates empty comments', async () => {
    render(<CommentForm articleId="123" onCommentAdded={() => {}} />);
    
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/comment cannot be empty/i)).toBeInTheDocument();
    });
    
    expect(createComment).not.toHaveBeenCalled();
  });
  
  it('submits the comment successfully', async () => {
    const mockOnCommentAdded = jest.fn();
    (createComment as jest.Mock).mockResolvedValueOnce({});
    
    render(<CommentForm articleId="123" onCommentAdded={mockOnCommentAdded} />);
    
    fireEvent.change(screen.getByLabelText(/add a comment/i), {
      target: { value: 'This is a test comment' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));
    
    await waitFor(() => {
      expect(createComment).toHaveBeenCalledWith(
        { content: 'This is a test comment', article_id: '123' },
        'fake-token'
      );
    });
    
    expect(mockOnCommentAdded).toHaveBeenCalled();
    expect(screen.getByLabelText(/add a comment/i)).toHaveValue('');
  });
  
  it('handles submission errors', async () => {
    (createComment as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    
    render(<CommentForm articleId="123" onCommentAdded={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/add a comment/i), {
      target: { value: 'This is a test comment' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to post comment/i)).toBeInTheDocument();
    });
  });
});
```

## Database Schema

### Users Table

```
User {
  id: UUID,
  email: String,
  password_hash: String,
  display_name: String,
  subscription_tier: Enum['free', 'individual', 'organization'],
  created_at: DateTime,
  preferences: JSON
}
```

### UserInterests Table

```
UserInterest {
  id: UUID,
  user_id: UUID,
  categories: JSON,
  regions: JSON,
  topics: JSON
}
```

### Articles Table

```
Article {
  id: UUID,
  title: String,
  content: String,
  summary: String,
  source: String,
  source_url: String,
  author: String,
  published_at: DateTime,
  categories: JSON,
  access_tier: Enum['free', 'premium', 'organization'],
  featured_image: String
}
```

### Organizations Table

```
Organization {
  id: UUID,
  name: String,
  subscription: JSON,
  created_at: DateTime
}
```

### OrganizationMembers Table

```
OrganizationMember {
  id: UUID,
  organization_id: UUID,
  user_id: UUID,
  role: Enum['admin', 'member']
}
```

## Authentication

The News Room Web App uses JWT (JSON Web Tokens) for authentication:

1. The user logs in with email and password
2. The server validates the credentials and returns a JWT token
3. The frontend stores the token in localStorage
4. The token is included in the Authorization header for all API requests
5. The server validates the token for each protected endpoint

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user@example.com",  // Subject (user email)
  "exp": 1634567890,          // Expiration time
  "iat": 1634564290           // Issued at time
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
```

## Testing

### Backend Testing

The backend uses pytest for unit, integration, and performance testing:

- **Unit Tests**: Test individual functions and endpoints in isolation
- **Integration Tests**: Test API flows and interactions between components
- **Performance Tests**: Test endpoint response times and throughput

To run backend tests:

```bash
cd backend
pytest
```

To run specific test categories:

```bash
pytest tests/unit/
pytest tests/integration/
pytest tests/performance/
```

### Frontend Testing

The frontend uses Jest and React Testing Library for unit and integration tests, and Cypress for end-to-end tests:

- **Unit Tests**: Test individual components and utility functions
- **Integration Tests**: Test component interactions and page flows
- **End-to-End Tests**: Test complete user flows in a browser environment

To run frontend tests:

```bash
cd frontend
npm test           # Run Jest tests
npm run cypress    # Run Cypress tests in browser
npm run cypress:headless  # Run Cypress tests headlessly
```

## Development Workflow

### Git Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. After review and approval, merge the pull request into `main`

### Code Style and Linting

- **Backend**: Follow PEP 8 guidelines
- **Frontend**: Follow the ESLint and Prettier configuration

To lint the frontend code:

```bash
cd frontend
npm run lint
```

### Continuous Integration

The project uses GitHub Actions for continuous integration:

- Run tests on pull requests
- Lint code on pull requests
- Build and deploy on merges to `main`

## Contributing Guidelines

### Pull Request Process

1. Ensure your code passes all tests and linting
2. Update documentation if necessary
3. Include tests for new features or bug fixes
4. Get at least one code review before merging
5. Update the CHANGELOG.md file with your changes

### Code Review Checklist

- Does the code follow the project's style guidelines?
- Are there appropriate tests for the changes?
- Is the documentation updated?
- Are there any security concerns?
- Is the code efficient and maintainable?

### Reporting Issues

When reporting issues, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or error messages
- Environment information (browser, OS, etc.)

