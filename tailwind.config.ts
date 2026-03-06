import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: { DEFAULT: '#f59e0b', light: '#fbbf24' },
        // Light mode: warm cream
        surface: {
          light: '#faf9f7',
          'light-2': '#f3f1ee',
          'light-3': '#eae7e2',
        },
        // Dark mode: dark slate grey
        slate: {
          850: '#1e2330',
          900: '#171c28',
          950: '#111520',
        },
      },
    },
  },
  plugins: [],
}

export default config
