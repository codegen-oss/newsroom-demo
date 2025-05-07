'use client';

import { twMerge } from 'tailwind-merge';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
}: SkeletonProps) {
  // Base styles
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';
  
  // Variant styles
  const variantStyles = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };
  
  // Animation styles
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };
  
  // Combine all styles
  const skeletonStyles = twMerge(
    baseStyles,
    variantStyles[variant],
    animationStyles[animation],
    className
  );

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return <div className={skeletonStyles} style={style} />;
}

