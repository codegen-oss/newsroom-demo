import type { NextPage } from 'next';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Home: NextPage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to News Room</h1>
        
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          {isAuthenticated ? (
            <div className="text-center">
              <p className="mb-4">Welcome back, {user?.name}!</p>
              <Link href="/profile" className="btn-primary block mb-4">
                View Profile
              </Link>
              <Link href="/dashboard" className="btn-secondary block">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Please log in to access your personalized news feed.</p>
              <Link href="/login" className="btn-primary block mb-4">
                Log In
              </Link>
              <Link href="/register" className="btn-secondary block">
                Register
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
