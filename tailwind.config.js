/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB', // Light gray background
        primary: {
          DEFAULT: '#096e2a', // Main deep teal from reference
          hover: '#065a22',
          light: '#e6f1e9',
        },
        secondary: '#6B7280', // Medium gray for text
        accent: '#3B82F6', // A blue for highlights if needed, can be adjusted
        border: '#E5E7EB', // Light gray for borders
        card: '#FFFFFF', // Card background
        text: {
          primary: '#1F2937', // Dark gray for primary text
          secondary: '#6B7280', // Lighter gray for secondary text
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      boxShadow: {
        'card': '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        'interactive': '0 0 0 2px #F9FAFB, 0 0 0 4px #a4cafe',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}
