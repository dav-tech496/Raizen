'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import { useLang } from '@/context/LangContext'
import type { Destination } from '@/types'

interface Props {
  destinations: Destination[]
}

const DESTINATION_META: Record<string, { heroImage: string; nights: string; rating: string }> = {
  ngwesaung: {
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop',
    nights: '2–7 nights',
    rating: '4.8',
  },
  'chaung-thar': {
    heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop',
    nights: '2–5 nights',
    rating: '4.6',
  },
}

export default function DestinationsClient({ destinations }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { lang } = useLang()

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="max-w-[480px] mx-auto pb-[90px]">
        {/* Hero — matches home page green CTA style */}
        <div className="bg-green px-[18px] py-7 relative overflow-hidden">
          {/* decorative circles */}
          <div className="absolute top-[-50px] right-[-40px] w-[130px] h-[130px] rounded-full bg-white/[0.07]" />
          <div className="absolute bottom-[-30px] left-[-20px] w-[90px] h-[90px] rounded-full bg-white/[0.05]" />
          <div className="relative">
            <p className="text-[11px] font-medium tracking-[0.09em] uppercase text-white/60 mb-2">
              {lang === 'mm' ? 'ဦးတည်ရာနေရာများ' : 'Destinations'}
            </p>
            <h1 className="text-[24px] font-semibold text-white tracking-[-0.4px] mb-[6px]">
              {lang === 'mm' ? 'ဘယ်နေရာသွားချင်သလဲ?' : 'Where do you want to go?'}
            </h1>
            <p className="text-[13px] text-white/60 font-light leading-[1.55]">
              {lang === 'mm'
                ? 'မြန်မာနိုင်ငံတစ်ဝှမ်းမှ ရွေးချယ်ထားသော ဦးတည်ရာနေရာများ'
                : 'Handpicked destinations across Myanmar — more coming soon.'}
            </p>
          </div>
        </div>

        {/* Destination cards */}
        <div className="px-[18px] pt-6 pb-4 flex flex-col gap-5">
          {destinations.map((dest) => {
            const meta = DESTINATION_META[dest.slug]
            if (!meta) return null

            return (
              <div
                key={dest.id}
                className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden"
              >
                {/* Hero image */}
                <div className="relative h-[200px] w-full">
                  <Image
                    src={meta.heroImage}
                    alt={dest.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 480px) 100vw, 480px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Available badge */}
                  <span className="absolute top-3 left-3 bg-green text-white text-[10px] font-semibold px-[10px] py-[4px] rounded-full">
                    {lang === 'mm' ? 'ယခုရနိုင်သည်' : 'Available Now'}
                  </span>

                  {/* Name overlay */}
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-[11px] opacity-70 mb-[2px]">{dest.region}</p>
                    <h2 className="text-[20px] font-semibold tracking-[-0.3px] leading-tight">
                      {dest.name}
                    </h2>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-sm text-ink2 mb-3">
                    <span>
                      ⭐ <span className="font-semibold text-ink">{meta.rating}</span>
                    </span>
                    <span>🌙 {meta.nights}</span>
                    <span>🏖️ Beach</span>
                  </div>

                  {/* Description */}
                  {dest.description && (
                    <p className="text-[13px] text-ink2 font-light leading-[1.55] mb-3">
                      {dest.description}
                    </p>
                  )}

                  {/* Highlight tags */}
                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-[6px] mb-4">
                      {dest.highlights.slice(0, 5).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[11px] bg-green-pale text-green px-[10px] py-[4px] rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="flex gap-[10px]">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="flex-1 bg-green text-white text-center text-[13px] font-semibold py-[13px] rounded-md transition-opacity active:opacity-80"
                    >
                      {lang === 'mm' ? 'ကြည့်ရှုရန်' : 'Explore'}
                    </Link>
                    <Link
                      href="/planner"
                      className="flex-1 border-2 border-green text-green text-center text-[13px] font-semibold py-[13px] rounded-md hover:bg-green-pale transition-colors active:opacity-80"
                    >
                      {lang === 'mm' ? 'ခရီးစဉ်စီစဉ်' : 'Plan Trip'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Coming soon hint */}
        <div className="mx-[18px] mt-2 mb-6 bg-surface2 border border-border rounded-lg px-4 py-4 text-center">
          <p className="text-[13px] text-ink3 font-light">
            {lang === 'mm'
              ? '🗺️ Bagan, Inle Lake နှင့် အခြားနေရာများ မကြာမီ ထည့်သွင်းမည်'
              : '🗺️ Bagan, Inle Lake & more destinations coming soon'}
          </p>
        </div>
      </main>

      <BottomNav />
    </>
  )
}
