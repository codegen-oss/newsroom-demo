import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
  component?: React.ElementType;
  children: React.ReactNode;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = 'body1', component, className = '', children, ...props }, ref) => {
    const variantStyles = {
      h1: 'text-4xl font-bold font-heading md:text-5xl',
      h2: 'text-3xl font-bold font-heading md:text-4xl',
      h3: 'text-2xl font-bold font-heading md:text-3xl',
      h4: 'text-xl font-bold font-heading md:text-2xl',
      h5: 'text-lg font-bold font-heading md:text-xl',
      h6: 'text-base font-bold font-heading md:text-lg',
      subtitle1: 'text-xl font-medium',
      subtitle2: 'text-lg font-medium',
      body1: 'text-base',
      body2: 'text-sm',
      caption: 'text-xs',
      overline: 'text-xs uppercase tracking-wider',
    };
    
    const Component = component || getDefaultComponent(variant);
    
    return (
      <Component
        ref={ref}
        className={`${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

function getDefaultComponent(variant: string): React.ElementType {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'subtitle1':
    case 'subtitle2':
      return 'h6';
    case 'body1':
    case 'body2':
      return 'p';
    case 'caption':
    case 'overline':
      return 'span';
    default:
      return 'p';
  }
}

