'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative flex items-center w-14 h-7 rounded-full p-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #3b4a6b, #4a5a80)'
          : 'linear-gradient(135deg, #93c5fd, #3b82f6)',
      }}
    >
      {/* Track icons */}
      <Sun className="absolute left-1.5 w-3.5 h-3.5 text-yellow-200 transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 1 }} />
      <Moon className="absolute right-1.5 w-3.5 h-3.5 text-blue-200 transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }} />

      {/* Sliding pill */}
      <span
        className="relative z-10 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300"
        style={{ transform: isDark ? 'translateX(28px)' : 'translateX(0px)' }}
      >
        {isDark
          ? <Moon className="w-3.5 h-3.5 text-slate-700" />
          : <Sun className="w-3.5 h-3.5 text-amber-500" />
        }
      </span>
    </button>
  )
}
