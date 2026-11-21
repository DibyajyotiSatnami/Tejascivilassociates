/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#071C3A', 2: '#0C2850', 3: '#12356A' },
        navy: { DEFAULT: '#012A55', light: '#1D4C8C' },
        bone: { DEFAULT: '#F6F8FB', 2: '#E9EEF5' },
        // sun amber from the logo
        gold: { DEFAULT: '#F2A71B', light: '#F7C35B', dark: '#B87A06' },
        stone: { DEFAULT: '#5B6472' },
        text: { DEFAULT: '#1F2937' },
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
