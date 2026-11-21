/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#111315', 2: '#202326', 3: '#2c3034' },
        bone: { DEFAULT: '#F4F2ED', 2: '#E9E5DC' },
        gold: { DEFAULT: '#C5A46D', light: '#D9BF8F', dark: '#A8864F' },
        stone: { DEFAULT: '#8A8780' },
        text: { DEFAULT: '#292929' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: { widest2: '0.32em' },
      maxWidth: { site: '1440px' },
      transitionTimingFunction: { premium: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
}
