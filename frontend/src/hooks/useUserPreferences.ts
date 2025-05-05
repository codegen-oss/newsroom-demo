import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { 
  addCategory, 
  clearCategories, 
  removeCategory, 
  setArticleViewPreference, 
  setFontSize, 
  toggleDarkMode, 
  toggleEmailNotifications, 
  togglePushNotifications, 
  updateUserPreferences 
} from '../store/slices/userPreferencesSlice';
import { UserPreferences } from '../types';
import { useUpdateUserPreferencesMutation } from '../store/services/apiSlice';

export const useUserPreferences = () => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.userPreferences);
  const [updatePreferencesApi, { isLoading }] = useUpdateUserPreferencesMutation();
  
  // Local updates
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    dispatch(updateUserPreferences(newPreferences));
  }, [dispatch]);
  
  const handleToggleDarkMode = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);
  
  const handleToggleEmailNotifications = useCallback(() => {
    dispatch(toggleEmailNotifications());
  }, [dispatch]);
  
  const handleTogglePushNotifications = useCallback(() => {
    dispatch(togglePushNotifications());
  }, [dispatch]);
  
  const handleSetArticleViewPreference = useCallback((preference: 'list' | 'grid') => {
    dispatch(setArticleViewPreference(preference));
  }, [dispatch]);
  
  const handleSetFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    dispatch(setFontSize(size));
  }, [dispatch]);
  
  const handleAddCategory = useCallback((category: string) => {
    dispatch(addCategory(category));
  }, [dispatch]);
  
  const handleRemoveCategory = useCallback((category: string) => {
    dispatch(removeCategory(category));
  }, [dispatch]);
  
  const handleClearCategories = useCallback(() => {
    dispatch(clearCategories());
  }, [dispatch]);
  
  // Sync with backend
  const syncPreferencesWithBackend = useCallback(async () => {
    try {
      await updatePreferencesApi(preferences).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to sync preferences with backend:', error);
      return false;
    }
  }, [preferences, updatePreferencesApi]);
  
  return {
    preferences,
    updatePreferences,
    toggleDarkMode: handleToggleDarkMode,
    toggleEmailNotifications: handleToggleEmailNotifications,
    togglePushNotifications: handleTogglePushNotifications,
    setArticleViewPreference: handleSetArticleViewPreference,
    setFontSize: handleSetFontSize,
    addCategory: handleAddCategory,
    removeCategory: handleRemoveCategory,
    clearCategories: handleClearCategories,
    syncPreferencesWithBackend,
    isSyncing: isLoading,
  };
};

