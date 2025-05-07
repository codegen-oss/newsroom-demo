// Theme configuration for the application
// This file centralizes theme-related constants and utilities

// Animation variants for Framer Motion
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
};

export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Subscription tier colors and styles
export const subscriptionTierStyles = {
  free: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-800',
    icon: 'text-green-500'
  },
  individual: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    badge: 'bg-purple-100 text-purple-800',
    icon: 'text-purple-500'
  },
  organization: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-800',
    icon: 'text-blue-500'
  }
};

// Access tier colors and styles (similar to subscription tiers)
export const accessTierStyles = {
  free: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  premium: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200'
  },
  organization: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  }
};

// Category colors for consistent styling
export const categoryColors: Record<string, string> = {
  politics: 'bg-red-100 text-red-800',
  economy: 'bg-blue-100 text-blue-800',
  technology: 'bg-indigo-100 text-indigo-800',
  science: 'bg-green-100 text-green-800',
  markets: 'bg-yellow-100 text-yellow-800',
  diplomacy: 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800'
};

// Get category color with fallback to default
export const getCategoryColor = (category: string): string => {
  return categoryColors[category.toLowerCase()] || categoryColors.default;
};

// Screen breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index values for consistent layering
export const zIndex = {
  navbar: 50,
  modal: 100,
  tooltip: 75,
  dropdown: 40,
};

