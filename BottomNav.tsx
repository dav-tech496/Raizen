'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/context/LangContext'

const NAV_ITEMS = [
  {
    href: '/',
    labelKey: 'home' as const,
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/destinations',
    labelKey: 'destinations' as const,
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" />
      </svg>
    ),
  },
  {
    href: '/planner',
    labelKey: 'planTrip' as const,
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useLang()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex bg-white/96 backdrop-blur-[16px] border-t border-border pb-[env(safe-area-inset-bottom,0px)] no-print">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-[3px] py-[11px] pb-2 min-h-[44px] transition-colors ${
              active ? 'text-green' : 'text-ink3'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
