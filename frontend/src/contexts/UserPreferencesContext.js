import React, { createContext, useState, useEffect, useContext } from 'react';
import { userAPI } from '../api';
import { useAuth } from './AuthContext';

const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [interests, setInterests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user interests when authenticated
    const fetchUserInterests = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const interestsData = await userAPI.getUserInterests();
        setInterests(interestsData);
      } catch (err) {
        // If interests don't exist yet, that's okay
        if (err.response?.status !== 404) {
          setError(err.response?.data?.detail || 'Failed to fetch interests');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInterests();
  }, [isAuthenticated, user?.id]);

  const saveInterests = async (interestsData) => {
    try {
      setError(null);
      let response;

      if (interests) {
        // Update existing interests
        response = await userAPI.updateUserInterests(interestsData);
      } else {
        // Create new interests
        response = await userAPI.createUserInterests(interestsData);
      }

      setInterests(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save interests');
      throw err;
    }
  };

  const addCategory = async (category) => {
    if (!interests) return;
    
    const updatedCategories = [...interests.categories, category];
    return saveInterests({ categories: updatedCategories });
  };

  const removeCategory = async (category) => {
    if (!interests) return;
    
    const updatedCategories = interests.categories.filter(c => c !== category);
    return saveInterests({ categories: updatedCategories });
  };

  const addRegion = async (region) => {
    if (!interests) return;
    
    const updatedRegions = [...interests.regions, region];
    return saveInterests({ regions: updatedRegions });
  };

  const removeRegion = async (region) => {
    if (!interests) return;
    
    const updatedRegions = interests.regions.filter(r => r !== region);
    return saveInterests({ regions: updatedRegions });
  };

  const addTopic = async (topic) => {
    if (!interests) return;
    
    const updatedTopics = [...interests.topics, topic];
    return saveInterests({ topics: updatedTopics });
  };

  const removeTopic = async (topic) => {
    if (!interests) return;
    
    const updatedTopics = interests.topics.filter(t => t !== topic);
    return saveInterests({ topics: updatedTopics });
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        interests,
        loading,
        error,
        saveInterests,
        addCategory,
        removeCategory,
        addRegion,
        removeRegion,
        addTopic,
        removeTopic,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesContext;

