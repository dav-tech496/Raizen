'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import { useLang } from '@/context/LangContext'
import type { Destination } from '@/types'

interface Props { destinations: Destination[] }

const COMING_SOON = [
  { name: 'Bagan',        region: { en: 'Mandalay Region', mm: 'မန္တလေးတိုင်းဒေသကြီး' }, icon: '🏛️' },
  { name: 'Inle Lake',    region: { en: 'Shan State',      mm: 'ရှမ်းပြည်နယ်' },          icon: '🌊' },
  { name: 'Ngapali Beach',region: { en: 'Rakhine State',   mm: 'ရခိုင်ပြည်နယ်' },         icon: '🏖️' },
]

export default function DestinationsClient({ destinations }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { lang, t } = useLang()
  const featured = destinations.find((d) => d.slug === 'ngwesaung') ?? destinations[0]

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="max-w-[480px] mx-auto pb-[90px]">
        {/* Hero */}
        <section
          className="relative overflow-hidden min-h-[200px] flex items-end"
          style={{ background: `linear-gradient(180deg,rgba(10,30,22,.5) 0%,rgba(10,30,22,.85) 100%),url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85&auto=format&fit=crop') center/cover` }}
        >
          <div className="relative z-10 w-full px-[18px] pb-8 pt-7">
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/50 mb-2">{t('destinations')}</div>
            <h1 className="font-serif text-[28px] font-medium text-white tracking-[-0.3px] mb-[6px] leading-[1.2]">
              {lang === 'mm' ? 'သင် ဘယ်ကိုသွားချင်သနည်း?' : <>Where do you<br />want to go?</>}
            </h1>
            <p className="text-[13px] text-white/55 font-light leading-[1.5]">
              {lang === 'mm' ? 'မြန်မာနိုင်ငံတစ်ဝှမ်းမှ ရွေးချယ်ထားသောနေရာများ — ထပ်မံ မကြာမီ လာမည်' : 'Handpicked destinations across Myanmar — more coming soon.'}
            </p>
          </div>
        </section>

        <div className="px-[18px] pt-6 pb-4">
          {/* Available */}
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green mb-3">{t('availableNow')}</div>
          {featured && (
            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-md">
              <div className="relative h-[220px]">
                <Image
                  src={featured.image_url ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85&auto=format&fit=crop'}
                  alt={featured.name} fill className="object-cover"
                  sizes="(max-width: 480px) 100vw, 480px" priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-[14px] left-4">
                  <div className="text-[11px] text-white/65 uppercase tracking-[0.05em] mb-[3px]">
                    {featured.region ?? (lang === 'mm' ? 'အင်းဝဒေသ' : 'Ayeyarwady Region')}
                  </div>
                  <div className="text-xl font-semibold text-white tracking-[-0.3px]">{featured.name}</div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold bg-amber text-white rounded-full px-[11px] py-[5px]">★ 4.8</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-medium bg-black/55 text-white rounded-full px-[11px] py-[5px]">{t('availableNow')}</span>
                </div>
              </div>
              <div className="p-[18px]">
                <p className="text-[13px] text-ink2 leading-[1.6] font-light mb-[14px]">
                  {featured.description ?? (lang === 'mm' ? 'ပင်လယ်ကွေ့တွင် မထိတွေ့ရသောသဲဖြူ ကမ်းနံဘေး ၂၀ ကီလိုမီတာ' : 'A 20km stretch of untouched white sand on the Bay of Bengal.')}
                </p>
                <div className="flex flex-wrap gap-[6px] mb-4">
                  {(lang === 'mm' ? ['ကမ်းနံဘေး', 'ညဦး ၂–၇', 'ရေကစားနည်း', 'ပင်လယ်စာ'] : ['Beach', '2–7 nights', 'Water Sports', 'Seafood']).map((tag) => (
                    <span key={tag} className="text-[11px] px-[10px] py-1 rounded-full bg-surface2 text-ink2 border border-border">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link href="/planner" className="flex-1 bg-green text-white text-[13px] font-semibold py-3 rounded-sm text-center">
                    {lang === 'mm' ? 'ဤခရီးစဉ်စီစဉ်ရန်' : 'Plan This Trip'}
                  </Link>
                  <Link href={`/destinations/${featured.slug}`} className="px-4 py-3 rounded-sm text-[13px] font-medium text-ink2 border border-border2">
                    {lang === 'mm' ? 'အသေးစိတ်ကြည့်ရန်' : 'Full Details'}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Coming soon */}
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green mt-7 mb-3">{t('comingSoon')}</div>
          <div className="flex flex-col gap-[11px]">
            {COMING_SOON.map((dest) => (
              <div key={dest.name} className="bg-surface border border-border rounded-md p-4 flex items-center gap-[14px] shadow-sm">
                <div className="w-12 h-12 rounded-[13px] bg-surface2 flex-shrink-0 flex items-center justify-center text-[22px]">{dest.icon}</div>
                <div>
                  <div className="text-[15px] font-semibold text-ink mb-[3px]">{dest.name}</div>
                  <div className="text-xs text-ink3 mb-[7px]">{lang === 'mm' ? dest.region.mm : dest.region.en}</div>
                  <span className="text-[10px] font-medium bg-amber-pale text-[#92400E] rounded-full px-[10px] py-[3px]">{t('comingSoon')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  )
}
