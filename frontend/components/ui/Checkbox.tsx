import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error = false,
      className = '',
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || React.useId();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };
    
    return (
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500 ${
              error ? 'border-red-500 dark:border-red-500' : ''
            } ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={helperText ? `${checkboxId}-description` : undefined}
            onChange={handleChange}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={checkboxId}
              className={`font-medium ${
                error ? 'text-red-700 dark:text-red-300' : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {label}
            </label>
          )}
          {helperText && (
            <p
              id={`${checkboxId}-description`}
              className={`mt-1 ${
                error ? 'text-red-600 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

