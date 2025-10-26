/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salem: '#096e2a',
        gin: '#e4ede7',
        'mine-shaft': '#211e1e',
        'bay-leaf': '#84b292',
        scorpion: '#5c5b5b',
        goblin: '#428d59',
        'gum-leaf': '#b2cebb',
        'silver-chalice': '#adacac',
      },
    },
  },
  plugins: [],
}
