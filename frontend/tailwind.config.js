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
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
};

