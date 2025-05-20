'use client'

import { FaExclamationTriangle } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface ErrorMessageProps {
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
}

export default function ErrorMessage({ 
  message, 
  type = 'error',
  onRetry
}: ErrorMessageProps) {
  // Type styling
  const typeStyles = {
    error: 'bg-red-900/20 border-red-900 text-red-200',
    warning: 'bg-yellow-900/20 border-yellow-900 text-yellow-200',
    info: 'bg-blue-900/20 border-blue-900 text-blue-200'
  }
  
  return (
    <motion.div 
      className={`rounded-lg p-4 ${typeStyles[type]} flex items-start`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FaExclamationTriangle className="mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-grow">
        <p>{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 text-sm font-medium hover:underline"
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  )
}

