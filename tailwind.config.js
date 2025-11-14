/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,jsx,tsx}',
    './src/layouts/**/*.{astro,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#111827',
        primary: '#38bdf8',
        accent: '#a855f7',
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444'
      },
      fontFamily: {
        sans: ['"Rajdhani"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

