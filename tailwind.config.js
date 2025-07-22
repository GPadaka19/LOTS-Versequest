/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#2C201B',
        primary: '#F5F1E9',
        secondary: '#44362E',
        accent: '#EAA91D',
        extraAccent: '#2B3322',
      },
    },
  },
  plugins: [],
};
