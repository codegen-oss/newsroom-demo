#!/bin/bash

# Check if Modal CLI is installed
if ! command -v modal &> /dev/null
then
    echo "Modal CLI not found. Installing..."
    pip install modal
fi

# Set up Modal secrets if they don't exist
echo "Setting up Modal secrets..."

# Check if secrets exist
if ! modal secret list | grep -q "mongo-url"; then
    echo "Creating mongo-url secret..."
    read -p "Enter MongoDB URL: " mongo_url
    modal secret create mongo-url "$mongo_url"
fi

if ! modal secret list | grep -q "postgres-url"; then
    echo "Creating postgres-url secret..."
    read -p "Enter PostgreSQL URL: " postgres_url
    modal secret create postgres-url "$postgres_url"
fi

if ! modal secret list | grep -q "redis-url"; then
    echo "Creating redis-url secret..."
    read -p "Enter Redis URL: " redis_url
    modal secret create redis-url "$redis_url"
fi

if ! modal secret list | grep -q "jwt-secret"; then
    echo "Creating jwt-secret secret..."
    read -p "Enter JWT Secret Key: " jwt_secret
    modal secret create jwt-secret "$jwt_secret"
fi

if ! modal secret list | grep -q "news-api-key"; then
    echo "Creating news-api-key secret..."
    read -p "Enter News API Key: " news_api_key
    modal secret create news-api-key "$news_api_key"
fi

# Deploy the application
echo "Deploying application to Modal..."
modal deploy app.py

echo "Deployment complete!"

