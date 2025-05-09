#!/bin/bash

# Start the database services
echo "Starting database services..."
docker-compose up -d

# Wait for databases to be ready
echo "Waiting for databases to be ready..."
sleep 5

# Initialize the database
echo "Initializing database..."
python scripts/init_db.py

# Run the FastAPI application
echo "Starting FastAPI application..."
python app.py

