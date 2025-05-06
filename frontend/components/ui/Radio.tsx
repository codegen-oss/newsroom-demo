import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  options: RadioOption[];
  value?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      options,
      value,
      label,
      helperText,
      error = false,
      onChange,
      orientation = 'vertical',
      className = '',
      ...props
    },
    ref
  ) => {
    const groupId = React.useId();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label
            className={`block text-sm font-medium mb-2 ${
              error ? 'text-red-700 dark:text-red-300' : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {label}
          </label>
        )}
        <div
          className={`space-${orientation === 'vertical' ? 'y' : 'x'}-4 ${
            orientation === 'horizontal' ? 'flex items-center' : ''
          }`}
          role="radiogroup"
          aria-labelledby={label ? `${groupId}-label` : undefined}
        >
          {options.map((option) => {
            const optionId = `${groupId}-${option.value}`;
            return (
              <div key={option.value} className="flex items-center">
                <input
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onChange={handleChange}
                  className={`h-4 w-4 border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500 ${
                    error ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                />
                <label
                  htmlFor={optionId}
                  className={`ml-3 block text-sm font-medium ${
                    option.disabled
                      ? 'text-neutral-400 dark:text-neutral-500'
                      : error
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
        {helperText && (
          <p
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

