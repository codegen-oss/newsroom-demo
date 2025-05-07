'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  animate = true,
  onClick,
  hover = true,
}: CardProps) {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
  const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-lg' : '';
  const cardStyles = twMerge(baseStyles, hoverStyles, className);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  if (animate) {
    return (
      <motion.div
        className={cardStyles}
        initial="hidden"
        animate="visible"
        whileHover={hover ? "hover" : undefined}
        variants={cardVariants}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardStyles} onClick={onClick}>
      {children}
    </div>
  );
}

