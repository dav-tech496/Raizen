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
        bg:       '#FDF5F5',
        surface:  '#FFFFFF',
        surface2: '#F5EDED',
        ink:      '#1C1A1A',
        ink2:     '#5C5558',
        ink3:     '#9A9090',
        // Primary brand — deep crimson red
        green: {
          DEFAULT: '#B91C1C',   // was #2D6A4F
          mid:     '#DC2626',   // was #40916C
          light:   '#EF4444',   // was #52B788
          pale:    '#FEE2E2',   // was #D8F3DC
        },
        amber: {
          DEFAULT: '#D4A017',
          pale:    '#FEF3C7',
        },
        border:  '#E8DEDE',
        border2: '#D4C8C8',
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
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      lineClamp: {
        3: '3',
      },
    },
  },
  plugins: [],
}

export default config
