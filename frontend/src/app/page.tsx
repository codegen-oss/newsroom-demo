import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to News Room
        </h1>
        <p className="text-xl text-center mb-8">
          A modern news aggregation platform with tiered access focusing on geopolitics, economy, and technology.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard" className="btn-primary">
            Get Started
          </Link>
          <Link href="/about" className="btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}

