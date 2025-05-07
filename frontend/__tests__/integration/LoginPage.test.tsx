import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../app/auth/login/page';
import { AuthProvider } from '../../context/AuthContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('Login Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders login form correctly', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
  
  it('handles form submission correctly with valid credentials', async () => {
    // Mock successful login
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'fake-token' },
    });
    
    // Mock user data fetch
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
        <LoginPage />
      </AuthProvider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check if axios was called with correct parameters
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
      );
    });
    
    // Check if the form data was correct
    const formData = new URLSearchParams();
    formData.append('username', 'test@example.com');
    formData.append('password', 'password123');
    
    const actualFormData = mockedAxios.post.mock.calls[0][1];
    expect(actualFormData.toString()).toBe(formData.toString());
  });
  
  it('displays error message with invalid credentials', async () => {
    // Mock failed login
    mockedAxios.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
  
  it('validates form inputs before submission', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    
    // Submit the form without filling it
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check if validation error messages are displayed
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    // Fill in invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    
    // Submit again
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check if email validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
    
    // Axios should not have been called
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});

