import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import articleReducer from './slices/articleSlice';
import themeReducer from './slices/themeSlice';
import notificationReducer from './slices/notificationSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';
import { apiSlice } from './services/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    article: articleReducer,
    theme: themeReducer,
    notification: notificationReducer,
    userPreferences: userPreferencesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
