import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to News Room
        </h1>
        <p className="text-center mb-8">
          A modern news aggregation platform with tiered access focusing on geopolitics, economy, and technology.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/auth/login" 
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

