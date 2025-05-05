'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setSystemPreference } from '../../store/slices/themeSlice';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { mode, systemPreference } = useAppSelector((state) => state.theme);
  
  // Determine the actual theme based on mode and system preference
  const actualTheme = mode === 'system' ? systemPreference : mode;

  useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setSystemPreference(e.matches ? 'dark' : 'light'));
    };
    
    // Set initial system preference
    dispatch(setSystemPreference(mediaQuery.matches ? 'dark' : 'light'));
    
    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  useEffect(() => {
    // Update the document class when theme changes
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [actualTheme]);

  // We'll use the toggleTheme action from our Redux slice
  const toggleTheme = () => {
    // This will be handled by a component that uses the Redux action directly
    // We keep this context API for backward compatibility
  };

  return (
    <ThemeContext.Provider value={{ theme: actualTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
