"""
Security utility functions for the News Room application.
"""
import secrets
import string
from datetime import datetime, timedelta
import re

def generate_random_string(length=32):
    """Generate a random string of fixed length."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_reset_token():
    """Generate a password reset token."""
    return generate_random_string(64)

def is_token_expired(token_created_at, expiration_hours=24):
    """Check if a token is expired."""
    expiration_time = token_created_at + timedelta(hours=expiration_hours)
    return datetime.utcnow() > expiration_time

def is_valid_password(password):
    """
    Validate password strength.
    
    Password must:
    - Be at least 8 characters long
    - Contain at least one uppercase letter
    - Contain at least one lowercase letter
    - Contain at least one digit
    - Contain at least one special character
    """
    if len(password) < 8:
        return False
    
    if not re.search(r'[A-Z]', password):
        return False
    
    if not re.search(r'[a-z]', password):
        return False
    
    if not re.search(r'[0-9]', password):
        return False
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    
    return True

def is_valid_email(email):
    """Validate email format."""
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None

