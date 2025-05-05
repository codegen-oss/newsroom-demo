"""
News API client for fetching news articles.
"""
import os
import httpx
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

# News API settings
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "your-api-key")  # Change in production
NEWS_API_BASE_URL = "https://newsapi.org/v2"

async def fetch_top_headlines(
    country: Optional[str] = "us",
    category: Optional[str] = None,
    page_size: int = 20,
    page: int = 1
) -> Dict[str, Any]:
    """
    Fetch top headlines from News API.
    
    Args:
        country: The 2-letter ISO 3166-1 code of the country (default: "us")
        category: The category to get headlines for (optional)
        page_size: The number of results to return per page (default: 20, max: 100)
        page: The page number to return (default: 1)
        
    Returns:
        Dict containing the API response
    """
    url = f"{NEWS_API_BASE_URL}/top-headlines"
    params = {
        "apiKey": NEWS_API_KEY,
        "country": country,
        "pageSize": page_size,
        "page": page
    }
    
    if category:
        params["category"] = category
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()

async def search_news(
    query: str,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    language: Optional[str] = "en",
    sort_by: Optional[str] = "publishedAt",
    page_size: int = 20,
    page: int = 1
) -> Dict[str, Any]:
    """
    Search for news articles from News API.
    
    Args:
        query: The query to search for
        from_date: The date to search from (optional)
        to_date: The date to search to (optional)
        language: The language to search in (default: "en")
        sort_by: The order to sort results in (default: "publishedAt")
        page_size: The number of results to return per page (default: 20, max: 100)
        page: The page number to return (default: 1)
        
    Returns:
        Dict containing the API response
    """
    url = f"{NEWS_API_BASE_URL}/everything"
    params = {
        "apiKey": NEWS_API_KEY,
        "q": query,
        "language": language,
        "sortBy": sort_by,
        "pageSize": page_size,
        "page": page
    }
    
    if from_date:
        params["from"] = from_date.strftime("%Y-%m-%d")
    
    if to_date:
        params["to"] = to_date.strftime("%Y-%m-%d")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()

async def get_sources(
    category: Optional[str] = None,
    language: Optional[str] = "en",
    country: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get news sources from News API.
    
    Args:
        category: The category to filter sources by (optional)
        language: The language to filter sources by (default: "en")
        country: The country to filter sources by (optional)
        
    Returns:
        Dict containing the API response
    """
    url = f"{NEWS_API_BASE_URL}/sources"
    params = {
        "apiKey": NEWS_API_KEY,
        "language": language
    }
    
    if category:
        params["category"] = category
    
    if country:
        params["country"] = country
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()

