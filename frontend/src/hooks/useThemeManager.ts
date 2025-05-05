import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { setThemeMode, toggleTheme } from '../store/slices/themeSlice';
import { ThemeMode } from '../types';

export const useThemeManager = () => {
  const dispatch = useAppDispatch();
  const { mode, systemPreference } = useAppSelector((state) => state.theme);
  
  // Determine the actual theme based on mode and system preference
  const actualTheme = mode === 'system' ? systemPreference : mode;
  
  const setTheme = useCallback((newMode: ThemeMode) => {
    dispatch(setThemeMode(newMode));
  }, [dispatch]);
  
  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);
  
  return {
    theme: actualTheme,
    mode,
    systemPreference,
    setTheme,
    toggleTheme: handleToggleTheme,
    isDarkMode: actualTheme === 'dark',
  };
};

