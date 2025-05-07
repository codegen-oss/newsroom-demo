# News Room Web App

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Overview

The News Room Web App is a modern news aggregation platform that provides users with access to news articles across various categories. The application features tiered access levels (free, premium, and organization) and a sleek, futuristic design.

## Features

- User authentication and profile management
- News feed with categorized articles
- Tiered access control for content
- Organization management for team access
- Responsive design for all devices

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLAlchemy with SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens
- **Testing**: pytest for unit, integration, and performance testing

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library, and Cypress

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/codegen-oss/newsroom-demo.git
   cd newsroom-demo
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Run the development server:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

5. The API will be available at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`
   - ReDoc documentation: `http://localhost:8000/redoc`

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. The frontend will be available at `http://localhost:3000`

## Testing

### Backend Testing

The backend includes comprehensive tests using pytest:

1. Run all tests:
   ```bash
   cd backend
   pytest
   ```

2. Run specific test categories:
   ```bash
   pytest tests/unit/          # Unit tests
   pytest tests/integration/   # Integration tests
   pytest tests/performance/   # Performance tests
   ```

3. Run tests with coverage:
   ```bash
   pytest --cov=app tests/
   ```

### Frontend Testing

The frontend includes tests using Jest, React Testing Library, and Cypress:

1. Run Jest tests:
   ```bash
   cd frontend
   npm test
   ```

2. Run Jest tests with coverage:
   ```bash
   npm run test:coverage
   ```

3. Run Cypress tests:
   ```bash
   npm run cypress
   ```

4. Run Cypress tests headlessly:
   ```bash
   npm run cypress:headless
   ```

## Documentation

The project includes comprehensive documentation:

- **API Documentation**: Available at `/docs` and `/redoc` endpoints when the backend is running
- **User Guide**: Available in the `docs/user/` directory
- **Developer Documentation**: Available in the `docs/developer/` directory
- **Deployment Guide**: Available in the `docs/deployment/` directory

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
├── docs/
│   ├── api/
│   ├── user/
│   ├── developer/
│   └── deployment/
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
