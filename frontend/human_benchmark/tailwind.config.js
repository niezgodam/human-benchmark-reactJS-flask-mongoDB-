/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xsm' : '512px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl' : '1768px'
    },
    extend: {},
    keyframes: {
      drop: {
        '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
        '90%': { opacity: '1' },
        '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
      }
    },
    animation: {
      drop: 'drop 5s ease-in-out infinite',
    }
  },
  plugins: [require('tailwind-scrollbar-hide')],
}