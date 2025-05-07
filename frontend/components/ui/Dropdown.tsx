'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  width = 'w-48',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -5,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className={twMerge("relative", className)} ref={dropdownRef}>
      {/* Trigger button */}
      <div 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </div>

      {/* Dropdown content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 mt-2 ${width} rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 ${
              align === 'left' ? 'left-0' : 'right-0'
            }`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            <div className="py-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dropdown item component
interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  className,
  active = false,
}: DropdownItemProps) {
  const baseStyles = "block w-full text-left px-4 py-2 text-sm";
  const activeStyles = active 
    ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100" 
    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
  
  const itemStyles = twMerge(baseStyles, activeStyles, className);

  return (
    <button
      className={itemStyles}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

