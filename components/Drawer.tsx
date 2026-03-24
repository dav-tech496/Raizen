'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export default function Drawer({ isOpen, onClose, user }: DrawerProps) {
  const { lang, setLang, t } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navLinks = [
    {
      href: '/',
      label: t('home'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: '/destinations',
      label: t('destinations'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" />
        </svg>
      ),
    },
    {
      href: '/planner',
      label: t('planTrip'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    onClose()
    router.push('/')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[300] bg-black/45 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 bottom-0 z-[310] w-[280px] bg-surface flex flex-col
          shadow-[-8px_0_40px_rgba(0,0,0,.15)]
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-[9px]">
            <div className="w-8 h-8 rounded-[10px] bg-green flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.4px]">Raizen</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-[34px] h-[34px] rounded-[9px] bg-surface2 flex items-center justify-center text-ink2 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="py-3 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-[14px] px-5 py-[14px] text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-green-pale text-green'
                  : 'text-ink hover:bg-surface2'
              }`}
            >
              <span className={isActive(link.href) ? 'text-green' : 'text-ink3'}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-border mx-5 my-2" />

          {/* Auth links */}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-[14px] px-5 py-[14px] text-base font-medium text-ink hover:bg-surface2 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t('dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-[14px] px-5 py-[14px] text-base font-medium text-ink hover:bg-surface2 transition-colors w-full text-left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-[14px] px-5 py-[14px] text-base font-medium text-ink hover:bg-surface2 transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center gap-[14px] px-5 py-[14px] text-base font-medium text-green hover:bg-green-pale transition-colors"
              >
                {t('register')}
              </Link>
            </>
          )}

          <div className="h-px bg-border mx-5 my-2" />

          {/* Language switcher */}
          <div className="px-5 py-4">
            <div className="text-xs font-medium tracking-[0.06em] uppercase text-ink3 mb-[10px]">
              {t('language')}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-[10px] rounded-[10px] text-sm font-medium border-[1.5px] transition-all ${
                  lang === 'en'
                    ? 'border-green bg-green-pale text-green'
                    : 'border-border2 bg-surface text-ink2'
                }`}
              >
                EN — English
              </button>
              <button
                onClick={() => setLang('mm')}
                className={`flex-1 py-[10px] rounded-[10px] text-sm font-medium border-[1.5px] transition-all ${
                  lang === 'mm'
                    ? 'border-green bg-green-pale text-green'
                    : 'border-border2 bg-surface text-ink2'
                }`}
              >
                မြန်မာ
              </button>
            </div>
          </div>
        </nav>

        {/* Promo banner */}
        <div className="mx-4 mb-5 bg-green rounded-md p-4 text-center">
          <div className="text-sm font-semibold text-white mb-1">
            {lang === 'mm' ? 'အခမဲ့ ခရီးစဉ်စီစဉ်ပါ' : 'Plan your trip free'}
          </div>
          <div className="text-xs text-white/70 mb-3 leading-[1.4]">
            {lang === 'mm' ? 'တကယ့် MMK စျေးနှုန်းများ။ ဝှက်ထားသော ကြေးမရှိ။' : 'Real MMK prices. No hidden fees.'}
          </div>
          <Link
            href="/planner"
            onClick={onClose}
            className="block bg-white text-green text-[13px] font-semibold py-[9px] rounded-[9px]"
          >
            {lang === 'mm' ? 'စတင်စီစဉ်ရန် →' : 'Start Planning →'}
          </Link>
        </div>
      </div>
    </>
  )
}
