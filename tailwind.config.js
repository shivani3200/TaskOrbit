// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This is crucial for Tailwind to scan your files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}