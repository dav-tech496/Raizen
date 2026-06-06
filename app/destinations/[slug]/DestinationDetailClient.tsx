'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import { useLang } from '@/context/LangContext'
import DestinationMapCard from '@/components/DestinationMapCard'
import type { Hotel, HotelRoom, DestinationConfig } from './config'

/* ─── Types ─────────────────────────────────────────────────────── */
interface DestinationRow {
  id: string
  name: string
  slug: string
  region: string
  description: string | null
  highlights: string[] | null
}

interface Props {
  destination: DestinationRow
  hotels: Hotel[]
  config: DestinationConfig
}

/* ─── Category badge styling ────────────────────────────────────── */
const CATEGORY_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  luxury:        { label: 'Luxury',    bg: 'bg-green-pale', text: 'text-green'      },
  premium:       { label: 'Premium',   bg: 'bg-amber-pale', text: 'text-amber'      },
  'mid-range':   { label: 'Mid-Range', bg: 'bg-[#EEF6FF]',  text: 'text-[#1D6FA4]' },
  budget:        { label: 'Budget',    bg: 'bg-surface2',   text: 'text-ink2'       },
}

function getCategoryStyle(cat: string | null) {
  if (!cat) return CATEGORY_STYLE.budget
  return CATEGORY_STYLE[cat.toLowerCase()] ?? CATEGORY_STYLE.budget
}

