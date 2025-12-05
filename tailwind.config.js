const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        raleway: ['var(--font-raleway)'],
        arimo: ['var(--font-arimo)'],
        handwriting: ['var(--font-handwriting)'],
      },
      colors: {
        'primary': {
          DEFAULT: '#2563EB',
          'dark': '#1E40AF',
        },
        'accent': {
          DEFAULT: '#F97316',
          'dark': '#C2410C',
        },
        'neutral': '#f9fafb',
      }
    },
  },
  plugins: [],
}