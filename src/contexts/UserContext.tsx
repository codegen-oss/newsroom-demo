import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessTier } from '@/types/article';

interface User {
  id: string;
  name: string;
  email: string;
  accessTier: AccessTier;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  canAccessContent: (requiredTier: AccessTier) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Free User',
    email: 'free@example.com',
    password: 'password123',
    accessTier: 'free' as AccessTier,
    avatar: 'https://source.unsplash.com/random/100x100/?person',
  },
  {
    id: '2',
    name: 'Premium User',
    email: 'premium@example.com',
    password: 'password123',
    accessTier: 'premium' as AccessTier,
    avatar: 'https://source.unsplash.com/random/100x100/?person',
  },
  {
    id: '3',
    name: 'Exclusive User',
    email: 'exclusive@example.com',
    password: 'password123',
    accessTier: 'exclusive' as AccessTier,
    avatar: 'https://source.unsplash.com/random/100x100/?person',
  },
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password before storing user data
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Function to check if user can access content based on tier
  const canAccessContent = (requiredTier: AccessTier): boolean => {
    if (!user) return false;
    
    const tierLevels: Record<AccessTier, number> = {
      'free': 1,
      'premium': 2,
      'exclusive': 3
    };
    
    return tierLevels[user.accessTier] >= tierLevels[requiredTier];
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, canAccessContent }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

