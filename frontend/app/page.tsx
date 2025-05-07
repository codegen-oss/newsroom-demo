import Link from 'next/link'
import { FaNewspaper, FaUser, FaLock } from 'react-icons/fa'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-800 to-secondary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Stay Informed with News Room
            </h1>
            <p className="text-xl mb-8">
              Your trusted source for geopolitics, economy, and technology news
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login" className="btn-primary flex items-center justify-center gap-2">
                <FaUser /> Login
              </Link>
              <Link href="/auth/register" className="btn-secondary flex items-center justify-center gap-2">
                <FaLock /> Register
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="text-primary-600 text-4xl mb-4">
                <FaNewspaper />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated News Feed</h3>
              <p className="text-gray-600">
                Personalized news feed based on your interests and preferences.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-primary-600 text-4xl mb-4">
                <FaUser />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tiered Access</h3>
              <p className="text-gray-600">
                Different subscription tiers for individuals and organizations.
              </p>
            </div>
            <div className="card p-6">
              <div className="text-primary-600 text-4xl mb-4">
                <FaLock />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Secure user authentication and profile management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">News Room</h2>
              <p className="text-gray-400">Stay informed, stay ahead</p>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link href="/auth/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} News Room. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

