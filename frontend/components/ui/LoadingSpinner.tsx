'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'white'
  text?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary',
  text
}: LoadingSpinnerProps) {
  // Size mapping
  const sizeMap = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }
  
  // Color mapping
  const colorMap = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white'
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div 
        className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeMap[size]} ${colorMap[color]}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      {text && (
        <motion.p 
          className="mt-4 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

