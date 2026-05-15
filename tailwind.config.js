/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: {
          50:  '#f0faf4',
          100: '#dcf4e6',
          200: '#bce8ce',
          300: '#8dd4ad',
          400: '#57b882',
          500: '#339966',
          600: '#247a50',
          700: '#1a6b42',
          800: '#154f33',
          900: '#0f3524',
          950: '#0a2218',
        },
        saffron: {
          50:  '#fff8f0',
          100: '#ffecd9',
          200: '#ffd4ad',
          300: '#ffb475',
          400: '#ff8c3a',
          500: '#e05c1a',
          600: '#c44b10',
          700: '#a03c0d',
          800: '#7d3011',
          900: '#662912',
        },
        gold: {
          400: '#f0b429',
          500: '#d4961a',
          600: '#b8800f',
        },
        cream: '#F8F5F0',
        ink: '#0F1E17',
      },
      backgroundImage: {
        'mesh-green': 'radial-gradient(at 40% 20%, #247a50 0px, transparent 50%), radial-gradient(at 80% 0%, #0f3524 0px, transparent 50%), radial-gradient(at 0% 50%, #154f33 0px, transparent 50%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'score-fill': 'scoreFill 1s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scoreFill: {
          '0%': { strokeDashoffset: '251' },
          '100%': { strokeDashoffset: 'var(--target-offset)' },
        },
      },
    },
  },
  plugins: [],
};
