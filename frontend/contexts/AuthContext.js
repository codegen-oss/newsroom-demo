import { createContext, useState, useContext, useEffect } from 'react';

// Mock user data for demonstration
const MOCK_USERS = {
  'user@example.com': {
    email: 'user@example.com',
    password: 'password123',
    displayName: 'Regular User',
    subscriptionTier: 'free',
  },
  'premium@example.com': {
    email: 'premium@example.com',
    password: 'password123',
    displayName: 'Premium User',
    subscriptionTier: 'premium',
  },
  'org@example.com': {
    email: 'org@example.com',
    password: 'password123',
    displayName: 'Organization User',
    subscriptionTier: 'organization',
  },
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock authentication
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.password === password) {
      const userData = {
        email: mockUser.email,
        displayName: mockUser.displayName,
        subscriptionTier: mockUser.subscriptionTier,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const canAccessContent = (accessTier) => {
    if (!user) return accessTier === 'free';
    
    if (user.subscriptionTier === 'organization') return true;
    if (user.subscriptionTier === 'premium') return accessTier !== 'organization';
    return accessTier === 'free';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, canAccessContent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

