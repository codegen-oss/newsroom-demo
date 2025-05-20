'use client'

import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  icon?: ReactNode
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon
}: BadgeProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-secondary-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
    default: 'bg-dark-700 text-white'
  }
  
  // Size styles
  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1 text-sm'
  }
  
  // Combined styles
  const badgeStyles = `
    inline-flex items-center rounded-full font-medium
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${className}
  `
  
  return (
    <span className={badgeStyles}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  )
}

