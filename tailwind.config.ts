import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['var(--font-dm-sans)',  'DM Sans',         'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      colors: {
        bg:       '#F5F3EE',
        surface:  '#FFFFFF',
        surface2: '#EFEDE8',
        ink:      '#1C1C1A',
        ink2:     '#5C5A55',
        ink3:     '#9A9890',
        green: {
          DEFAULT: '#2D6A4F',
          mid:     '#40916C',
          light:   '#52B788',
          pale:    '#D8F3DC',
        },
        amber: {
          DEFAULT: '#D4A017',
          pale:    '#FEF3C7',
        },
        border:  '#E2DFD8',
        border2: '#CCCAC4',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '22px',
        xl: '30px',
      },
      boxShadow: {
        sm: '0 1px 4px rgba(0,0,0,.07)',
        md: '0 4px 18px rgba(0,0,0,.09)',
        lg: '0 10px 40px rgba(0,0,0,.11)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
