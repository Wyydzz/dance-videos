/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        jazzRed: '#6b0213',
        jazzGold: '#b8860b',
        jazzCream: '#f3e8c3',
      }
    },
  },
  plugins: [],
}


