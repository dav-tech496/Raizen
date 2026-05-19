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

const DESTINATION_META: Record<
  string,
   {
    heroImage: string
    nights: string
    rating: string
    tagline: string
    distance: string
    description: string
    highlights: string[]
  }
> = {
  ngwesaung: {
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/2/29/Ngwe_Saung_beach_05.jpg',
    nights: 'Available',
    rating: '4.8',
    tagline: "Myanmar's most popular beach",
    distance: '5 hrs from Yangon',
    description:
      "A 20km stretch of untouched white sand on the Bay of Bengal. One of Myanmar's most beautiful and least-developed beaches.",
    highlights: ['20km White Sand Beach', 'Crystal Clear Waters', 'Fresh Seafood', 'Water Sports'],
  },
  'chaung-thar': {
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/e/eb/20170304_084223-01_Chaungtha_beach.jpg',
    nights: 'Available',
    rating: '4.6',
    tagline: "Myanmar's most loved local beach",
    distance: '5 hrs from Yangon',
    description:
      "A lively beach town on the Bay of Bengal known for easy access, local vibes, and relaxing coastal escapes.",
    highlights: ['Soft Sandy Shore', 'Sunset Views', 'Family Friendly', 'Seafood Spots'],
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

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <div className="bg-green px-[22px] py-8 relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-50px] w-[180px] h-[180px] rounded-full bg-white/[0.07]" />
          <div className="absolute top-[20px] right-[30px] w-[80px] h-[80px] rounded-full bg-white/[0.05]" />
          <div className="absolute bottom-[-40px] left-[-30px] w-[130px] h-[130px] rounded-full bg-white/[0.06]" />

          <div className="relative">
            <div className="inline-flex items-center gap-[6px] bg-white/[0.13] border border-white/[0.18] rounded-full px-3 py-[5px] mb-4">
              <span className="w-[6px] h-[6px] rounded-full bg-white/80 animate-pulse-slow" />
              <span className="text-[11px] font-medium tracking-[0.09em] uppercase text-white/80">
                {lang === 'mm' ? 'ဦးတည်ရာနေရာများ' : 'Destinations'}
              </span>
            </div>

            <h1 className="font-serif text-[28px] font-bold text-white leading-[1.2] tracking-[-0.5px] mb-3">
              {lang === 'mm' ? 'ဘယ်နေရာသွားချင်သလဲ?' : 'Where do you want to go?'}
            </h1>
            <p className="text-[13px] text-white/65 font-light leading-[1.5]">
              {lang === 'mm' ? 'ဦးတည်ရာနေရာတစ်ခုကို ရွေးချယ်ပါ' : 'Choose your destination'}
            </p>
          </div>
        </div>

        {/* ── Destination Cards ────────────────────────────────────── */}
        <div className="px-[18px] pt-6 flex flex-col gap-5">
          {destinations.map((dest, i) => {
            const meta = DESTINATION_META[dest.slug]
            if (!meta) return null

            return (
              <div
                key={dest.id}
                className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden"
              >
                {/* ── Photo — entire image area is tappable ── */}
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="block relative h-[230px] w-full overflow-hidden group"
                >
                  <Image
                    src={meta.heroImage}
                    alt={dest.name}
                    fill
                    priority={i === 0}
                    className="object-cover transition-transform duration-500 group-active:scale-[1.03]"
                    sizes="(max-width: 480px) 100vw, 480px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Available badge */}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-[5px] bg-green text-white text-[10px] font-semibold tracking-wide px-[10px] py-[5px] rounded-full shadow-md">
                    <span className="w-[5px] h-[5px] rounded-full bg-white/90" />
                    {lang === 'mm' ? 'ယခုရနိုင်သည်' : 'Available Now'}
                  </span>

                  {/* Rating pill */}
                  <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[11px] font-semibold px-[9px] py-[4px] rounded-full">
                    ⭐ {meta.rating}
                  </span>

                  {/* Name + tagline overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/55 mb-[3px]">
                      {dest.region}
                    </p>
                    <h2 className="font-serif text-[22px] font-bold text-white tracking-[-0.3px] leading-tight mb-[3px]">
                      {dest.name}
                    </h2>
                    <p className="text-[12px] text-white/70 italic font-light">
                      {meta.tagline}
                    </p>
                  </div>
                </Link>

                {/* ── Card Body ── */}
                <div className="px-4 pt-[14px] pb-4">

                  {/* Quick stats */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[12px] text-ink2">
                      ✅ <span className="font-medium text-ink">{meta.nights}</span>
                    </span>
                    <span className="w-[3px] h-[3px] rounded-full bg-border2" />
                    <span className="text-[12px] text-ink2">
                      🚌 <span className="font-medium text-ink">{meta.distance}</span>
                    </span>
                    <span className="w-[3px] h-[3px] rounded-full bg-border2" />
                    <span className="text-[12px] text-ink2">
                      🏖️ <span className="font-medium text-ink">Beach</span>
                    </span>
                  </div>

                  {/* Description */}
                <p className="text-[13px] text-ink2 font-light leading-[1.55] mb-3 line-clamp-2">
                    {meta.description}
                  </p>


                  {/* Highlight tags */}
                  {meta.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-[6px] mb-4">
                      {meta.highlights.slice(0, 4).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[11px] bg-green-pale text-green px-[10px] py-[4px] rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ── Single full-width Explore button ── */}
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="block w-full bg-green text-white text-center text-[14px] font-semibold py-[14px] rounded-md active:opacity-80 transition-opacity"
                  >
                    {lang === 'mm' ? 'ကြည့်ရှုရန်' : 'Explore'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="h-6" />
      </main>

      <BottomNav />
    </>
  )
}
