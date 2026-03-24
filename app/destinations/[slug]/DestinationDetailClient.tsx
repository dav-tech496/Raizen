'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import { useLang } from '@/context/LangContext'
import { formatMMK } from '@/lib/plannerLogic'
import type { Destination, Hotel } from '@/types'

interface Props { destination: Destination; hotels: Hotel[] }

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop', en: 'White Sand Coastline',   mm: 'သဲဖြူကမ်းနံဘေး' },
  { src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80&auto=format&fit=crop', en: 'Crystal Clear Waters',    mm: 'ရှင်းလင်းသောရေများ' },
  { src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80&auto=format&fit=crop', en: 'Resort Pool',            mm: 'Resort ရေကူးကန်' },
  { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop', en: 'Beach Sunset',             mm: 'ကမ်းနံဘေး နေဝင်ချိန်' },
  { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop', en: 'Water Sports',             mm: 'ရေကစားနည်း' },
]

const TIER_CSS: Record<string, string> = {
  'mid-range': 'bg-[#EDE9FE] text-[#5B21B6]',
  villa:       'bg-green-pale text-green',
  premium:     'bg-[#FCE7F3] text-[#9D174D]',
  luxury:      'bg-amber-pale text-[#92400E]',
}

export default function DestinationDetailClient({ destination, hotels }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { lang, t } = useLang()

  const imgSrc = destination.image_url
    ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90&auto=format&fit=crop'

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="max-w-[480px] mx-auto pb-[160px]">
        {/* Hero image */}
        <div className="relative h-[270px]">
          <Image src={imgSrc} alt={destination.name} fill className="object-cover" sizes="480px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-[18px]">
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/60 mb-[5px]">{t('region')}</div>
            <h1 className="font-serif text-[28px] font-medium text-white tracking-[-0.3px] mb-2">{destination.name}</h1>
            <div className="flex gap-2 flex-wrap">
              {['20km Beach', 'Year-Round Sun', '★ 4.8'].map((p) => (
                <span key={p} className="text-xs bg-white/15 backdrop-blur-[8px] border border-white/20 text-white rounded-full px-3 py-1">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="px-[18px] py-[22px]">
          <h2 className="text-[17px] font-semibold text-ink tracking-[-0.25px] mb-[10px]">{t('whereTheBay')}</h2>
          <p className="text-sm text-ink2 leading-[1.72] font-light">
            {lang === 'mm'
              ? 'ငွေဆောင် (ငွေ့ကမ်း) သည် မြန်မာနိုင်ငံ၏ အလှဆုံးနှင့် ဖွံ့ဖြိုးမှု အနည်းဆုံး ကမ်းနံဘေးများထဲမှ တစ်ခုဖြစ်သည်။ ရန်ကုန်မှ ၆ နာရီခန့် ကွာဝေးပြီး ကမ်းနံဘေး ၂၀ ကီလိုမီတာ ဆက်တိုက်တည်ရှိသည်'
              : "Ngwe Saung (Silver Beach) is one of Myanmar's most beautiful and least-developed beaches. Located about 6 hours from Yangon, the beach stretches for 20 uninterrupted kilometers — just sand, sea, and sky."}
          </p>
          <p className="text-sm text-ink2 leading-[1.72] font-light mt-[10px]">
            {lang === 'mm'
              ? 'ပိုမိုဆူညံသော ငပလီကမ်းနံဘေးနှင့် မတူဘဲ ငွေဆောင်သည် ငြိမ်းချမ်းသောဝိသေသလက္ခဏာကို ထိန်းသိမ်းထားသည်'
              : "Unlike the busier Ngapali Beach, Ngwe Saung retains a quiet, authentic character. Local fishing villages, fresh seafood restaurants, and resorts from budget villas to luxury bungalows."}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 px-[18px] mb-1">
          {(lang === 'mm'
            ? ['သဲဖြူ ၂၀ ကီလိုမီတာ','အချစ်သူများကျွန်း','ဆည်းဆာ Resort','ပင်လယ်စာ','ရေကစားနည်း','ငြိမ်းချမ်းသော']
            : ['20km White Sand',"Lover's Island",'Luxury Resorts','Fresh Seafood','Water Sports','Peaceful']
          ).map((tag) => (
            <span key={tag} className="text-[11px] px-[10px] py-1 rounded-full bg-surface2 text-ink2 border border-border">{tag}</span>
          ))}
        </div>

        {/* Best time */}
        <div className="mx-[18px] my-4 bg-surface border border-border rounded-md px-[18px] py-4 flex items-center gap-[14px] shadow-sm">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-amber-pale flex-shrink-0 flex items-center justify-center text-xl">☀️</div>
          <div>
            <div className="text-xs font-medium tracking-[0.05em] uppercase text-ink3 mb-[3px]">{t('bestTimeToVisit')}</div>
            <div className="text-[15px] font-semibold text-ink">{t('bestTimePeriod')}</div>
          </div>
        </div>

        {/* Gallery */}
        <div className="px-[18px] pt-[22px] pb-3">
          <h2 className="text-[17px] font-semibold text-ink mb-3">{t('seeBeauty')}</h2>
        </div>
        <div className="flex gap-[10px] overflow-x-auto px-[18px] pb-1 scrollbar-hide">
          {GALLERY.map((img) => (
            <div key={img.src} className="relative w-[175px] h-[128px] rounded-md overflow-hidden flex-shrink-0">
              <Image src={img.src} alt={lang === 'mm' ? img.mm : img.en} fill className="object-cover" sizes="175px" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-[10px] pb-2 pt-3">
                <span className="text-[11px] text-white">{lang === 'mm' ? img.mm : img.en}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hotels */}
        <div className="px-[18px] pt-[22px] pb-3">
          <h2 className="text-[17px] font-semibold text-ink mb-[10px]">{t('verifiedHotels')}</h2>
          <p className="text-[13px] text-ink3 font-light mb-4">{t('allPricesNote')}</p>
        </div>
        <div className="flex flex-col gap-[11px] px-[18px]">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-surface border border-border rounded-md overflow-hidden shadow-sm">
              <div className="flex items-start justify-between px-4 py-[14px] border-b border-border">
                <div>
                  <div className="text-[15px] font-semibold text-ink mb-1">{hotel.name}</div>
                  <span className={`text-[10px] font-medium px-[9px] py-[3px] rounded-full ${TIER_CSS[hotel.price_category] ?? 'bg-surface2 text-ink2'}`}>
                    {hotel.price_category}
                  </span>
                </div>
                <div className="text-right text-xs text-ink3">
                  {t('from')}
                  <strong className="block text-[15px] font-semibold text-green">
                    {formatMMK(Math.min(...hotel.rooms.map((r) => r.price_per_night)))} MMK
                  </strong>
                </div>
              </div>
              <div className="px-4 pb-[14px] pt-2">
                {hotel.rooms.map((room) => (
                  <div key={room.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-[13px] text-ink2 font-light">{room.room_type}</span>
                    <span className="text-[13px] font-semibold text-ink">{formatMMK(room.price_per_night)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="h-5" />
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-[72px] left-0 right-0 z-50 bg-bg/95 backdrop-blur-[12px] border-t border-border px-[18px] py-3 no-print">
        <div className="flex gap-[10px] max-w-[480px] mx-auto">
          <Link href="/planner" className="flex-1 bg-green text-white text-sm font-semibold py-[14px] rounded-[14px] text-center">
            {t('planNgweSaung')}
          </Link>
          <Link href="/destinations" className="px-4 py-[14px] rounded-[14px] text-sm font-medium text-ink2 border border-border2">
            {t('backBtn')}
          </Link>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
