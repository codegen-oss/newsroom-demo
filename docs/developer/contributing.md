# Contributing Guide

This document provides guidelines for contributing to the News Room application.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Git

### Setting Up the Development Environment

1. Clone the repository:

```bash
git clone https://github.com/your-organization/newsroom-demo.git
cd newsroom-demo
```

2. Set up the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:

```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

The backend server will run at `http://localhost:8000`.

2. Start the frontend development server:

```bash
cd frontend
npm start
```

The frontend development server will run at `http://localhost:3000`.

## Development Workflow

### Branching Strategy

- `main`: The main branch containing stable code
- `develop`: Development branch for integrating features
- `feature/feature-name`: Feature branches for new features
- `bugfix/bug-name`: Bugfix branches for fixing issues

### Creating a New Feature

1. Create a new branch from `develop`:

```bash
git checkout develop
git pull
git checkout -b feature/your-feature-name
```

2. Implement your feature, following the coding standards
3. Write tests for your feature
4. Update documentation as needed
5. Commit your changes with descriptive commit messages

### Submitting a Pull Request

1. Push your branch to the remote repository:

```bash
git push -u origin feature/your-feature-name
```

2. Create a pull request to merge your branch into `develop`
3. Fill in the pull request template with details about your changes
4. Request a review from a team member
5. Address any feedback from the review

### Code Review Process

All code changes must be reviewed before merging:

1. Another developer will review your code
2. Automated tests will run on your pull request
3. Once approved and tests pass, your code can be merged

## Coding Standards

### Backend (Python)

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for all functions, classes, and modules
- Keep functions small and focused
- Use meaningful variable and function names

### Frontend (JavaScript/React)

- Follow the Airbnb JavaScript Style Guide
- Use functional components with hooks
- Use PropTypes for component props
- Keep components small and focused
- Use meaningful variable and function names

### Testing

- Write tests for all new features and bug fixes
- Maintain high test coverage
- Test both success and error cases
- Keep tests independent and isolated

## Documentation

Update documentation when making changes:

- Update API documentation for backend changes
- Update component documentation for frontend changes
- Update user documentation for user-facing changes
- Update this contributing guide if development processes change

## Commit Messages

Write clear, descriptive commit messages:

- Use the imperative mood ("Add feature" not "Added feature")
- Start with a capital letter
- Keep the first line under 50 characters
- Provide more details in the commit body if needed
- Reference issue numbers when applicable

Example:

```
Add article filtering by date

- Implement date range filter in the backend API
- Add date picker component in the frontend
- Update tests and documentation

Fixes #123
```

## Release Process

1. Merge feature branches into `develop`
2. Test the `develop` branch thoroughly
3. Create a release branch from `develop`
4. Perform final testing on the release branch
5. Merge the release branch into `main`
6. Tag the release with a version number
7. Deploy the new version

## Getting Help

If you need help with the contribution process:

- Check the existing documentation
- Ask questions in the project's communication channels
- Reach out to the project maintainers

Thank you for contributing to the News Room application!

