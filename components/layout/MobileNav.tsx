'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Sparkles } from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'

export function MobileNav() {
  const pathname = usePathname()
  const { lang } = useLang()

  const items = [
    { href: '/',             icon: Home,     labelEn: 'Home',         labelMm: 'မူလ' },
    { href: '/destinations', icon: MapPin,   labelEn: 'Destinations', labelMm: 'ခရီးစဉ်' },
    { href: '/planner',      icon: Sparkles, labelEn: 'Plan Trip',    labelMm: 'စီစဉ်ရန်' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-xl border-t border-card safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(item => {
          const active = pathname === item.href
          const Icon = item.icon
          const label = lang === 'en' ? item.labelEn : item.labelMm
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-all ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              <div className={`relative p-1.5 rounded-lg transition-all ${active ? 'bg-blue-600/10 dark:bg-blue-400/10' : ''}`}>
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </div>
              <span className={`text-[10px] font-semibold font-body ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
