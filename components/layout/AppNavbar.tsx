'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Sparkles, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function AppNavbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState<'en' | 'mm'>('en')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isActive = (href: string) =>
    pathname === href ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-secondary hover:text-primary'

  const navLinks = [
    { href: '/destinations', label: lang === 'en' ? 'Destinations' : 'ခရီးစဉ်များ' },
    { href: '/planner', label: lang === 'en' ? 'Plan Trip' : 'ခရီးစီစဉ်ရန်' },
    ...(user ? [{ href: '/dashboard', label: lang === 'en' ? 'Dashboard' : 'ဒက်ရှ်ဘုတ်' }] : []),
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-primary">Raizen</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href)}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <div className="flex items-center bg-surface-2 border border-theme rounded-full p-0.5">
              <button onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}>
                EN
              </button>
              <button onClick={() => setLang('mm')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'mm' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}>
                မြန်မာ
              </button>
            </div>

            {/* Dark/light toggle */}
            <ThemeToggle />

            {/* Auth - desktop */}
            {user ? (
              <Link href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-surface-2 border border-theme rounded-xl text-sm font-medium text-primary hover:bg-surface-3 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
              </Link>
            ) : (
              <Link href="/login"
                className="hidden sm:block text-sm font-medium text-secondary hover:text-primary transition-colors">
                {lang === 'en' ? 'Sign In' : 'ဝင်ရောက်ရန်'}
              </Link>
            )}

            <Link href="/planner"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Plan Trip' : 'စီစဉ်ရန်'}</span>
            </Link>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-surface-2 border border-theme text-secondary hover:text-primary transition-colors">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-card border-t border-card px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === link.href ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-secondary hover:bg-surface-2 hover:text-primary'}`}>
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:bg-surface-2 hover:text-primary transition-colors">
                {lang === 'en' ? 'Sign In' : 'ဝင်ရောက်ရန်'}
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
