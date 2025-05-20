import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_register_user():
    url = f"{BASE_URL}/auth/register"
    data = {
        "email": "test@example.com",
        "password": "password123",
        "display_name": "Test User"
    }
    response = requests.post(url, json=data)
    print(f"Register User: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_login():
    url = f"{BASE_URL}/auth/login"
    data = {
        "username": "test@example.com",
        "password": "password123"
    }
    response = requests.post(url, data=data)
    print(f"Login: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_get_me(token):
    url = f"{BASE_URL}/auth/me"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    print(f"Get Me: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_create_article(token):
    url = f"{BASE_URL}/articles/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Test Article",
        "content": "This is a test article content.",
        "summary": "Test article summary",
        "source": "Test Source",
        "source_url": "https://example.com/test",
        "author": "Test Author",
        "categories": ["test", "example"],
        "access_tier": "free"
    }
    response = requests.post(url, json=data, headers=headers)
    print(f"Create Article: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_get_articles(token):
    url = f"{BASE_URL}/articles/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    print(f"Get Articles: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def main():
    try:
        user = test_register_user()
    except:
        # User might already exist
        pass
    
    login_response = test_login()
    token = login_response["access_token"]
    
    test_get_me(token)
    article = test_create_article(token)
    test_get_articles(token)

if __name__ == "__main__":
    main()

