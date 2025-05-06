import { jwtDecode } from 'jwt-decode';

// Check if token is valid
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Get user from token
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    
    return {
      id: decoded.sub,
      email: decoded.email,
      displayName: decoded.name,
      subscriptionTier: decoded.tier || 'free',
    };
  } catch (error) {
    return null;
  }
};

// Protected route middleware (for client-side)
export const withAuth = (gssp) => {
  return async (context) => {
    const { req, res } = context;
    
    // Check for token in cookies (server-side)
    if (req && req.cookies) {
      const token = req.cookies.token;
      
      if (!token || !isTokenValid(token)) {
        return {
          redirect: {
            destination: '/auth/login',
            permanent: false,
          },
        };
      }
    }
    
    return await gssp(context);
  };
};

