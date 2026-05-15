'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import Hero from '@/components/Hero'
import { useLang } from '@/context/LangContext'

export default function HomeClient() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useLang()

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="max-w-[480px] mx-auto pb-[90px]">

        {/* ── HERO ── */}
        <Hero />

        {/* ── HOW IT WORKS ── */}
        <section className="px-[18px] pt-8 pb-7">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green mb-[5px]">
            {t('howItWorks')}
          </div>
          <div className="text-[21px] font-semibold text-ink tracking-[-0.35px] mb-5">
            {t('threeSteps')}
          </div>

          <div className="flex flex-col">
            {([
              ['step1Title', 'step1Desc'],
              ['step2Title', 'step2Desc'],
              ['step3Title', 'step3Desc'],
            ] as const).map(([title, desc], i) => (
              <div key={i} className="flex gap-4 pb-5 relative">
                {i < 2 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border2" />
                )}
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

        {/* ── TRUST SECTION ── */}
        <section className="px-[18px] pb-7">
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green mb-[5px]">
            {t('ourCredentials')}
          </div>
          <div className="text-[21px] font-semibold text-ink tracking-[-0.35px] mb-4">
            {t('trustedAndVerified')}
          </div>

          {/* DPTOA card — primary credential */}
          <div className="bg-surface border border-border rounded-md p-[18px] shadow-sm mb-3">
            <div className="flex items-center gap-4">
              {/* DPTOA logo — replace /dptoa-logo.png with your actual file in /public */}
              <div className="w-[64px] h-[64px] rounded-full overflow-hidden border-2 border-[#E0F0FB] flex-shrink-0 bg-[#EBF6FD]">
                <img
                  src="/dptoa-logo.png"
                  alt="DPTOA Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-[4px] flex-wrap">
                  <span className="text-[15px] font-semibold text-ink leading-tight">
                    {t('dptoaMember')}
                  </span>
                  {/* Verified pill */}
                  <span className="inline-flex items-center gap-[4px] bg-green-pale text-green text-[10px] font-semibold px-[8px] py-[3px] rounded-full flex-shrink-0">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t('verified')}
                  </span>
                </div>
                <div className="text-[12px] text-ink3 font-light leading-[1.45]">
                  {t('dptoaFullName')}
                </div>
              </div>
            </div>
          </div>

          {/* Built for Myanmar — secondary, lighter treatment */}
          <div className="flex items-center gap-3 px-[14px] py-[13px] bg-surface border border-border rounded-md">
            <span className="text-[24px] flex-shrink-0">🇲🇲</span>
            <div>
              <div className="text-[13px] font-semibold text-ink mb-[1px]">
                {t('builtForMyanmar')}
              </div>
              <div className="text-[12px] text-ink3 font-light">
                {t('builtForMyanmarDesc')}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA BANNER ── */}
        <div className="mx-[18px] bg-green rounded-lg px-[22px] py-7 text-center relative overflow-hidden mb-2">
          <div className="absolute top-[-50px] right-[-40px] w-[130px] h-[130px] rounded-full bg-white/[0.06]" />
          <div className="absolute bottom-[-30px] left-[-20px] w-[90px] h-[90px] rounded-full bg-white/[0.04]" />
          <div className="relative">
            <div className="text-xl font-semibold text-white tracking-[-0.3px] mb-2">
              {t('ctaTitle')}
            </div>
            <div className="text-[13px] text-white/70 mb-[22px] font-light leading-[1.5]">
              {t('ctaSub')}
            </div>
            <Link
              href="/planner"
              className="inline-block bg-white text-green text-sm font-semibold px-7 py-[14px] rounded-md shadow-[0_4px_14px_rgba(0,0,0,.15)] transition-transform active:scale-[0.97]"
            >
              {t('planMyTrip')}
            </Link>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="px-[18px] pt-7 pb-4 mt-8 border-t border-border">
          <div className="flex items-center gap-[9px] mb-2">
            <div className="w-[28px] h-[28px] rounded-[10px] bg-green flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.4px]">Raizen</span>
          </div>
          <p className="text-[13px] text-ink3 font-light mb-[22px]">{t('footerTagline')}</p>

          <div className="grid grid-cols-2 gap-4 mb-[22px]">
            <div>
              <div className="text-xs font-semibold tracking-[0.05em] uppercase text-ink mb-[10px]">
                {t('navigate')}
              </div>
              {([['/', 'home'], ['/destinations', 'destinations'], ['/planner', 'planTrip']] as const).map(([href, key]) => (
                <Link key={href} href={href} className="block text-[13px] text-ink2 font-light mb-[7px]">
                  {t(key as any)}
                </Link>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold tracking-[0.05em] uppercase text-ink mb-[10px]">
                {t('contact')}
              </div>
              <p className="text-[13px] text-ink2 font-light mb-[7px]">vibeauto3@gmail.com</p>
              <p className="text-[13px] text-ink2 font-light mb-[7px]">09751067759</p>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs text-ink3">© 2026 Raizen Myanmar. All rights reserved.</span>
            <span className="text-xs text-green flex items-center gap-[5px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#EF4444]" />
              {t('allSystemsOp')}
            </span>
          </div>
        </footer>
      </main>

      <BottomNav />
    </>
  )
}
