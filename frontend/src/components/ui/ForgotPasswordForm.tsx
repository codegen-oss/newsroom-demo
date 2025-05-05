import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FiMail, FiAlertCircle, FiCheck } from 'react-icons/fi';
import Input from './Input';
import Button from './Button';
import Card from './Card';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
  className?: string;
}

export default function ForgotPasswordForm({
  onSubmit,
  isLoading,
  className = '',
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      await onSubmit(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Card variant="elevated" className={`p-8 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reset Your Password
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
          <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success ? (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <div className="flex items-start">
            <FiCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                Reset Link Sent
              </h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Return to login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                fullWidth
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Remember your password?{' '}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      )}
    </Card>
  );
}

