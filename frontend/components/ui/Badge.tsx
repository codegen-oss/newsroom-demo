'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
  icon?: ReactNode;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  animate = true,
  icon,
}: BadgeProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };
  
  // Combine all styles
  const badgeStyles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const badgeVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  if (animate) {
    return (
      <motion.span
        className={badgeStyles}
        initial="initial"
        animate="animate"
        variants={badgeVariants}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </motion.span>
    );
  }

  return (
    <span className={badgeStyles}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}

