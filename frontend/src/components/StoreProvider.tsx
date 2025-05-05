'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from './layout/ThemeProvider';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
