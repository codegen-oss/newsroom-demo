'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }
    
    setStatus('loading')
    
    // In a real app, this would call an API endpoint
    // For this demo, we'll simulate an API call
    setTimeout(() => {
      setStatus('success')
      setMessage('Thank you for subscribing to our newsletter!')
      setEmail('')
    }, 1000)
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 md:p-10">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Get the latest news and updates delivered directly to your inbox.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input flex-grow"
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {status !== 'idle' && (
          <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
        
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          By subscribing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </form>
    </div>
  )
}

