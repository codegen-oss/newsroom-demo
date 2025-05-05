'use client';

import { useState } from 'react';
import ForgotPasswordForm from '../../../components/ui/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      // In a real application, this would call an API endpoint
      // For demo purposes, we'll simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API call success
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error('Failed to send reset link. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />
    </div>
  );
}

