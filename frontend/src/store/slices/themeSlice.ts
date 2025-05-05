import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, ThemeState } from '../../types';

// Helper function to get initial theme from localStorage
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
  return savedTheme || 'system';
};

// Helper function to detect system preference
const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  systemPreference: getSystemPreference(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    setSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload;
    },
    toggleTheme: (state) => {
      // If current mode is system, toggle between light and dark
      if (state.mode === 'system') {
        const newMode = state.systemPreference === 'light' ? 'dark' : 'light';
        state.mode = newMode;
      } else {
        // Toggle between light and dark
        state.mode = state.mode === 'light' ? 'dark' : 'light';
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.mode);
      }
    },
  },
});

export const { setThemeMode, setSystemPreference, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;

