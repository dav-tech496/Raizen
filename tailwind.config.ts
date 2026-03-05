import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: { DEFAULT: '#f59e0b', light: '#fbbf24' },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)',
      },
    },
  },
  plugins: [],
}

export default config
