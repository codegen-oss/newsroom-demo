# Newsroom Demo

A modern, full-stack web application for managing and displaying news articles. This project demonstrates best practices in web development using FastAPI for the backend and Next.js for the frontend.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Article Management**: Create, edit, and publish news articles
- **Organization System**: Manage content across different organizations
- **News Feed**: Personalized news feed based on user preferences
- **Responsive UI**: Modern interface that works on all devices

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation and settings management
- **JWT Authentication**: Secure token-based authentication

### Frontend
- **Next.js**: React framework for production
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Axios**: Promise-based HTTP client

## 📁 Project Structure

```
newsroom-demo/
├── backend/           # FastAPI backend
│   ├── api/           # API routes and endpoints
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
│
└── frontend/          # Next.js frontend
    ├── components/    # Reusable UI components
    ├── contexts/      # React Context API
    ├── pages/         # Next.js pages
    ├── public/        # Static assets
    └── styles/        # CSS and Tailwind config
```

## 🚦 Getting Started

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🧪 Testing

Both the backend and frontend include comprehensive test suites:

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

This project is a demonstration of modern web development practices and is not intended for production use.

