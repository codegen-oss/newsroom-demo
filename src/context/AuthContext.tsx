'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  subscriptionTier: 'free' | 'individual' | 'organization';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // In a real app, you would validate the token with your API
          // For now, we'll just simulate a logged in user
          setUser({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            subscriptionTier: 'free',
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call your authentication API
      // For now, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the token in localStorage or a secure cookie
      localStorage.setItem('authToken', 'mock-jwt-token');
      
      // Set the user
      setUser({
        id: '1',
        name: 'John Doe',
        email,
        subscriptionTier: 'free',
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call your registration API
      // For now, we'll just simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the token in localStorage or a secure cookie
      localStorage.setItem('authToken', 'mock-jwt-token');
      
      // Set the user
      setUser({
        id: '1',
        name,
        email,
        subscriptionTier: 'free',
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

