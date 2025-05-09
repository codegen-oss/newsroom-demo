/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep blues and purples for primary colors
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a4bcfc',
          400: '#8098f9',
          500: '#6371f1',
          600: '#4f4ce4',
          700: '#3a3cc8',
          800: '#3035a3',
          900: '#2d3282',
          950: '#1c1e4b',
        },
        // Electric purple accents
        accent: {
          50: '#fdf2ff',
          100: '#fae5ff',
          200: '#f5cbff',
          300: '#f0a0ff',
          400: '#e86aff',
          500: '#d83aff',
          600: '#c01ff7',
          700: '#a114d5',
          800: '#8415ad',
          900: '#6c168c',
          950: '#4a0066',
        },
        // Additional electric accent colors
        electric: {
          blue: '#00f2ff',
          purple: '#b700ff',
          pink: '#ff00e5',
          cyan: '#00ffcc',
        },
        // Dark mode colors
        dark: {
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0f3460',
          400: '#0a2342',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-xl': '0 12px 40px rgba(0, 0, 0, 0.15)',
        neon: '0 0 5px theme(colors.electric.blue), 0 0 20px theme(colors.electric.blue)',
        'neon-purple': '0 0 5px theme(colors.electric.purple), 0 0 20px theme(colors.electric.purple)',
      },
      backdropBlur: {
        glass: '10px',
        'glass-lg': '15px',
      },
      borderRadius: {
        'glass': '16px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 255, 0.5), 0 0 10px rgba(0, 242, 255, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 242, 255, 0.8), 0 0 20px rgba(0, 242, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            blockquote: {
              color: theme('colors.gray.700'),
              borderLeftColor: theme('colors.primary.200'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.primary.400'),
            },
            'ol > li::before': {
              color: theme('colors.primary.600'),
            },
            code: {
              color: theme('colors.accent.700'),
              backgroundColor: theme('colors.accent.50'),
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.primary.700'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.primary.600'),
            },
            'ol > li::before': {
              color: theme('colors.primary.400'),
            },
            code: {
              color: theme('colors.accent.300'),
              backgroundColor: theme('colors.accent.900'),
            },
            pre: {
              backgroundColor: theme('colors.dark.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class', // Enable dark mode with class
};
