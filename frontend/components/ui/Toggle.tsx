'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function Toggle({
  enabled,
  onChange,
  label,
  size = 'md',
  className,
  disabled = false,
}: ToggleProps) {
  // Size styles
  const sizeStyles = {
    sm: {
      toggle: 'w-8 h-4',
      circle: 'h-3 w-3',
      translateX: 16,
    },
    md: {
      toggle: 'w-11 h-6',
      circle: 'h-5 w-5',
      translateX: 20,
    },
    lg: {
      toggle: 'w-14 h-7',
      circle: 'h-6 w-6',
      translateX: 28,
    },
  };

  const toggleStyles = twMerge(
    `relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
      enabled ? 'bg-primary-600' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    sizeStyles[size].toggle,
    className
  );

  const handleClick = () => {
    if (!disabled) {
      onChange(!enabled);
    }
  };

  return (
    <div className="flex items-center">
      {label && (
        <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <button
        type="button"
        className={toggleStyles}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={enabled}
      >
        <span className="sr-only">Toggle</span>
        <motion.span
          className={`${
            sizeStyles[size].circle
          } rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out`}
          animate={{
            translateX: enabled ? sizeStyles[size].translateX : 0,
          }}
        />
      </button>
    </div>
  );
}

