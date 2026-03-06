'use client'

import Link from 'next/link'
import { MapPin, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { useLang } from '@/components/theme/LangProvider'

export function AppNavbar() {
  const { lang, setLang } = useLang()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-primary">Raizen</span>
        </Link>

        {/* Right side only */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle */}
          <div className="flex items-center bg-surface-2 border border-theme rounded-full p-0.5">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('mm')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'mm' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              မြန်မာ
            </button>
          </div>

          {/* Dark/light toggle */}
          <ThemeToggle />

          {/* Plan Trip CTA */}
          <Link
            href="/planner"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Plan Trip' : 'စီစဉ်ရန်'}</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
