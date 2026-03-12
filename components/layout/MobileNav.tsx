'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Sparkles } from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'

export function MobileNav() {
  const pathname = usePathname()
  const { lang } = useLang()

  const items = [
    { href: '/',             icon: Home,     en: 'Home',         mm: 'မူလ' },
    { href: '/destinations', icon: MapPin,   en: 'Destinations', mm: 'ခရီးစဉ်' },
    { href: '/planner',      icon: Sparkles, en: 'Plan Trip',    mm: 'စီစဉ်ရန်' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-card/95 backdrop-blur-xl border-t border-card shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {items.map(item => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px] ${
                  active ? 'text-blue-600 dark:text-blue-400' : 'text-muted hover:text-secondary'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-blue-600/10 dark:bg-blue-400/10' : ''}`}>
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                  {active && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 border-2 border-card" />}
                </div>
                <span className={`text-[10px] font-semibold font-body leading-none ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {lang === 'en' ? item.en : item.mm}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
