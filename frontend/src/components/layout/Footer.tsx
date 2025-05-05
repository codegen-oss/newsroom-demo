import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              NewsRoom
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A modern news aggregation platform with tiered access focusing on geopolitics, economy, and technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                  Subscription
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            &copy; {currentYear} NewsRoom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

