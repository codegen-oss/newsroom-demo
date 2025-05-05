import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '../../types';

// Helper function to get initial preferences from localStorage
const getInitialPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') {
    return {
      categories: [],
      darkMode: false,
      emailNotifications: true,
      pushNotifications: true,
      articleViewPreference: 'grid',
      fontSize: 'medium',
    };
  }
  
  const savedPreferences = localStorage.getItem('userPreferences');
  
  if (savedPreferences) {
    try {
      return JSON.parse(savedPreferences);
    } catch (error) {
      console.error('Failed to parse user preferences from localStorage:', error);
    }
  }
  
  return {
    categories: [],
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    articleViewPreference: 'grid',
    fontSize: 'medium',
  };
};

const initialState: UserPreferences = getInitialPreferences();

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      const newState = { ...action.payload };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newState));
      }
      
      return newState;
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      const newState = { ...state, ...action.payload };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newState));
      }
      
      return newState;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    toggleEmailNotifications: (state) => {
      state.emailNotifications = !state.emailNotifications;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    togglePushNotifications: (state) => {
      state.pushNotifications = !state.pushNotifications;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    setArticleViewPreference: (state, action: PayloadAction<'list' | 'grid'>) => {
      state.articleViewPreference = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('userPreferences', JSON.stringify(state));
        }
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category !== action.payload);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    clearCategories: (state) => {
      state.categories = [];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
  },
});

export const {
  setUserPreferences,
  updateUserPreferences,
  toggleDarkMode,
  toggleEmailNotifications,
  togglePushNotifications,
  setArticleViewPreference,
  setFontSize,
  addCategory,
  removeCategory,
  clearCategories,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;

