from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from typing import List, Optional

from ..utils.auth import SECRET_KEY, ALGORITHM

class AuthMiddleware:
    """Middleware for JWT token validation"""
    
    def __init__(
        self,
        exclude_paths: Optional[List[str]] = None,
        exclude_prefixes: Optional[List[str]] = None
    ):
        self.exclude_paths = exclude_paths or []
        self.exclude_prefixes = exclude_prefixes or []
    
    async def __call__(self, request: Request, call_next):
        # Skip authentication for excluded paths
        path = request.url.path
        
        # Check if path is excluded
        if path in self.exclude_paths:
            return await call_next(request)
        
        # Check if path starts with excluded prefix
        for prefix in self.exclude_prefixes:
            if path.startswith(prefix):
                return await call_next(request)
        
        # Get authorization header
        auth_header = request.headers.get("Authorization")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Not authenticated"},
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Extract token
        token = auth_header.split(" ")[1]
        
        try:
            # Validate token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            
            if user_id is None:
                raise JWTError
            
            # Add user_id to request state
            request.state.user_id = user_id
            
        except JWTError:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid authentication credentials"},
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Continue processing the request
        return await call_next(request)

