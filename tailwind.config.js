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
        salem: {
          light: '#428d59',
          DEFAULT: '#096e2a',
          dark: '#064a1d',
        },
        gin: {
          light: '#f0f4f2',
          DEFAULT: '#e4ede7',
          dark: '#c9d4cd',
        },
        'mine-shaft': {
          light: '#3a3a3a',
          DEFAULT: '#211e1e',
          dark: '#000000',
        },
        'bay-leaf': '#84b292',
        scorpion: '#5c5b5b',
        goblin: '#428d59',
        'gum-leaf': '#b2cebb',
        'silver-chalice': '#adacac',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'lifted': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
}
