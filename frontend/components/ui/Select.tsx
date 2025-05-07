'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

interface Option {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
  icon,
  error,
  label,
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Find the selected option
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

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
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          className={twMerge(
            `relative w-full cursor-default rounded-md bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm border ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            } focus:outline-none focus:ring-1 sm:text-sm ${
              disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
            }`,
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center">
            {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className="mr-2 flex-shrink-0">{selectedOption.icon}</span>
                )}
                <span className="block truncate">{selectedOption.label}</span>
              </>
            ) : (
              <span className="block truncate text-gray-500">{placeholder}</span>
            )}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
              role="listbox"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                    option.value === value
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <div className="flex items-center">
                    {option.icon && (
                      <span className="mr-2 flex-shrink-0">{option.icon}</span>
                    )}
                    <span className={`block truncate ${option.value === value ? 'font-medium' : 'font-normal'}`}>
                      {option.label}
                    </span>
                  </div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
}

