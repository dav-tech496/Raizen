'use client'

import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, use } from 'react'
import { MapPin, ArrowRight, CheckCircle, Waves, Sun, Star, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'

export const dynamic = 'force-dynamic'

const HOTELS = [
  {
    name: 'AHTINKAYA RESORT', category: 'Luxury', categoryMm: 'လူဇရီ',
    color: 'bg-amber-500/10 border-amber-500/20',
    rooms: [
      { type: 'Executive Deluxe', price: 350000 },
      { type: 'Sea View Villa (2nd Row)', price: 450000 },
      { type: 'Sea View Villa', price: 550000 },
      { type: 'Executive Suite', price: 750000 },
      { type: 'Extra Bed', price: 120000 },
    ],
  },
  {
    name: 'EXCEL HOTEL', category: 'Mid-Range', categoryMm: 'အလတ်စား',
    color: 'bg-blue-500/10 border-blue-500/20',
    rooms: [
      { type: 'Garden View (2 Pax)', price: 158000 },
      { type: 'Deluxe Garden View (2 Pax)', price: 170000 },
      { type: 'Garden View (4 Pax)', price: 315000 },
      { type: 'Jacuzzi Garden View (4 Pax)', price: 339000 },
      { type: 'Sea View (2 Pax)', price: 291000 },
      { type: 'Sea View (4 Pax)', price: 389000 },
      { type: 'Jacuzzi Sea View (4 Pax)', price: 413000 },
    ],
  },
  {
    name: 'CENTER POINT', category: 'Premium', categoryMm: 'ပရီမီယံ',
    color: 'bg-purple-500/10 border-purple-500/20',
    rooms: [
      { type: 'Executive Family Seafront Bungalow (4 Pax)', price: 790000 },
      { type: 'Executive Seafront Bungalow (2 Pax)', price: 570000 },
      { type: 'Executive 2nd Seaview Bungalow (2 Pax)', price: 570000 },
      { type: 'Deluxe Seaview Building (2 Pax)', price: 320000 },
      { type: 'Deluxe Garden View Building (2 Pax)', price: 320000 },
    ],
  },
  {
    name: 'OCEAN PARADISE', category: 'Boutique', categoryMm: 'ဘူတစ်',
    color: 'bg-cyan-500/10 border-cyan-500/20',
    rooms: [
      { type: 'Sky Suite Penthouse (3 Pax)', price: 225000 },
      { type: 'Ocean Suite Penthouse', price: 172500 },
      { type: 'Ocean Suite Sea Side', price: 150000 },
      { type: 'Ocean Superior Penthouse', price: 135000 },
      { type: 'Ocean Superior With Balcony', price: 112500 },
    ],
  },
  {
    name: 'SUNNY VILLA', category: 'Villa', categoryMm: 'ဗီလာ',
    color: 'bg-green-500/10 border-green-500/20',
    rooms: [
      { type: 'Villa Superior (2 Pax)', price: 135000 },
      { type: 'Villa (2 Pax)', price: 110000 },
      { type: 'Villa (3 Pax)', price: 150000 },
      { type: 'Villa (5 Pax)', price: 240000 },
    ],
  },
]

// Carefully curated Unsplash photos — accurate match to Ngwe Saung:
// white sand beach, tropical resort pool, Bay of Bengal water activities
const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85&auto=format&fit=crop',
    labelEn: 'White Sand Coastline', labelMm: 'သဲဖြူ ကမ်းခြေ',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=85&auto=format&fit=crop',
    labelEn: 'Crystal Clear Waters', labelMm: 'ကင်္ဂါလင်ကြည် ရေ',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=85&auto=format&fit=crop',
    labelEn: 'Resort Pool', labelMm: 'ရစောတ် ကူးကန်',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1520454974749-611f37e6bcdf?w=800&q=85&auto=format&fit=crop',
    labelEn: 'Tropical Beach Escape', labelMm: 'ကမ်းခြေ အနားယူ',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85&auto=format&fit=crop',
    labelEn: 'Water Sports & Activities', labelMm: 'ရေကစားခြင်း',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85&auto=format&fit=crop',
    labelEn: 'Beach Sunset', labelMm: 'ကမ်းခြေ နေဝင်ချိန်',
    span: '',
  },
]

