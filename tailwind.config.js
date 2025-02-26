/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      colors: {
        primary: {
          100: '#6e3ddc',
          200: '#6337c6',
          300: '#5831b0',
          400: '#4d2b9a',
          500: '#422584',
          600: '#371f6e',
          700: '#2c1858',
          800: '#211242',
          900: '#160c2c',
        },
        dark: {
          100: '#1C1C1D',
          200: '#27272A',
          300: '#3A3A3B',
          400: '#4A4A4B',
          500: '#606061',
          600: '#828285',
          700: '#9E9EA0',
          800: '#B0B0B2',
          900: '#C8C8CA',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
