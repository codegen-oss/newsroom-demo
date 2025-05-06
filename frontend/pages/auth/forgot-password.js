import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - News Room</title>
        <meta name="description" content="Reset your News Room account password" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="card max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
          
          {isSubmitted ? (
            <div className="text-center">
              <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
                Password reset link sent! Check your email.
              </div>
              <p className="mb-4">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                If you don't see it, check your spam folder or make sure you entered the correct email.
              </p>
              <Link href="/auth/login" className="btn btn-primary">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-primary-600 hover:text-primary-800">
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

