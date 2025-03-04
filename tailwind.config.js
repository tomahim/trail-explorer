/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'trail-gradient': 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
      },
      colors: {
        'trail-primary': '#2c3e50',
        'trail-secondary': '#34495e',
        'trail-accent': '#3498db'
      }
    },
  },
  plugins: [],
}