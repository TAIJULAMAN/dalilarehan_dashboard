
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001C54',
        secondary: '#FDFDFD',
        'theme-red': '#FF0D0D',
      },
      fontFamily: {
        'montserrat': ['Montserrat', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'ipad': '768px',
        'ipad-landscape': '1024px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
