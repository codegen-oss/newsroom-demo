export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">NewsRoom</h3>
            <p className="text-gray-300">
              A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-white transition-colors">
                  Profile
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Subscription Tiers</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Free - Basic access</li>
              <li className="text-gray-300">Individual - Premium content</li>
              <li className="text-gray-300">Organization - Full access</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} NewsRoom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

