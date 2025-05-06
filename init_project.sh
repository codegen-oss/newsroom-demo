#!/bin/bash

# Create backend virtual environment
echo "Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Seed database
echo "Seeding database with sample data..."
python seed_data.py

# Deactivate virtual environment
deactivate

# Install frontend dependencies
echo "Setting up frontend..."
cd ../frontend
npm install

echo "Setup complete!"
echo "To start the backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "To start the frontend: cd frontend && npm run dev"

