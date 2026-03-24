'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import { useLang } from '@/context/LangContext'
import { formatMMK } from '@/lib/plannerLogic'
import type { User } from '@supabase/supabase-js'

interface SavedItem {
  id: string
  title: string | null
  destination: string
  days: number
  budget: number
  created_at: string
}

interface Props {
  user: User
  itineraries: SavedItem[]
}

export default function DashboardClient({ user, itineraries }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { lang, t } = useLang()

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} />

      <main className="max-w-[480px] mx-auto px-[18px] pb-[90px] pt-6">
        <h1 className="text-[22px] font-semibold text-ink tracking-[-0.4px] mb-1">
          {t('myItineraries')}
        </h1>
        <p className="text-sm text-ink3 font-light mb-6">{user.email}</p>

        {itineraries.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-sm text-ink2 mb-4">{t('noSavedYet')}</p>
            <Link href="/planner" className="text-green font-medium text-sm">
              {t('planFirstTrip')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {itineraries.map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-border rounded-md p-4 shadow-sm"
              >
                <div className="text-[15px] font-semibold text-ink mb-1">
                  {item.title ?? `${item.days}-Day Trip to ${item.destination}`}
                </div>
                <div className="text-xs text-ink3 font-light">
                  {item.destination} · {item.days}{' '}
                  {lang === 'mm' ? 'ရက်' : item.days === 1 ? 'day' : 'days'} ·{' '}
                  {formatMMK(item.budget)} MMK/day
                </div>
                <div className="text-xs text-ink3 mt-1">
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </>
  )
}