const CONTENT = {
  en: {
    region: 'Ayeyarwady Region, Myanmar',
    hero_sub: "Myanmar's most pristine beach — 20km of white sand on the Bay of Bengal",
    about_label: 'About the Destination',
    about_title: 'Where the Bay Meets',
    about_title2: 'Untouched Paradise',
    about_p1: "Ngwe Saung (Silver Beach) is one of Myanmar's most beautiful and least-developed beaches. Located about 6 hours from Yangon by road, the beach stretches for 20 uninterrupted kilometers — just sand, sea, and sky.",
    about_p2: "Unlike the busier Ngapali Beach, Ngwe Saung retains a quiet, authentic character. Local fishing villages dot the coastline, seafood restaurants serve the morning catch, and resorts range from budget-friendly villas to luxury seafront bungalows.",
    highlights: ['20km White Sand Beach', 'Lover\'s Island nearby', 'Luxury Resorts', 'Fresh Seafood Restaurants', 'Water Sports & Snorkeling', 'Peaceful & Uncrowded'],
    plan_title: 'Plan Your Visit',
    plan_sub: 'Enter your budget and get a day-by-day itinerary with real hotel pricing.',
    plan_cta: 'Generate Itinerary',
    best_time_label: 'Best Time to Visit',
    best_time: 'November — April (Dry Season)',
    gallery_label: 'Gallery',
    gallery_title: 'See the Beauty',
    gallery_title2: 'Up Close',
    hotels_label: 'Where to Stay',
    hotels_title: 'Verified Hotels &',
    hotels_title2: 'Real MMK Pricing',
    hotels_sub: 'All prices in Myanmar Kyat (MMK) per night. AI Planner matches rooms to your budget automatically.',
    from: 'From',
    per_night: '/night',
    find_hotel: 'Find Hotels Within My Budget',
    badges: ['20km Beach', 'Year-Round Sun', 'Bay of Bengal', '5 Resorts'],
  },
  mm: {
    region: 'အင်းဝမဒေသ၊ မြန်မာနိုင်ငံ',
    hero_sub: 'မြန်မာ၏ အသန့်ရှင်းဆုံး ကမ်းခြေ — ဘင်္ဂလားပင်လယ်အော်တွင် သဲဖြူ ၂၀ ကီလိုမီတာ',
    about_label: 'ခရီးစဉ် အကြောင်း',
    about_title: 'ပင်လယ်နှင့်',
    about_title2: 'သဘာဝ တွေ့ဆုံရာ',
    about_p1: 'ငွေဆောင် (ငွေကမ်းခြေ) သည် မြန်မာနိုင်ငံ၏ အလှဆုံးနှင့် ဖွံ့ဖြိုးမှုနည်းသည့် ကမ်းခြေများထဲမှ တစ်ခုဖြစ်သည်။ ရန်ကုန်မှ ကားဖြင့် ၆ နာရီခန့် ကြာသော ဤကမ်းခြေသည် ၂၀ ကီလိုမီတာ ဆက်တိုက် ဆန့်တန်းနေသည်။',
    about_p2: 'ငွပါလီ ကမ်းခြေနှင့် မတူဘဲ ငွေဆောင်သည် တိတ်ဆိတ်ငြိမ်သက်သော စစ်မှန်သည့် ဇာတိပုံရိပ်ကို ထိန်းသိမ်းထားသည်။ ငါးဖမ်းရွာများ၊ ပင်လယ်ဆိပ် စားသောက်ဆိုင်များနှင့် ဘတ်ဂျက်မှ လူဇရီ ဟိုတယ်များအထိ ရှိသည်။',
    highlights: ['သဲဖြူ ကမ်းခြေ ၂၀ ကီလို', 'ချစ်သူ ကျွန်းနီးစပ်', 'လူဇရီ ဟိုတယ်', 'ပင်လယ်ဆိပ် စားသောက်ဆိုင်', 'ရေကစား နှင့် ငရုတ်ကောင်းမြင်', 'တိတ်ဆိတ်ငြိမ်သက်'],
    plan_title: 'ခရီးစဉ် စီစဉ်ရန်',
    plan_sub: 'ဘတ်ဂျက် ထည့်သွင်းပြီး ဟိုတယ်ဈေးနှုန်းဖြင့် နေ့ဆင့် စီစဉ်မှု ရယူပါ',
    plan_cta: 'စီစဉ်မှု ထုတ်ရန်',
    best_time_label: 'သွားသင့်သည့်အချိန်',
    best_time: 'နိုဝင်ဘာ — ဧပြီ (မိုးခြောက်ရာသီ)',
    gallery_label: 'ဓာတ်ပုံများ',
    gallery_title: 'လှပသောအလှ',
    gallery_title2: 'နီးနီးကပ်ကပ် ကြည့်ရှုပါ',
    hotels_label: 'နေမည့်နေရာ',
    hotels_title: 'အတည်ပြုထားသော ဟိုတယ် နှင့်',
    hotels_title2: 'MMK ဈေးနှုန်း',
    hotels_sub: 'ဈေးနှုန်းအားလုံး တစ်ညအတွက် မြန်မာကျပ်ငွေ (MMK) ဖြင့်ဖြစ်သည်',
    from: 'မှစ၍',
    per_night: '/ည',
    find_hotel: 'ကျွန်ုပ်ဘတ်ဂျက်နှင့် ကိုက်ညီသော ဟိုတယ်',
    badges: ['ကမ်းခြေ ၂၀ ကီလို', 'နေရောင်ခြည်', 'ဘင်္ဂလားပင်လယ်', 'ဟိုတယ် ၅ ခု'],
  },
}

