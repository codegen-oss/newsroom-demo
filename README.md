# News Room

News Room is a web application for publishing and browsing news articles. It consists of a FastAPI backend and a React frontend.

## Features

- Browse and read news articles
- Filter articles by category
- RESTful API with OpenAPI/Swagger documentation
- Comprehensive testing for both backend and frontend
- Detailed user and developer documentation

## Project Structure

- `backend/`: FastAPI backend application
- `frontend/`: React frontend application
- `docs/`: Project documentation

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Git

### Setting Up the Backend

1. Navigate to the backend directory:

```bash
cd backend
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

4. Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend server will run at `http://localhost:8000`.

### Setting Up the Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm start
```

The frontend development server will run at `http://localhost:3000`.

## Documentation

- User documentation: `docs/user/`
- Developer documentation: `docs/developer/`
- API documentation: `docs/api/`

When the backend server is running, you can also access the interactive API documentation at `http://localhost:8000/docs`.

## Testing

### Backend Tests

Run the backend tests:

```bash
cd backend
pytest
```

### Frontend Tests

Run the frontend tests:

```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

