'use client'

import { useLang } from '@/context/LangContext'

export default function Hero() {
  const { t } = useLang()

  return (
    <section
      className="relative overflow-hidden min-h-[420px] flex items-end"
      style={{
        background: [
          "linear-gradient(180deg,rgba(10,30,22,.55) 0%,rgba(10,30,22,.75) 60%,rgba(10,30,22,.92) 100%)",
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85&auto=format&fit=crop') center/cover no-repeat",
        ].join(','),
      }}
    >
      <div className="relative z-10 w-full px-[18px] pt-8 pb-9">
        {/* Chip */}
        <div className="inline-flex items-center gap-[7px] bg-white/10 border border-white/20 rounded-full px-[13px] py-[5px] mb-[18px]">
          <span className="w-[7px] h-[7px] rounded-full bg-green-light flex-shrink-0" />
          <span className="text-xs text-white/85">{t('heroChip')}</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(34px,9vw,46px)] font-medium text-white leading-[1.18] tracking-[-0.5px] mb-3">
          {t('heroH1Line1')}
          <br />
          <em className="not-italic text-green-light">{t('heroH1Line2')}</em>
        </h1>

        {/* Sub */}
        <p className="text-sm text-white/62 leading-[1.6] font-light mb-6 max-w-[340px]">
          {t('heroSub')}
        </p>

        {/* Two highlight cards */}
        <div className="grid grid-cols-2 gap-[10px]">
          <div className="bg-white/10 border border-white/18 backdrop-blur-[8px] rounded-md p-4">
            <div className="text-[22px] mb-2">💰</div>
            <div className="text-base font-bold text-white tracking-[-0.3px] mb-[3px]">
              {t('mmkPricingTitle')}
            </div>
            <div className="text-xs text-white/60 font-light leading-[1.3]">
              {t('mmkPricingDesc')}
            </div>
          </div>
          <div className="bg-white/10 border border-white/18 backdrop-blur-[8px] rounded-md p-4">
            <div className="text-[22px] mb-2">✅</div>
            <div className="text-base font-bold text-white tracking-[-0.3px] mb-[3px]">
              {t('freeTitle')}
            </div>
            <div className="text-xs text-white/60 font-light leading-[1.3]">
              {t('freeDesc')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
