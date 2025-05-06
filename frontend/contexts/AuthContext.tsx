import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { api } from '../utils/api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('auth_token');
      
      if (token) {
        try {
          // Set the token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const { data } = await api.get('/api/user/profile');
          setUser(data);
        } catch (error) {
          console.error('Authentication error:', error);
          Cookies.remove('auth_token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/api/auth/login', { email, password });
      
      // Save token to cookies
      Cookies.set('auth_token', data.token, { expires: 7 }); // 7 days
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Fetch user data
      const userResponse = await api.get('/api/user/profile');
      setUser(userResponse.data);
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/api/auth/register', { name, email, password });
      
      // Save token to cookies
      Cookies.set('auth_token', data.token, { expires: 7 }); // 7 days
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Set user data
      setUser(data.user);
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from cookies
    Cookies.remove('auth_token');
    
    // Remove token from axios headers
    delete api.defaults.headers.common['Authorization'];
    
    // Clear user data
    setUser(null);
    
    // Redirect to home page
    router.push('/');
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const { data } = await api.put('/api/user/profile', userData);
      setUser(data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

