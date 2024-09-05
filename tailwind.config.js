/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': {
          100: '#F8F5ED',
        },
        'navy': {
          800: '#1C2A3A',  // Dark navy color for the navigation bar
        },
      },
    },
  },
  plugins: [],
}