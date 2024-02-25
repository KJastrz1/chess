/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: '#A52A2A',
          light: '#A57164',
          dark: '#5C4033',
        },
      },
    },
  },
  plugins: [],
}