/* ─── HotelCard with accordion ──────────────────────────────────── */
function HotelCard({ hotel }: { hotel: Hotel }) {
  const [open, setOpen] = useState(false)
  const rooms: HotelRoom[] = hotel.hotel_rooms ?? []

  const minPrice =
    rooms.length > 0
      ? Math.min(...rooms.map((r) => r.price_per_night))
      : hotel.price_per_night_mmk

  const cat = getCategoryStyle(hotel.price_category)

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-[14px] text-left active:bg-surface2 transition-colors"
        aria-expanded={open}
      >
        <div className="flex flex-col gap-[5px] flex-1 min-w-0 pr-3">
          <span className="text-[14px] font-semibold text-ink leading-tight">
            {hotel.name}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {hotel.price_category && (
              <span className={`text-[10px] font-semibold px-[8px] py-[3px] rounded-full ${cat.bg} ${cat.text}`}>
                {cat.label}
              </span>
            )}
            {minPrice != null && (
              <span className="text-[12px] text-ink2">
                From{' '}
                <span className="font-bold text-green text-[13px]">
                  {minPrice.toLocaleString()}
                </span>{' '}
                <span className="text-ink3">MMK/night</span>
              </span>
            )}
          </div>
        </div>
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full bg-surface2 border border-border flex items-center justify-center transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {open && rooms.length > 0 && (
        <div className="border-t border-border bg-surface2/60 px-4 py-3 flex flex-col gap-[10px]">
          {rooms.map((room) => (
            <div key={room.room_type} className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <span className="w-[6px] h-[6px] rounded-full bg-green flex-shrink-0" />
                <span className="text-[12px] text-ink2">{room.room_type}</span>
                {room.capacity != null && (
                  <span className="text-[11px] text-ink3">· {room.capacity} pax</span>
                )}
              </div>
              <span className="text-[13px] font-semibold text-ink">
                {room.price_per_night.toLocaleString()}{' '}
                <span className="text-[11px] font-normal text-ink3">MMK</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Centered Carousel ─────────────────────────────────────────── */
const AUTOPLAY_INTERVAL = 3500

function GalleryCarousel({
  images,
  label,
}: {
  images: DestinationConfig['galleryImages']
  label: string
}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = images.length

  const advance = useCallback(
    (dir: 1 | -1) => {
      setActive((prev) => (prev + dir + total) % total)
    },
    [total]
  )

  /* autoplay */
  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => advance(1), AUTOPLAY_INTERVAL)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused, advance])

  function handleUserNav(idx: number) {
    setActive(idx)
    setPaused(true)
    // resume after 6s of inactivity
    setTimeout(() => setPaused(false), 6000)
  }

  /* drag / swipe */
  const dragStart = useRef<number | null>(null)

  function onDragStart(x: number) { dragStart.current = x }
  function onDragEnd(x: number) {
    if (dragStart.current === null) return
    const delta = dragStart.current - x
    if (Math.abs(delta) > 40) handleUserNav((active + (delta > 0 ? 1 : -1) + total) % total)
    dragStart.current = null
  }

  const leftIdx  = (active - 1 + total) % total
  const rightIdx = (active + 1) % total

  /* visible cards: [left, center, right] */
  const cards = [
    { idx: leftIdx,  position: 'left'   as const },
    { idx: active,   position: 'center' as const },
    { idx: rightIdx, position: 'right'  as const },
  ]

  return (
    <section>
      <h2 className="text-[16px] font-semibold text-ink tracking-[-0.2px] mb-3">
        {label}
      </h2>

      {/* Track */}
      <div
        className="relative flex items-center justify-center gap-3 h-[220px] overflow-hidden select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseUp={(e) => onDragEnd(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
      >
        {cards.map(({ idx, position }) => {
          const img = images[idx]
          const isCenter = position === 'center'
          const isSide   = !isCenter

          return (
            <button
              key={`${position}-${idx}`}
              onClick={() => handleUserNav(idx)}
              aria-label={isCenter ? img.alt : `View ${img.alt}`}
              className={[
                'relative rounded-xl overflow-hidden flex-shrink-0 transition-all duration-400 ease-out border shadow-sm focus:outline-none',
                isCenter
                  ? 'w-[188px] h-[210px] border-green/40 shadow-md z-10'
                  : 'w-[130px] h-[165px] border-border opacity-55 hover:opacity-70 cursor-pointer z-0',
              ].join(' ')}
              style={{
                transitionProperty: 'width, height, opacity, box-shadow',
                transitionDuration: '350ms',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes={isCenter ? '188px' : '130px'}
                draggable={false}
              />
              {/* subtle vignette on side cards */}
              {isSide && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 pointer-events-none" />
              )}
              {/* active indicator ring */}
              {isCenter && (
                <div className="absolute inset-0 ring-2 ring-inset ring-green/30 rounded-xl pointer-events-none" />
              )}
            </button>
          )
        })}

        {/* Prev / Next buttons (hidden on mobile, show on wider screens) */}
        <button
          onClick={() => handleUserNav((active - 1 + total) % total)}
          aria-label="Previous photo"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-border shadow items-center justify-center text-ink2 hover:bg-white transition-colors z-20"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => handleUserNav((active + 1) % total)}
          aria-label="Next photo"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-border shadow items-center justify-center text-ink2 hover:bg-white transition-colors z-20"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-[6px] mt-3" role="tablist" aria-label="Gallery navigation">
        {images.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Photo ${i + 1}`}
            onClick={() => handleUserNav(i)}
            className={[
              'rounded-full transition-all duration-300',
              i === active
                ? 'w-5 h-[6px] bg-green'
                : 'w-[6px] h-[6px] bg-border hover:bg-ink3',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  )
}

/* ─── MapSection is now the shared DestinationMapCard component ─── */

/* ─── Main client component ─────────────────────────────────────── */
export default function DestinationDetailClient({
  destination,
  hotels,
  config,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { lang } = useLang()

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="max-w-[480px] mx-auto pb-[160px] bg-bg">

        {/* ── 1. Hero ───────────────────────────────────────────── */}
        <div className="relative h-[280px] w-full overflow-hidden">
          <Image
            src={config.heroImage}
            alt={destination.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 480px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/85" />

          <Link
            href="/destinations"
            aria-label="Back to destinations"
            className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors hover:bg-black/60 active:bg-black/70"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/60 mb-[4px]">
              {destination.region}
            </p>
            <h1 className="font-serif text-[26px] font-bold text-white tracking-[-0.4px] leading-tight mb-3">
              {destination.name}
            </h1>
            <div className="flex flex-wrap gap-[6px]">
              {config.badgeTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-[10px] py-[4px] rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. Compact Map Section ───────────────────────────── */}
        <div className="px-[18px] pt-4">
          <DestinationMapCard slug={destination.slug} />
        </div>

        <div className="px-[18px] pt-5 flex flex-col gap-5">

          {/* ── 3. Hotels & Pricing ──────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-[16px] font-semibold text-ink tracking-[-0.2px]">
                  {lang === 'mm' ? 'ဟိုတယ်များနှင့် ဈေးနှုန်း' : 'Hotels & Pricing'}
                </h2>
                <p className="text-[11px] text-ink3 font-light mt-[2px]">
                  {lang === 'mm'
                    ? 'စစ်ဆေးပြီး MMK ဈေးနှုန်းများ'
                    : 'Verified prices in Myanmar Kyat · tap to expand'}
                </p>
              </div>
              <span className="text-[10px] font-semibold bg-green-pale text-green px-[10px] py-[4px] rounded-full flex-shrink-0">
                MMK / night
              </span>
            </div>

            <div className="flex flex-col gap-[10px]">
              {hotels.length === 0 ? (
                <p className="text-[13px] text-ink3 text-center py-8">
                  {lang === 'mm' ? 'ဟိုတယ်မရှိသေးပါ' : 'No hotels listed yet.'}
                </p>
              ) : (
                hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
              )}
            </div>
          </section>

          {/* ── 4. About ─────────────────────────────────────── */}
          <section className="bg-surface border border-border rounded-lg p-4 shadow-sm">
            <h2 className="text-[16px] font-semibold text-ink tracking-[-0.2px] mb-[4px]">
              {config.tagline}
            </h2>
            <div className="w-8 h-[2.5px] bg-green rounded-full mb-3" />

            {config.bodyText.map((para, i) => (
              <p
                key={i}
                className="text-[13px] text-ink2 font-light leading-[1.65] mb-2 last:mb-0"
              >
                {para}
              </p>
            ))}

            <div className="flex flex-wrap gap-[6px] mt-4">
              {config.badgeTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-green-pale text-green px-[10px] py-[4px] rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 bg-amber-pale rounded-md px-3 py-[10px] flex items-center gap-3">
              <span className="text-[20px] leading-none">☀️</span>
              <div>
                <p className="text-[11px] font-semibold text-amber">
                  {lang === 'mm' ? 'သွားရန် အကောင်းဆုံးအချိန်' : 'Best time to visit'}
                </p>
                <p className="text-[12px] text-ink2 font-light">{config.bestTime}</p>
              </div>
            </div>
          </section>

          {/* ── 5. Gallery — centered carousel ───────────────── */}
          <GalleryCarousel
            images={config.galleryImages}
            label={lang === 'mm' ? 'ဓာတ်ပုံများ' : 'Gallery'}
          />

          {/* ── 6. DB Highlights grid ────────────────────────── */}
          {destination.highlights && destination.highlights.length > 0 && (
            <section className="bg-surface border border-border rounded-lg p-4 shadow-sm">
              <h2 className="text-[15px] font-semibold text-ink mb-3">
                {lang === 'mm' ? 'အထူးအချက်များ' : 'Highlights'}
              </h2>
              <div className="grid grid-cols-2 gap-[8px]">
                {destination.highlights.map((h: string) => (
                  <div
                    key={h}
                    className="flex items-center gap-[8px] bg-surface2 rounded-md px-3 py-[10px]"
                  >
                    <span className="w-[6px] h-[6px] rounded-full bg-green flex-shrink-0" />
                    <span className="text-[12px] text-ink2 font-light leading-tight">{h}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <div
        className="fixed left-0 right-0 z-40 max-w-[480px] mx-auto px-[18px] pt-[10px] pb-[10px] bg-bg/95 backdrop-blur-[10px] border-t border-border no-print"
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
      >
        <Link
          href="/planner"
          prefetch
          className="flex items-center justify-center gap-[8px] w-full bg-green text-white text-[14px] font-semibold py-[15px] rounded-md shadow-md active:opacity-80 transition-opacity"
        >
          {lang === 'mm' ? 'ခရီးစဉ်စီစဉ်မည်' : config.planLabel}
          <svg
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <BottomNav />
    </>
  )
}
