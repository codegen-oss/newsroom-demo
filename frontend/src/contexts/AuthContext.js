import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { authAPI, userAPI } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await userAPI.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authAPI.login(email, password);
      localStorage.setItem('token', data.access_token);
      
      // Fetch user data
      const userData = await userAPI.getCurrentUser();
      setUser(userData);
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const data = await authAPI.register(userData);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const updateUserProfile = async (userData) => {
    try {
      const updatedUser = await userAPI.updateUser(userData);
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

