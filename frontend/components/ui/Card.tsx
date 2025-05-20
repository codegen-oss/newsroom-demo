'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'bordered' | 'flat'
  onClick?: () => void
  isHoverable?: boolean
  isClickable?: boolean
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  onClick,
  isHoverable = false,
  isClickable = false
}: CardProps) {
  // Variant styles
  const variantStyles = {
    default: 'bg-dark-800 shadow-lg',
    elevated: 'bg-dark-800 shadow-xl',
    bordered: 'bg-dark-800 border border-dark-700',
    flat: 'bg-dark-800'
  }
  
  // Hover effect
  const hoverStyle = isHoverable ? 'hover:border-primary-700 hover:shadow-lg transition-all duration-300' : ''
  
  // Click effect
  const clickStyle = isClickable ? 'cursor-pointer active:scale-[0.99] transition-transform duration-100' : ''
  
  // Combined styles
  const cardStyles = `
    rounded-lg overflow-hidden
    ${variantStyles[variant]} 
    ${hoverStyle} 
    ${clickStyle} 
    ${className}
  `
  
  return (
    <motion.div
      className={cardStyles}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

