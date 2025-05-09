import httpx
import asyncio
from datetime import datetime
from typing import List, Dict, Any
import os
import re
from bson import ObjectId

# In a real application, you would use a proper news API
# For this demo, we'll simulate fetching news from a mock API
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "demo-key")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"


async def fetch_news_articles(categories: List[str] = None, countries: List[str] = None) -> List[Dict[Any, Any]]:
    """
    Fetch news articles from the News API.
    
    Args:
        categories: List of categories to fetch news for
        countries: List of country codes to fetch news for
        
    Returns:
        List of news articles
    """
    if not categories:
        categories = ["business", "technology", "politics", "science"]
    
    if not countries:
        countries = ["us", "gb", "ca", "au"]
    
    articles = []
    
    async with httpx.AsyncClient() as client:
        for category in categories:
            for country in countries:
                params = {
                    "category": category,
                    "country": country,
                    "apiKey": NEWS_API_KEY,
                    "pageSize": 10
                }
                
                try:
                    response = await client.get(NEWS_API_URL, params=params)
                    data = response.json()
                    
                    if data.get("status") == "ok":
                        for article in data.get("articles", []):
                            # Process and transform the article
                            processed_article = process_article(article, category, country)
                            if processed_article:
                                articles.append(processed_article)
                except Exception as e:
                    print(f"Error fetching news for {category} in {country}: {str(e)}")
    
    return articles


def process_article(article: Dict, category: str, country: str) -> Dict:
    """
    Process and transform a news article from the API format to our database format.
    
    Args:
        article: The article data from the API
        category: The category of the article
        country: The country code
        
    Returns:
        Processed article in our database format
    """
    # Skip articles without required fields
    if not all(k in article and article[k] for k in ["title", "url", "publishedAt", "source"]):
        return None
    
    # Map country codes to region names
    country_to_region = {
        "us": "North America",
        "ca": "North America",
        "gb": "Europe",
        "au": "Oceania",
        # Add more mappings as needed
    }
    
    # Map categories to our internal categories
    category_mapping = {
        "business": "Economy",
        "technology": "Technology",
        "politics": "Geopolitics",
        "science": "Science",
        # Add more mappings as needed
    }
    
    # Calculate read time (rough estimate: 200 words per minute)
    content = article.get("content", "") or article.get("description", "")
    word_count = len(re.findall(r'\w+', content))
    read_time_minutes = max(1, round(word_count / 200))
    
    # Determine access tier (simple logic for demo)
    access_tier = "free"
    if "premium" in article.get("title", "").lower() or "exclusive" in article.get("title", "").lower():
        access_tier = "premium"
    
    # Create article in our format
    processed_article = {
        "title": article["title"],
        "subtitle": article.get("description", ""),
        "content": article.get("content", "") or article.get("description", ""),
        "summary": article.get("description", ""),
        "source": article["source"].get("name", "Unknown Source"),
        "source_url": article["url"],
        "author": article.get("author", "Unknown Author"),
        "published_at": datetime.fromisoformat(article["publishedAt"].replace("Z", "+00:00")),
        "categories": [category_mapping.get(category, "General")],
        "regions": [country_to_region.get(country, "Global")],
        "topics": extract_topics(article["title"], article.get("description", "")),
        "read_time_minutes": read_time_minutes,
        "access_tier": access_tier,
        "featured_image": article.get("urlToImage"),
        "sentiment": analyze_sentiment(article["title"], article.get("description", "")),
        "popularity": 0,
        "related_articles": []
    }
    
    return processed_article


def extract_topics(title: str, description: str) -> List[str]:
    """
    Extract topics from article title and description.
    
    In a real application, this would use NLP techniques.
    For this demo, we'll use a simple keyword-based approach.
    
    Args:
        title: Article title
        description: Article description
        
    Returns:
        List of topics
    """
    text = (title + " " + description).lower()
    
    topics = []
    
    # Simple keyword matching
    topic_keywords = {
        "AI": ["ai", "artificial intelligence", "machine learning", "neural network"],
        "Climate": ["climate", "global warming", "environment", "sustainability"],
        "Crypto": ["crypto", "bitcoin", "blockchain", "ethereum", "nft"],
        "Finance": ["finance", "stock", "market", "investment", "economy"],
        "Politics": ["politics", "election", "government", "president", "congress"],
        "Health": ["health", "covid", "pandemic", "medicine", "vaccine"],
        "Tech": ["tech", "technology", "software", "hardware", "digital"]
    }
    
    for topic, keywords in topic_keywords.items():
        if any(keyword in text for keyword in keywords):
            topics.append(topic)
    
    return topics or ["General"]


def analyze_sentiment(title: str, description: str) -> str:
    """
    Analyze sentiment of article title and description.
    
    In a real application, this would use NLP techniques.
    For this demo, we'll use a simple keyword-based approach.
    
    Args:
        title: Article title
        description: Article description
        
    Returns:
        Sentiment: "positive", "neutral", or "negative"
    """
    text = (title + " " + description).lower()
    
    positive_words = ["success", "growth", "positive", "gain", "improvement", "breakthrough", "win"]
    negative_words = ["crisis", "decline", "negative", "loss", "failure", "risk", "threat", "danger"]
    
    positive_count = sum(1 for word in positive_words if word in text)
    negative_count = sum(1 for word in negative_words if word in text)
    
    if positive_count > negative_count:
        return "positive"
    elif negative_count > positive_count:
        return "negative"
    else:
        return "neutral"


async def categorize_articles(articles: List[Dict]) -> List[Dict]:
    """
    Categorize articles using more advanced techniques.
    
    In a real application, this would use ML/NLP for categorization.
    For this demo, we'll use the existing categories.
    
    Args:
        articles: List of articles to categorize
        
    Returns:
        Categorized articles
    """
    # This is a placeholder for more advanced categorization
    # In a real application, you might use a ML model here
    return articles


async def find_related_articles(articles: List[Dict], mongo_db) -> List[Dict]:
    """
    Find related articles for each article.
    
    Args:
        articles: List of new articles
        mongo_db: MongoDB database connection
        
    Returns:
        Articles with related_articles field populated
    """
    for article in articles:
        # Find articles with similar topics or categories
        query = {
            "$or": [
                {"topics": {"$in": article["topics"]}},
                {"categories": {"$in": article["categories"]}}
            ],
            "title": {"$ne": article["title"]}  # Exclude the current article
        }
        
        related = await mongo_db.articles.find(query).sort("published_at", -1).limit(3).to_list(length=3)
        
        # Extract IDs of related articles
        article["related_articles"] = [str(related_article["_id"]) for related_article in related]
    
    return articles


async def store_articles(articles: List[Dict], mongo_db) -> int:
    """
    Store articles in the database, avoiding duplicates.
    
    Args:
        articles: List of articles to store
        mongo_db: MongoDB database connection
        
    Returns:
        Number of new articles stored
    """
    new_articles_count = 0
    
    for article in articles:
        # Check if article already exists (by title and source)
        existing = await mongo_db.articles.find_one({
            "title": article["title"],
            "source": article["source"]
        })
        
        if not existing:
            # Insert new article
            await mongo_db.articles.insert_one(article)
            new_articles_count += 1
    
    return new_articles_count

