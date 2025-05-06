import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    
    const baseStyles = 'block rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
    const errorStyles = error
      ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 dark:text-red-100 placeholder-red-300'
      : '';
    const widthStyle = fullWidth ? 'w-full' : '';
    const iconStyles = leftIcon || rightIcon ? 'pl-10' : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${baseStyles} ${errorStyles} ${widthStyle} ${iconStyles} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={helperText ? `${inputId}-description` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && (
          <p
            id={`${inputId}-description`}
            className={`mt-1 text-sm ${
              error ? 'text-red-600 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

