'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { useLang } from '@/components/theme/LangProvider'

export function AppNavbar() {
  const { lang, setLang } = useLang()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/raizen-logo.png"
            alt="Raizen"
            width={100}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle */}
          <div className="flex items-center bg-surface-2 border border-theme rounded-full p-0.5">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all font-body ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('mm')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all font-body ${lang === 'mm' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
            >
              မြန်မာ
            </button>
          </div>

          <ThemeToggle />

          <Link
            href="/planner"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 font-body"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Plan Trip' : 'စီစဉ်ရန်'}</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
