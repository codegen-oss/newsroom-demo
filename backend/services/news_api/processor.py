"""
News API data processor for storing and processing news articles.
"""
import asyncio
from datetime import datetime
from typing import Dict, List, Any

from ...db.mongodb.connection import articles_collection
from .client import fetch_top_headlines, search_news

async def process_and_store_articles(articles: List[Dict[str, Any]]) -> List[str]:
    """
    Process and store articles in MongoDB.
    
    Args:
        articles: List of articles from News API
        
    Returns:
        List of inserted article IDs
    """
    if not articles:
        return []
    
    # Process articles
    processed_articles = []
    for article in articles:
        # Create a unique ID based on source and title
        source_name = article.get("source", {}).get("name", "unknown")
        title = article.get("title", "")
        article_id = f"{source_name}-{title}".lower().replace(" ", "-")
        
        # Add additional fields
        processed_article = {
            **article,
            "article_id": article_id,
            "stored_at": datetime.utcnow(),
            "trending_score": 0,
            "reactions": {
                "likes": 0,
                "dislikes": 0,
                "shares": 0,
                "comments": 0
            }
        }
        processed_articles.append(processed_article)
    
    # Store articles in MongoDB
    result = await articles_collection.insert_many(
        processed_articles, 
        ordered=False  # Continue on error
    )
    
    return result.inserted_ids

async def fetch_and_store_top_headlines(
    categories: List[str] = ["business", "technology", "science", "health", "entertainment", "sports", "general"],
    countries: List[str] = ["us", "gb", "ca", "au"]
) -> Dict[str, int]:
    """
    Fetch top headlines for multiple categories and countries and store them in MongoDB.
    
    Args:
        categories: List of categories to fetch
        countries: List of countries to fetch
        
    Returns:
        Dict with count of articles fetched and stored
    """
    total_fetched = 0
    total_stored = 0
    
    for country in countries:
        for category in categories:
            try:
                # Fetch articles
                response = await fetch_top_headlines(country=country, category=category)
                articles = response.get("articles", [])
                total_fetched += len(articles)
                
                # Store articles
                inserted_ids = await process_and_store_articles(articles)
                total_stored += len(inserted_ids)
                
                # Avoid rate limiting
                await asyncio.sleep(0.5)
                
            except Exception as e:
                print(f"Error fetching {category} news for {country}: {str(e)}")
    
    return {
        "total_fetched": total_fetched,
        "total_stored": total_stored
    }

async def search_and_store_news(query: str) -> Dict[str, int]:
    """
    Search for news articles and store them in MongoDB.
    
    Args:
        query: The query to search for
        
    Returns:
        Dict with count of articles fetched and stored
    """
    try:
        # Fetch articles
        response = await search_news(query=query)
        articles = response.get("articles", [])
        
        # Store articles
        inserted_ids = await process_and_store_articles(articles)
        
        return {
            "total_fetched": len(articles),
            "total_stored": len(inserted_ids)
        }
        
    except Exception as e:
        print(f"Error searching news for '{query}': {str(e)}")
        return {
            "total_fetched": 0,
            "total_stored": 0,
            "error": str(e)
        }

