"""
Rate limiter utility for the News Room application.
"""
import time
from fastapi import Request, HTTPException, status
from ..db.redis.connection import redis_client

class RateLimiter:
    """
    Rate limiter using Redis to track and limit requests.
    """
    
    def __init__(self, times: int, seconds: int):
        """
        Initialize rate limiter.
        
        Args:
            times: Number of allowed requests
            seconds: Time window in seconds
        """
        self.times = times
        self.seconds = seconds
    
    async def __call__(self, request: Request):
        """
        Check if request is within rate limits.
        
        Args:
            request: FastAPI request object
            
        Raises:
            HTTPException: If rate limit is exceeded
        """
        # Get client IP
        client_ip = request.client.host
        
        # Create Redis key
        key = f"rate_limit:{client_ip}:{request.url.path}"
        
        # Get current count
        count = await redis_client.get(key)
        
        if count is None:
            # First request, set count to 1 with expiration
            await redis_client.set(key, 1, ex=self.seconds)
        elif int(count) < self.times:
            # Increment count
            await redis_client.incr(key)
        else:
            # Get TTL (time to live)
            ttl = await redis_client.ttl(key)
            
            # Rate limit exceeded
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again in {ttl} seconds."
            )

