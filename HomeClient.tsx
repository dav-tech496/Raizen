'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import Hero from '@/components/Hero'
import FeaturedCard from '@/components/FeaturedCard'
import StickyBookCTA from '@/components/StickyBookCTA'
import { useLang } from '@/context/LangContext'
import type { Destination } from '@/types'

interface Props { featured: Destination | null }

const WHY_ICONS = {
  time: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  money: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  people: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
}

export default function HomeClient({ featured }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useLang()
  const heroRef = useRef<HTMLElement>(null)

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="w-full max-w-screen-sm mx-auto pb-[90px] overflow-x-hidden">
        {/* Pass ref so Hero section can be observed by StickyBookCTA */}
        <section ref={heroRef}>
          <Hero />
        </section>

        {/* Featured destination */}
        <section className="px-4 pt-7 pb-7">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green mb-[5px]">{t('featuredDestination')}</div>
          <div className="text-[21px] font-semibold text-ink tracking-[-0.35px]">{t('readyToBook')}</div>
          {featured
            ? <FeaturedCard destination={featured} />
            : (
              <div className="mt-4 text-center py-10 text-ink3 text-sm">
                No featured destination yet — add one in Supabase Table Editor.
              </div>
            )
          }
        </section>

        {/* Why Raizen */}
        <section className="px-4 pt-1 pb-7">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green mb-[5px]">{t('whyRaizen')}</div>
          <div className="text-[21px] font-semibold text-ink tracking-[-0.35px]">{t('travelSmarter')}</div>
          <p className="text-sm text-ink2 mt-[6px] mb-[18px] leading-[1.55] font-light">{t('travelSmarterSub')}</p>
          <div className="flex flex-col gap-[11px]">
            {([
              ['time',   'bestTimeTitle',     'bestTimeDesc'],
              ['money',  'realPricingTitle',  'realPricingDesc'],
              ['people', 'everyTravelerTitle','everyTravelerDesc'],
            ] as const).map(([icon, title, desc]) => (
              <div key={icon} className="bg-surface border border-border rounded-md p-[18px] shadow-sm flex gap-[14px]">
                <div className="w-[42px] h-[42px] rounded-[12px] bg-green-pale flex-shrink-0 flex items-center justify-center text-green">
                  {WHY_ICONS[icon]}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-ink mb-1">{t(title)}</div>
                  <div className="text-[13px] text-ink2 leading-[1.55] font-light">{t(desc)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 pt-1 pb-7">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green mb-[5px]">{t('howItWorks')}</div>
          <div className="text-[21px] font-semibold text-ink tracking-[-0.35px] mb-[18px]">{t('threeSteps')}</div>
          <div className="flex flex-col">
            {([
              ['step1Title', 'step1Desc'],
              ['step2Title', 'step2Desc'],
              ['step3Title', 'step3Desc'],
            ] as const).map(([title, desc], i) => (
              <div key={i} className="flex gap-4 pb-6 relative">
                {i < 2 && <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border2" />}
                <div className="w-10 h-10 rounded-[12px] bg-green text-white text-sm font-semibold flex items-center justify-center flex-shrink-0 relative z-10">
                  0{i + 1}
                </div>
                <div className="pt-2 flex-1">
                  <div className="text-[15px] font-semibold text-ink mb-1">{t(title)}</div>
                  <div className="text-[13px] text-ink2 leading-[1.5] font-light">{t(desc)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <div className="mx-4 bg-green rounded-lg px-[22px] py-7 text-center relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-40px] w-[130px] h-[130px] rounded-full bg-white/[0.06]" />
          <div className="absolute bottom-[-30px] left-[-20px] w-[90px] h-[90px] rounded-full bg-white/[0.04]" />
          <div className="relative">
            <div className="text-xl font-semibold text-white tracking-[-0.3px] mb-2">{t('ctaTitle')}</div>
            <div className="text-[13px] text-white/70 mb-[22px] font-light leading-[1.5]">{t('ctaSub')}</div>
            <Link
              href="/planner"
              className="inline-flex items-center justify-center bg-white text-green text-sm font-semibold px-7 py-[14px] min-h-[44px] rounded-md shadow-[0_4px_14px_rgba(0,0,0,.15)] transition-transform active:scale-[0.97]"
            >
              {t('startPlanningFree')}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 pt-7 pb-4 mt-8 border-t border-border">
          <div className="flex items-center gap-[9px] mb-2">
            <div className="w-[28px] h-[28px] rounded-[10px] bg-green flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.4px]">Raizen</span>
          </div>
          <p className="text-[13px] text-ink3 font-light mb-[22px]">{t('footerTagline')}</p>
          <div className="grid grid-cols-2 gap-4 mb-[22px]">
            <div>
              <div className="text-xs font-semibold tracking-[0.05em] uppercase text-ink mb-[10px]">{t('navigate')}</div>
              {[['/', 'home'], ['/destinations', 'destinations'], ['/planner', 'planTrip']].map(([href, key]) => (
                <Link key={href} href={href} className="block text-[13px] text-ink2 font-light mb-[7px] min-h-[28px] leading-[1.8]">
                  {t(key as any)}
                </Link>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold tracking-[0.05em] uppercase text-ink mb-[10px]">{t('contact')}</div>
              <p className="text-[13px] text-ink2 font-light mb-[7px]">vibeauto3@gmail.com</p>
              <p className="text-[13px] text-ink2 font-light mb-[7px]">09751067759</p>
            </div>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs text-ink3">© 2026 Raizen Myanmar. All rights reserved.</span>
            <span className="text-xs text-green flex items-center gap-[5px]">
              <span className="w-[6px] h-[6px] rounded-full bg-green-light" />
              {t('allSystemsOp')}
            </span>
          </div>
        </footer>
      </main>

      {/* Mobile sticky CTA — appears after scrolling past hero */}
      <StickyBookCTA heroRef={heroRef} />

      <BottomNav />
    </>
  )
}
