'use client'

import Link from 'next/link'
import { useLang } from '@/context/LangContext'

export default function Hero() {
  const { t } = useLang()

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #B91C1C 0%, #991B1B 45%, #7F1D1D 100%)' }}>
      {/* Subtle decorative circles */}
      <div className="absolute top-[-60px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/[0.04]" />
      <div className="absolute bottom-[-40px] left-[-30px] w-[140px] h-[140px] rounded-full bg-white/[0.03]" />
      <div className="absolute top-[30%] right-[10%] w-[80px] h-[80px] rounded-full bg-white/[0.05]" />

      <div className="relative z-10 px-[18px] pt-10 pb-9">

        {/* Status chip */}
        <div className="inline-flex items-center gap-[7px] bg-white/10 border border-white/20 rounded-full px-[13px] py-[5px] mb-5">
          <span className="w-[6px] h-[6px] rounded-full bg-[#FCA5A5] flex-shrink-0" />
          <span className="text-[11px] text-white/80 font-medium tracking-[0.04em]">
            {t('heroChip')}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(32px,8.5vw,44px)] font-medium text-white leading-[1.15] tracking-[-0.5px] mb-[10px]">
          {t('heroH1Line1')}
          <br />
          <em className="not-italic text-[#FCA5A5]">{t('heroH1Line2')}</em>
        </h1>

        {/* Subline */}
        <p className="text-[13.5px] text-white/60 leading-[1.65] font-light mb-7 max-w-[320px]">
          {t('heroSub')}
        </p>

        {/* Primary CTA */}
        <Link
          href="/planner"
          className="inline-flex items-center gap-2 bg-white text-[#B91C1C] text-[14px] font-semibold px-6 py-[14px] rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-transform active:scale-[0.97] mb-7"
        >
          {t('startPlanningFree')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {/* Trust bar */}
        <div className="flex flex-wrap gap-x-4 gap-y-[6px]">
          {[
            { icon: '✅', textKey: 'trustNoAccount' },
            { icon: '💰', textKey: 'trustMMK' },
            { icon: '🆓', textKey: 'trustFree' },
          ].map(({ icon, textKey }) => (
            <div key={textKey} className="flex items-center gap-[6px]">
              <span className="text-[13px]">{icon}</span>
              <span className="text-[12px] text-white/70 font-light">{t(textKey as any)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
