import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Clear localStorage
    window.localStorage.clear();
  });
  
  it('provides authentication state and functions', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Login and logout buttons should be available
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  
  it('handles login successfully', async () => {
    // Mock axios post to return a token
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'fake-token' },
    });
    
    // Mock axios get to return user data
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: '1',
        email: 'test@example.com',
        display_name: 'Test User',
        subscription_tier: 'free',
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await act(async () => {
      screen.getByText('Login').click();
    });
    
    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
    
    // Check if localStorage was updated
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
  });
  
  it('handles login failure', async () => {
    // Mock axios post to reject
    mockedAxios.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await act(async () => {
      screen.getByText('Login').click();
    });
    
    // Should still be not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Console error should have been called
    expect(console.error).toHaveBeenCalled();
  });
  
  it('handles logout', async () => {
    // Setup initial authenticated state
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'fake-token' },
    });
    
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: '1',
        email: 'test@example.com',
        display_name: 'Test User',
        subscription_tier: 'free',
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login
    await act(async () => {
      screen.getByText('Login').click();
    });
    
    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    // Logout
    await act(async () => {
      screen.getByText('Logout').click();
    });
    
    // Should be not authenticated again
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Check if localStorage was cleared
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });
  
  it('loads user from token in localStorage on mount', async () => {
    // Mock localStorage to return a token
    window.localStorage.getItem = jest.fn().mockReturnValueOnce('fake-token');
    
    // Mock jwt-decode to return valid token data
    (jwtDecode as jest.Mock).mockReturnValueOnce({
      sub: 'test@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    });
    
    // Mock axios get to return user data
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: '1',
        email: 'test@example.com',
        display_name: 'Test User',
        subscription_tier: 'free',
      },
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });
  
  it('handles expired token on mount', async () => {
    // Mock localStorage to return a token
    window.localStorage.getItem = jest.fn().mockReturnValueOnce('fake-token');
    
    // Mock jwt-decode to return expired token data
    (jwtDecode as jest.Mock).mockReturnValueOnce({
      sub: 'test@example.com',
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Should be not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Check if localStorage was cleared
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});

