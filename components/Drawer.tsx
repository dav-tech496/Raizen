'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/context/LangContext'
import type { User } from '@supabase/supabase-js'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

const NAV_LINKS = [
  { href: '/',             labelKey: 'home'         as const },
  { href: '/destinations', labelKey: 'destinations' as const },
  { href: '/planner',      labelKey: 'planTrip'     as const },
]

export default function Drawer({ isOpen, onClose, user }: DrawerProps) {
  const { lang, setLang, t } = useLang()
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    onClose()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[300] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-[400] h-full w-[82vw] max-w-[340px] bg-bg shadow-lg flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-[18px] h-[58px] border-b border-border">
          <div className="flex items-center gap-[9px]">
            <div className="w-8 h-8 rounded-[10px] bg-green flex items-center justify-center flex-shrink-0">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.4px] text-ink">Raizen</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-[10px] bg-surface2 border border-border flex items-center justify-center text-ink2 transition-colors active:bg-border"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-[18px] pt-5 gap-1 flex-1">
          {NAV_LINKS.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-[13px] rounded-[12px] text-[15px] font-medium text-ink hover:bg-surface2 active:bg-border transition-colors"
            >
              {t(labelKey)}
            </Link>
          ))}

          <div className="my-3 border-t border-border" />

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-[13px] rounded-[12px] text-[15px] font-medium text-ink hover:bg-surface2 active:bg-border transition-colors"
              >
                {t('dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-[13px] rounded-[12px] text-[15px] font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors text-left"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-[13px] rounded-[12px] text-[15px] font-medium text-ink hover:bg-surface2 transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-[13px] rounded-[12px] text-[15px] font-semibold text-white bg-green hover:bg-green-mid transition-colors mt-1"
              >
                {t('register')}
              </Link>
            </>
          )}
        </nav>

        <div className="px-[18px] pb-8 pt-4 border-t border-border">
          <p className="text-xs font-semibold tracking-[0.06em] uppercase text-ink3 mb-3">{t('language')}</p>
          <div className="flex gap-2">
            {(['en', 'mm'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 py-[11px] rounded-[10px] text-sm font-semibold border transition-colors ${
                  lang === l
                    ? 'bg-green text-white border-green'
                    : 'bg-surface2 text-ink2 border-border2 hover:border-green/50'
                }`}
              >
                {l === 'en' ? 'English' : 'မြန်မာ'}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
