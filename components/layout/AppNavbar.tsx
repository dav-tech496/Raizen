'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, MapPin, Sparkles, Sun, Moon } from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'
import { useTheme } from '@/components/theme/ThemeProvider'

export function AppNavbar() {
  const { lang, setLang } = useLang()
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  const navItems = [
    { href: '/',             icon: Home,     en: 'Home',         mm: 'မူလစာမျက်နှာ' },
    { href: '/destinations', icon: MapPin,   en: 'Destinations', mm: 'ခရီးစဉ်များ' },
    { href: '/planner',      icon: Sparkles, en: 'Plan Trip',    mm: 'ခရီးစီစဉ်ရန်' },
  ]

  return (
    <div ref={menuRef} className="fixed top-0 left-0 right-0 z-50">
      {/* Main bar */}
      <nav className="bg-card/95 backdrop-blur-xl border-b border-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/raizen-logo.png"
              alt="Raizen"
              width={140}
              height={44}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Hamburger — all screen sizes */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-2 border border-theme text-secondary hover:text-primary transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Dropdown menu */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-card border-b border-card shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
            {/* Nav links */}
            {navItems.map(item => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors font-body ${
                    active
                      ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                      : 'text-secondary hover:bg-surface-2 hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {lang === 'en' ? item.en : item.mm}
                </Link>
              )
            })}

            {/* Divider */}
            <div className="h-px bg-surface-2 mx-1 my-2" />

            {/* Language + Theme row */}
            <div className="flex items-center justify-between px-4 py-2">
              {/* Language toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-body">{lang === 'en' ? 'Language' : 'ဘာသာစကား'}</span>
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
              </div>

              {/* Theme toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-body">{theme === 'dark' ? (lang === 'en' ? 'Dark' : 'မှောင်') : (lang === 'en' ? 'Light' : 'တောက်')}</span>
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-theme text-secondary hover:text-primary transition-colors"
                >
                  {theme === 'dark'
                    ? <><Moon className="w-4 h-4" /></>
                    : <><Sun className="w-4 h-4" /></>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
