'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <div className="bg-primary-50 rounded-lg p-8 my-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Stay Updated with Our Newsletter
        </h2>
        <p className="text-gray-600 mb-6">
          Get the latest news and updates delivered directly to your inbox. No spam, just the stories that matter.
        </p>
        
        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-bold">Thank you for subscribing!</p>
            <p>You'll receive our next newsletter in your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary md:whitespace-nowrap"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>
        )}
        
        {error && (
          <div className="mt-4 text-red-600">
            {error}
          </div>
        )}
        
        <p className="mt-4 text-sm text-gray-500">
          By subscribing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  )
}

