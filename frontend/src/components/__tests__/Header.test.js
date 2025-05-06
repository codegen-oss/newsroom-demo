import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

/**
 * Test suite for the Header component.
 */
describe('Header Component', () => {
  test('renders the site title', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const titleElement = screen.getByText(/News Room/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const homeLink = screen.getByText(/Home/i);
    const articlesLink = screen.getByText(/Articles/i);
    
    expect(homeLink).toBeInTheDocument();
    expect(articlesLink).toBeInTheDocument();
    
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    expect(articlesLink.closest('a')).toHaveAttribute('href', '/articles');
  });
});

