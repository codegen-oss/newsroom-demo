'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible-outline disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm",
        secondary: "bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-300 active:bg-gray-300 dark:active:bg-dark-400",
        accent: "bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 shadow-sm",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-dark-200 text-primary-700 dark:text-primary-300",
        outline: "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200 active:bg-gray-100 dark:active:bg-dark-300",
        glass: "glass text-primary-700 dark:text-primary-300 hover:shadow-lg",
        danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
        success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm",
        link: "bg-transparent underline-offset-4 hover:underline text-primary-600 dark:text-primary-400 p-0 h-auto",
      },
      size: {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-2.5",
        xl: "text-lg px-6 py-3",
      },
      fullWidth: {
        true: "w-full",
      },
      iconPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      iconPosition: "left",
    },
  }
);

// Define props for the Button component
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

// Create the Button component
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      iconPosition,
      href,
      icon,
      isLoading = false,
      loadingText,
      ...props
    },
    ref
  ) => {
    // Determine the content to display
    const content = (
      <>
        {isLoading && (
          <svg
            className={`animate-spin -ml-1 mr-2 h-4 w-4 ${iconPosition === 'right' ? 'order-2 ml-2 mr-0' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        
        {icon && !isLoading && (
          <span className={`${iconPosition === 'left' ? 'mr-2' : 'ml-2 order-2'}`}>
            {icon}
          </span>
        )}
        
        <span>{isLoading && loadingText ? loadingText : children}</span>
      </>
    );

    // Compute the final className
    const buttonClasses = buttonVariants({
      variant,
      size,
      fullWidth,
      iconPosition,
      className,
    });

    // If href is provided, render as a Link
    if (href) {
      return (
        <Link href={href} className={buttonClasses}>
          {content}
        </Link>
      );
    }

    // Otherwise, render as a button
    return (
      <button ref={ref} className={buttonClasses} disabled={isLoading} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

