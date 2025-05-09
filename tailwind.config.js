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
          DEFAULT: '#1a237e',
          light: '#534bae',
          dark: '#000051',
        },
        secondary: {
          DEFAULT: '#7b1fa2',
          light: '#ae52d4',
          dark: '#4a0072',
        },
        accent: {
          DEFAULT: '#00b0ff',
          light: '#69e2ff',
          dark: '#0081cb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

