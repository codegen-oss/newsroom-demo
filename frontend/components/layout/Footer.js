import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold mb-4">News Room</h3>
            <p className="text-gray-300">
              Your source for the latest news on geopolitics, economy, and technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white">
                  News
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/news?category=geopolitics" className="text-gray-300 hover:text-white">
                  Geopolitics
                </Link>
              </li>
              <li>
                <Link href="/news?category=economy" className="text-gray-300 hover:text-white">
                  Economy
                </Link>
              </li>
              <li>
                <Link href="/news?category=technology" className="text-gray-300 hover:text-white">
                  Technology
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} News Room. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

