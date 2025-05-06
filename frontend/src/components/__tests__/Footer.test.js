import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

/**
 * Test suite for the Footer component.
 */
describe('Footer Component', () => {
  test('renders the copyright text', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} News Room`, 'i'));
    
    expect(copyrightText).toBeInTheDocument();
  });
});

