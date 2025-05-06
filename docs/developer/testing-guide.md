# Testing Guide

This document provides guidelines for testing the News Room application, including both backend and frontend testing.

## Overview

The News Room application uses a comprehensive testing approach:

- **Backend**: pytest for unit and integration tests
- **Frontend**: Jest and React Testing Library for component and integration tests

## Backend Testing

### Setup

Backend tests are located in the `backend/tests` directory. The testing framework uses:

- **pytest**: The main testing framework
- **TestClient**: FastAPI's testing client for API requests
- **SQLite in-memory database**: For isolated test data

### Running Backend Tests

To run all backend tests:

```bash
cd backend
pytest
```

To run specific test files:

```bash
pytest tests/test_articles.py
```

To run tests with verbose output:

```bash
pytest -v
```

### Test Structure

Backend tests are organized as follows:

- `conftest.py`: Contains fixtures for database setup, test client, and test data
- `test_articles.py`: Tests for article-related endpoints
- `test_categories.py`: Tests for category-related endpoints

### Test Fixtures

The main fixtures defined in `conftest.py` are:

- `test_db`: Creates an in-memory SQLite database for testing
- `client`: Creates a FastAPI TestClient with the test database
- `test_category`: Creates a test category
- `test_article`: Creates a test article with a category

### Writing Backend Tests

When writing backend tests:

1. Use the provided fixtures for database and client setup
2. Test both successful and error cases
3. Verify response status codes and content
4. Test all CRUD operations for each resource
5. Test relationships between resources

Example test:

```python
def test_get_article(client, test_article):
    """Test getting a specific article by ID."""
    response = client.get(f"/articles/{test_article.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Article"
    # Additional assertions...
```

## Frontend Testing

### Setup

Frontend tests are located in the `frontend/src` directory, alongside the components and pages they test. The testing framework uses:

- **Jest**: The main testing framework
- **React Testing Library**: For rendering and interacting with components
- **Mock Service Worker (future)**: For mocking API requests

### Running Frontend Tests

To run all frontend tests:

```bash
cd frontend
npm test
```

To run tests in watch mode:

```bash
npm test -- --watch
```

To run tests with coverage:

```bash
npm test -- --coverage
```

### Test Structure

Frontend tests are organized in `__tests__` directories:

- `src/components/__tests__/`: Tests for reusable components
- `src/pages/__tests__/`: Tests for page components

### Writing Frontend Tests

When writing frontend tests:

1. Focus on user behavior, not implementation details
2. Test component rendering and interactions
3. Mock API calls and external dependencies
4. Test both successful and error states
5. Verify that components respond correctly to props and state changes

Example test:

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleCard from '../ArticleCard';

test('renders article title as a link', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article',
    // Additional properties...
  };
  
  render(
    <BrowserRouter>
      <ArticleCard article={mockArticle} />
    </BrowserRouter>
  );
  
  const titleElement = screen.getByText('Test Article');
  expect(titleElement).toBeInTheDocument();
  expect(titleElement.closest('a')).toHaveAttribute('href', '/articles/1');
});
```

## Integration Testing

Integration tests verify that the frontend and backend work together correctly. These tests:

- Test the complete user flow
- Verify that API responses are correctly handled by the frontend
- Test error handling and edge cases

Integration tests can be implemented using:

- End-to-end testing tools like Cypress or Playwright
- API tests combined with frontend component tests

## Test Coverage

Aim for high test coverage, especially for critical functionality:

- Backend: Use pytest-cov to measure coverage
- Frontend: Use Jest's built-in coverage reporting

## Continuous Integration

Set up continuous integration to run tests automatically:

- Run tests on every pull request
- Enforce minimum test coverage
- Prevent merging if tests fail

## Best Practices

- Write tests before or alongside code (TDD approach)
- Keep tests simple and focused
- Use descriptive test names
- Test edge cases and error conditions
- Avoid testing implementation details
- Keep tests independent and isolated
- Use fixtures and factories for test data
- Clean up after tests