interface Props { params: Promise<{ slug: string }> | { slug: string } }

export default function DestinationPage({ params }: Props) {
  const resolvedParams = 'then' in params ? use(params as Promise<{ slug: string }>) : params
  if (resolvedParams.slug !== 'ngwesaung') notFound()

  const { lang } = useLang()
  const t = CONTENT[lang]
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-surface text-primary pb-16 md:pb-0">

      {/* ── HERO ── */}
      <div className="relative h-[70vh] sm:h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85&auto=format&fit=crop"
          alt="Ngwe Saung Beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-3 font-body">
            <MapPin className="w-4 h-4" />{t.region}
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold text-white mb-3 leading-none">
            Ngwe Saung
          </h1>
          <p className="text-white/70 text-base sm:text-xl max-w-lg mb-6 font-body">{t.hero_sub}</p>
          <div className="flex flex-wrap gap-2">
            {t.badges.map(b => (
              <div key={b} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-xs font-semibold font-body">
                <Star className="w-3 h-3 text-amber-400" />{b}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">

        {/* ── ABOUT + PLAN SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-2 space-y-6">
            <div className="section-label">{t.about_label}</div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary leading-tight">
              {t.about_title}<br />
              <span className="gradient-text">{t.about_title2}</span>
            </h2>
            <p className="text-secondary leading-relaxed font-body">{t.about_p1}</p>
            <p className="text-secondary leading-relaxed font-body">{t.about_p2}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {t.highlights.map(h => (
                <div key={h} className="flex items-center gap-3 glass-card rounded-xl p-3">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-secondary text-sm font-body">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky plan card */}
          <div>
            <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-24">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary mb-2">{t.plan_title}</h3>
              <p className="text-secondary text-sm mb-5 leading-relaxed font-body">{t.plan_sub}</p>
              <Link
                href="/planner"
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 font-body"
              >
                {t.plan_cta}<ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-4 p-3.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl">
                <div className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 font-body">{t.best_time_label}</div>
                <div className="text-secondary text-sm font-body">{t.best_time}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── GALLERY ── */}
        <div className="mb-20">
          <div className="section-label mb-4">{t.gallery_label}</div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-8 leading-tight">
            {t.gallery_title}<br />
            <span className="gradient-text">{t.gallery_title2}</span>
          </h2>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px]">
            {GALLERY.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer focus:outline-none ${item.span}`}
              >
                <img
                  src={item.src}
                  alt={lang === 'en' ? item.labelEn : item.labelMm}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-semibold font-body">
                    {lang === 'en' ? item.labelEn : item.labelMm}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Lightbox */}
          {lightboxIdx !== null && (
            <div
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setLightboxIdx(null)}
            >
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={() => setLightboxIdx(null)}
              >
                <X className="w-5 h-5" />
              </button>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + GALLERY.length) % GALLERY.length) }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <img
                src={GALLERY[lightboxIdx].src.replace('w=800', 'w=1400')}
                alt={lang === 'en' ? GALLERY[lightboxIdx].labelEn : GALLERY[lightboxIdx].labelMm}
                className="max-w-full max-h-[85vh] rounded-2xl object-contain"
                onClick={e => e.stopPropagation()}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % GALLERY.length) }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-body">
                {lang === 'en' ? GALLERY[lightboxIdx].labelEn : GALLERY[lightboxIdx].labelMm}
              </div>
            </div>
          )}
        </div>

        {/* ── HOTELS ── */}
        <div>
          <div className="section-label mb-4">{t.hotels_label}</div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-2 leading-tight">
            {t.hotels_title}<br /><span className="gradient-text">{t.hotels_title2}</span>
          </h2>
          <p className="text-secondary text-base mb-10 max-w-xl font-body">{t.hotels_sub}</p>

          <div className="space-y-5">
            {HOTELS.map(hotel => (
              <div key={hotel.name} className={`glass-card rounded-2xl overflow-hidden border ${hotel.color}`}>
                <div className={`${hotel.color} px-6 py-4 flex items-center justify-between`}>
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary">{hotel.name}</h3>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold font-body">
                      {lang === 'en' ? hotel.category : hotel.categoryMm}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted font-body">{t.from}</div>
                    <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-body">
                      {Math.min(...hotel.rooms.map(r => r.price)).toLocaleString()} MMK{t.per_night}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {hotel.rooms.map(room => (
                      <div key={room.type} className="flex items-center justify-between py-2 px-3 bg-surface-2 rounded-xl">
                        <span className="text-secondary text-sm font-body">{room.type}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm ml-3 whitespace-nowrap font-body">
                          {room.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/planner"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 font-body">
              <Sparkles className="w-5 h-5" />{t.find_hotel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
