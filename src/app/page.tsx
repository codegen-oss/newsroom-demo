import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to News Room
        </h1>
        <p className="text-xl mb-8 text-center">
          A modern news aggregation platform with tiered access focusing on geopolitics, economy, and technology.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/auth/login" 
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

