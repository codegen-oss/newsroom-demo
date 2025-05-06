import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserPreferencesContext = createContext();

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
}

export function UserPreferencesProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!isAuthenticated) {
        setPreferences(null);
        setLoading(false);
        return;
      }
      
      try {
        // In a real app, this would fetch from an API
        // For demo purposes, we'll use localStorage or mock data
        
        const storedPreferences = localStorage.getItem(`preferences_${user.id}`);
        
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        } else {
          // Set default preferences
          const defaultPreferences = {
            categories: ['Technology'],
            regions: ['North America'],
            favoriteTopics: ['Artificial Intelligence'],
            darkMode: false,
            emailNotifications: true,
          };
          
          localStorage.setItem(`preferences_${user.id}`, JSON.stringify(defaultPreferences));
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Error fetching preferences', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [isAuthenticated, user]);

  const updatePreferences = async (newPreferences) => {
    try {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      // In a real app, this would update via an API
      // For demo purposes, we'll use localStorage
      
      const updatedPreferences = {
        ...preferences,
        ...newPreferences,
      };
      
      localStorage.setItem(`preferences_${user.id}`, JSON.stringify(updatedPreferences));
      setPreferences(updatedPreferences);
      
      return true;
    } catch (error) {
      console.error('Error updating preferences', error);
      throw new Error('Failed to update preferences');
    }
  };

  const value = {
    preferences,
    loading,
    updatePreferences,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

