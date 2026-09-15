/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
    },
    extend: {
      colors: {
        brand: {
          50: '#EAF5F1',
          100: '#D2EAE1',
          200: '#A6D5C4',
          300: '#79BFA7',
          400: '#3DA37F',
          500: '#0EA372',
          600: '#087F5B',
          700: '#066247',
          800: '#054C38',
          900: '#043A2B',
        },
        ink: {
          DEFAULT: '#102A2E',
          soft: '#2B4247',
          muted: '#5C7378',
        },
        mint: {
          DEFAULT: '#EAF5F1',
          dark: '#DCEEE6',
        },
        cream: '#F8F6EF',
        sand: '#F1ECDF',
        amber: {
          50: '#FEF6E7',
          500: '#E8A93A',
          600: '#C6841A',
        },
        sky: {
          50: '#EAF5FB',
          500: '#3AA0D8',
          600: '#2680B4',
        },
        coral: {
          50: '#FDEEEC',
          500: '#E06B5A',
          600: '#C24E3E',
        },
        danger: {
          50: '#FDEDED',
          500: '#D9483A',
          600: '#B93A2E',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      fontSize: {
        'hero-mobile': ['2.75rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero': ['4.75rem', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'hero-lg': ['5.5rem', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        'container': '1360px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(16, 42, 46, 0.06)',
        card: '0 8px 24px -8px rgba(16, 42, 46, 0.16)',
        lift: '0 20px 45px -18px rgba(8, 127, 91, 0.35)',
        pop: '0 24px 60px -20px rgba(16, 42, 46, 0.28)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        dash: {
          to: { strokeDashoffset: '0' },
        },
        growRing: {
          '0%': { strokeDashoffset: 'var(--ring-empty)' },
          '100%': { strokeDashoffset: 'var(--ring-fill)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.6s ease both',
        float: 'float 5s ease-in-out infinite',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        dash: 'dash 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        ring: 'growRing 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
}
