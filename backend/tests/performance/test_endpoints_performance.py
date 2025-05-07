import pytest
import time
import statistics
from fastapi.testclient import TestClient

def measure_endpoint_performance(client, endpoint, method="get", data=None, headers=None, num_requests=10):
    """
    Measure the performance of an endpoint by making multiple requests and calculating statistics.
    
    Args:
        client: The test client
        endpoint: The endpoint to test
        method: The HTTP method to use (default: "get")
        data: The data to send with the request (default: None)
        headers: The headers to send with the request (default: None)
        num_requests: The number of requests to make (default: 10)
        
    Returns:
        A dictionary with performance statistics
    """
    response_times = []
    
    for _ in range(num_requests):
        start_time = time.time()
        
        if method.lower() == "get":
            response = client.get(endpoint, headers=headers)
        elif method.lower() == "post":
            response = client.post(endpoint, json=data, headers=headers)
        elif method.lower() == "put":
            response = client.put(endpoint, json=data, headers=headers)
        elif method.lower() == "delete":
            response = client.delete(endpoint, headers=headers)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        response_times.append(response_time)
    
    # Calculate statistics
    avg_response_time = statistics.mean(response_times)
    min_response_time = min(response_times)
    max_response_time = max(response_times)
    median_response_time = statistics.median(response_times)
    p95_response_time = sorted(response_times)[int(num_requests * 0.95) - 1]
    
    return {
        "avg_response_time": avg_response_time,
        "min_response_time": min_response_time,
        "max_response_time": max_response_time,
        "median_response_time": median_response_time,
        "p95_response_time": p95_response_time,
    }

def test_health_endpoint_performance(client):
    """Test the performance of the health endpoint."""
    stats = measure_endpoint_performance(client, "/health")
    
    # Print the statistics for debugging
    print(f"Health Endpoint Performance: {stats}")
    
    # Assert that the average response time is below a threshold
    assert stats["avg_response_time"] < 100  # 100ms threshold

def test_articles_endpoint_performance(authorized_client, test_article):
    """Test the performance of the articles endpoint."""
    stats = measure_endpoint_performance(authorized_client, "/articles/")
    
    # Print the statistics for debugging
    print(f"Articles Endpoint Performance: {stats}")
    
    # Assert that the average response time is below a threshold
    assert stats["avg_response_time"] < 200  # 200ms threshold

def test_article_detail_endpoint_performance(authorized_client, test_article):
    """Test the performance of the article detail endpoint."""
    stats = measure_endpoint_performance(authorized_client, f"/articles/{test_article.id}")
    
    # Print the statistics for debugging
    print(f"Article Detail Endpoint Performance: {stats}")
    
    # Assert that the average response time is below a threshold
    assert stats["avg_response_time"] < 150  # 150ms threshold

def test_users_endpoint_performance(authorized_client):
    """Test the performance of the users endpoint."""
    stats = measure_endpoint_performance(authorized_client, "/users/")
    
    # Print the statistics for debugging
    print(f"Users Endpoint Performance: {stats}")
    
    # Assert that the average response time is below a threshold
    assert stats["avg_response_time"] < 200  # 200ms threshold

def test_user_detail_endpoint_performance(authorized_client, test_user):
    """Test the performance of the user detail endpoint."""
    stats = measure_endpoint_performance(authorized_client, f"/users/{test_user.id}")
    
    # Print the statistics for debugging
    print(f"User Detail Endpoint Performance: {stats}")
    
    # Assert that the average response time is below a threshold
    assert stats["avg_response_time"] < 150  # 150ms threshold

def test_login_endpoint_performance(client, test_user):
    """Test the performance of the login endpoint."""
    data = {
        "username": test_user.email,
        "password": "password123"
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    
    stats = measure_endpoint_performance(
        client, 
        "/token", 
        method="post", 
        data=data, 
        headers=headers
    )
    
    # Print the statistics for debugging
    print(f"Login Endpoint Performance: {stats}")
    
    # Assert that the average response time is below a threshold
    assert stats["avg_response_time"] < 300  # 300ms threshold

def test_create_article_endpoint_performance(authorized_client):
    """Test the performance of the create article endpoint."""
    article_data = {
        "title": "Performance Test Article",
        "content": "This is a test article for performance testing.",
        "summary": "Performance test article summary",
        "source": "Performance Test Source",
        "source_url": "https://example.com/performance-test",
        "author": "Performance Test Author",
        "categories": ["performance", "test"],
        "access_tier": "free",
        "featured_image": "https://example.com/performance-test-image.jpg"
    }
    
    stats = measure_endpoint_performance(
        authorized_client, 
        "/articles/", 
        method="post", 
        data=article_data
    )
    
    # Print the statistics for debugging
    print(f"Create Article Endpoint Performance: {stats}")
    
    # Assert that the average response time is below a threshold
    assert stats["avg_response_time"] < 300  # 300ms threshold

