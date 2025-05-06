import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      helperText,
      error = false,
      fullWidth = false,
      className = '',
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();
    
    const baseStyles = 'block rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
    const errorStyles = error
      ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 dark:text-red-100'
      : '';
    const widthStyle = fullWidth ? 'w-full' : '';
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${baseStyles} ${errorStyles} ${widthStyle} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? `${selectId}-description` : undefined}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && (
          <p
            id={`${selectId}-description`}
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

