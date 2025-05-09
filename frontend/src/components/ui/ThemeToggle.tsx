'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { FiSun, FiMoon } from 'react-icons/fi';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'switch';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ThemeToggle({
  variant = 'icon',
  size = 'md',
  className = '',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Size classes
  const sizeClasses = {
    sm: {
      icon: 'h-4 w-4',
      button: 'text-xs px-2 py-1',
      container: 'h-5 w-9',
      circle: 'h-3 w-3',
    },
    md: {
      icon: 'h-5 w-5',
      button: 'text-sm px-3 py-1.5',
      container: 'h-6 w-11',
      circle: 'h-4 w-4',
    },
    lg: {
      icon: 'h-6 w-6',
      button: 'text-base px-4 py-2',
      container: 'h-7 w-14',
      circle: 'h-5 w-5',
    },
  };

  // Icon-only toggle
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 focus-visible-outline ${className}`}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <FiSun className={sizeClasses[size].icon} />
        ) : (
          <FiMoon className={sizeClasses[size].icon} />
        )}
      </button>
    );
  }

  // Button toggle
  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors duration-200 focus-visible-outline ${sizeClasses[size].button} ${className}`}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <>
            <FiSun className={`${sizeClasses[size].icon} mr-1.5`} />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <FiMoon className={`${sizeClasses[size].icon} mr-1.5`} />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Switch toggle
  return (
    <div className={`flex items-center ${className}`}>
      <FiSun className={`text-gray-500 dark:text-gray-400 mr-2 ${sizeClasses[size].icon}`} />
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isDark}
          onChange={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        />
        <div className={`
          ${sizeClasses[size].container}
          bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 
          dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:transition-all dark:border-gray-600 peer-checked:bg-primary-600
          after:${sizeClasses[size].circle}
        `}></div>
      </label>
      <FiMoon className={`text-gray-500 dark:text-gray-400 ml-2 ${sizeClasses[size].icon}`} />
    </div>
  );
}

