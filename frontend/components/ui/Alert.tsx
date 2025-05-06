import React from 'react';
import { motion } from 'framer-motion';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant = 'info', title, icon, onClose, className = '', children, ...props },
    ref
  ) => {
    const baseStyles = 'rounded-md p-4';
    
    const variantStyles = {
      info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    };
    
    const iconColors = {
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-green-500 dark:text-green-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
      error: 'text-red-500 dark:text-red-400',
    };
    
    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        {...props}
      >
        <div className="flex">
          {icon && <div className={`flex-shrink-0 mr-3 ${iconColors[variant]}`}>{icon}</div>}
          <div className="flex-1">
            {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
            <div className="text-sm">{children}</div>
          </div>
          {onClose && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    variant === 'info'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800 focus:ring-blue-600'
                      : variant === 'success'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-500 hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-600'
                      : variant === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:ring-yellow-600'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:ring-red-600'
                  }`}
                  onClick={onClose}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

