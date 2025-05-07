import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../context/AuthContext';

// Mock the AuthContext
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Navbar Component', () => {
  it('renders logo and navigation links when not authenticated', () => {
    // Mock the useAuth hook to return not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
    });
    
    render(<Navbar />);
    
    // Check if logo is rendered
    expect(screen.getByText(/News Room/i)).toBeInTheDocument();
    
    // Check if login and register links are rendered
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    
    // Check if dashboard link is not rendered
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });
  
  it('renders authenticated navigation links when authenticated', () => {
    // Mock the useAuth hook to return authenticated
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        display_name: 'Test User',
        subscription_tier: 'premium',
      },
      logout: mockLogout,
    });
    
    render(<Navbar />);
    
    // Check if logo is rendered
    expect(screen.getByText(/News Room/i)).toBeInTheDocument();
    
    // Check if authenticated links are rendered
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    
    // Check if login and register links are not rendered
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
    
    // Check if user name is displayed
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    
    // Check if subscription badge is displayed
    expect(screen.getByText(/Premium/i)).toBeInTheDocument();
  });
  
  it('calls logout function when logout button is clicked', () => {
    // Mock the useAuth hook to return authenticated
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: {
        display_name: 'Test User',
        subscription_tier: 'premium',
      },
      logout: mockLogout,
    });
    
    render(<Navbar />);
    
    // Click the logout button
    fireEvent.click(screen.getByText(/Logout/i));
    
    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  
  it('toggles mobile menu when hamburger button is clicked', () => {
    // Mock the useAuth hook to return not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
    });
    
    render(<Navbar />);
    
    // Mobile menu should be hidden initially
    expect(screen.getByRole('navigation')).toHaveClass('hidden');
    
    // Click the hamburger button
    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    
    // Mobile menu should be visible
    expect(screen.getByRole('navigation')).not.toHaveClass('hidden');
    
    // Click the hamburger button again
    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    
    // Mobile menu should be hidden again
    expect(screen.getByRole('navigation')).toHaveClass('hidden');
  });
});

