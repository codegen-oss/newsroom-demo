import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Verify token and set user
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // In a real app, we would validate the token with the server
          // For demo purposes, we'll just set the user from the token
          setUser({
            id: decoded.sub,
            email: decoded.email,
            displayName: decoded.name,
            subscriptionTier: decoded.tier || 'free',
          });
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a successful login
      
      // Simulate API call
      // const response = await axios.post('/api/auth/login', { email, password });
      // const { token } = response.data;
      
      // Mock token for demo
      const mockUser = {
        id: '123',
        email,
        name: email.split('@')[0],
        tier: 'free',
      };
      
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
        JSON.stringify({
          sub: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          tier: mockUser.tier,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        })
      )}.DEMO_KEY`;
      
      localStorage.setItem('token', token);
      
      setUser({
        id: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.name,
        subscriptionTier: mockUser.tier,
      });
      
      return mockUser;
    } catch (error) {
      console.error('Login error', error);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  };

  // Register function
  const register = async (email, password, displayName) => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a successful registration
      
      // Simulate API call
      // const response = await axios.post('/api/auth/register', { email, password, displayName });
      // const { token } = response.data;
      
      // Mock token for demo
      const mockUser = {
        id: '123',
        email,
        name: displayName,
        tier: 'free',
      };
      
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
        JSON.stringify({
          sub: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          tier: mockUser.tier,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        })
      )}.DEMO_KEY`;
      
      localStorage.setItem('token', token);
      
      setUser({
        id: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.name,
        subscriptionTier: mockUser.tier,
      });
      
      return mockUser;
    } catch (error) {
      console.error('Registration error', error);
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a successful update
      
      // Simulate API call
      // const response = await axios.put('/api/user/profile', userData, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      // const updatedUser = response.data;
      
      // Update user state
      setUser((prevUser) => ({
        ...prevUser,
        ...userData,
      }));
      
      return true;
    } catch (error) {
      console.error('Update profile error', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  // Update subscription
  const updateSubscription = async (tier) => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a successful update
      
      // Simulate API call
      // const response = await axios.put('/api/user/subscription', { tier }, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      // Update user state
      setUser((prevUser) => ({
        ...prevUser,
        subscriptionTier: tier,
      }));
      
      // Update token with new tier
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          const newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
            JSON.stringify({
              ...decoded,
              tier,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
            })
          )}.DEMO_KEY`;
          
          localStorage.setItem('token', newToken);
        } catch (error) {
          console.error('Token update error', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Update subscription error', error);
      throw new Error(error.response?.data?.message || 'Failed to update subscription');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    updateSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

