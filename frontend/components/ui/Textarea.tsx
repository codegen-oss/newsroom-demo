import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error = false,
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    
    const baseStyles = 'block rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
    const errorStyles = error
      ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 dark:text-red-100 placeholder-red-300'
      : '';
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`${baseStyles} ${errorStyles} ${widthStyle} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? `${textareaId}-description` : undefined}
          {...props}
        />
        {helperText && (
          <p
            id={`${textareaId}-description`}
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

