import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import NewsFeed from '../components/news/NewsFeed';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <Head>
        <title>News Room - Home</title>
        <meta name="description" content="News Room - Your source for geopolitics, economy, and technology news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="card text-center">
            <h1 className="text-4xl font-display mb-6">Welcome to News Room</h1>
            <p className="text-xl mb-8">
              Your source for the latest news on geopolitics, economy, and technology.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/login" className="btn btn-primary">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-outline">
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-display mb-6">
              Welcome back, {user?.displayName || 'Reader'}
            </h1>
            <NewsFeed />
          </>
        )}
      </main>
    </>
  );
}

