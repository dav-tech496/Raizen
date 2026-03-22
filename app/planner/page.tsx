'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles, Wallet, Calendar, Bookmark, BookmarkCheck,
  Shield, Lightbulb, Clock, ChevronDown, ChevronUp,
  Hotel, CheckCircle, ArrowRight, Car, Info
} from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'
import type { User } from '@supabase/supabase-js'

const DESTINATIONS = [
  {
    id: 'ngwesaung',
    nameEn: 'Ngwe Saung Beach',
    nameMm: 'ငွေဆောင် ကမ်းခြေ',
    regionEn: 'Ayeyarwady Region',
    regionMm: 'အင်းဝမဒေသ',
    descEn: "Myanmar's most pristine 20km white sand beach on the Bay of Bengal.",
    descMm: 'ဘင်္ဂလားပင်လယ်အော်ရှိ မြန်မာ၏ အသန့်ရှင်းဆုံး ကမ်းခြေ ၂၀ ကီလိုမီတာ',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
    available: true,
  },
  {
    id: 'bagan',
    nameEn: 'Bagan',
    nameMm: 'ပုဂံ',
    regionEn: 'Mandalay Region',
    regionMm: 'မန္တလေးတိုင်း',
    descEn: 'Ancient temples and hot air balloons — coming soon.',
    descMm: 'ရှေးဟောင်းဘုရားကျောင်းများ — မကြာမီ ထပ်တိုးမည်',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
    available: false,
  },
  {
    id: 'inlelake',
    nameEn: 'Inle Lake',
    nameMm: 'အင်းလေး',
    regionEn: 'Shan State',
    regionMm: 'ရှမ်းပြည်နယ်',
    descEn: 'Floating villages and serene waters — coming soon.',
    descMm: 'မျောနေသောရွာများ — မကြာမီ ထပ်တိုးမည်',
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop',
    available: false,
  },
]

interface HotelWithRooms {
  id: string
  name: string
  price_category: string | null
  rooms: { id: string; room_type: string; price_per_night: number; capacity: number | null }[]
}

interface TransportOption {
  id: string
  route: string
  vehicle_type: string
  price_regular: number
  price_weekend: number | null
  price_holiday: number | null
  note: string | null
}

interface AffordableRoom {
  hotel: string
  category: string
  room: string
  pricePerNight: number
  totalHotelCost: number
}

function getAffordableRooms(
  hotels: HotelWithRooms[],
  totalBudget: number,
  days: number,
  transportCost: number
): AffordableRoom[] {
  const hotelBudget = Math.floor((totalBudget - transportCost) * 0.60)
  const perNightBudget = Math.floor(hotelBudget / days)
  const results: AffordableRoom[] = []
  hotels.forEach(hotel => {
    hotel.rooms.forEach(room => {
      if (room.price_per_night <= perNightBudget) {
        results.push({
          hotel: hotel.name,
          category: hotel.price_category ?? 'standard',
          room: room.room_type,
          pricePerNight: room.price_per_night,
          totalHotelCost: room.price_per_night * days,
        })
      }
    })
  })
  return results.sort((a, b) => b.pricePerNight - a.pricePerNight)
}

function PlannerContent() {
  const { lang } = useLang()
  const [selectedDest, setSelectedDest] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState(1500000)
  const [itinerary, setItinerary] = useState<any>(null)
  const [affordableRooms, setAffordableRooms] = useState<AffordableRoom[]>([])
  const [hotels, setHotels] = useState<HotelWithRooms[]>([])
  const [transport, setTransport] = useState<TransportOption[]>([])
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number>(1)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // Load hotels + transport when destination selected
  useEffect(() => {
    if (!selectedDest) return
    setLoadingData(true)
    const supabase = createClient()
    const slug = selectedDest === 'inlelake' ? 'inle-lake' : selectedDest

    supabase
      .from('destinations')
      .select('id')
      .eq('slug', slug)
      .single()
      .then(async ({ data: dest }) => {
        if (!dest) { setLoadingData(false); return }

        const [{ data: hotelRows }, { data: transportRows }] = await Promise.all([
          supabase.from('hotels').select('id, name, price_category').eq('destination_id', dest.id),
          supabase.from('transport').select('*').eq('destination_id', dest.id),
        ])

        const hotelsWithRooms: HotelWithRooms[] = await Promise.all(
          (hotelRows ?? []).map(async (h) => {
            const { data: rooms } = await supabase
              .from('hotel_rooms')
              .select('id, room_type, price_per_night, capacity')
              .eq('hotel_id', h.id)
              .order('price_per_night', { ascending: true })
            return { ...h, rooms: rooms ?? [] }
          })
        )

        setHotels(hotelsWithRooms)
        setTransport(transportRows ?? [])
        if (transportRows && transportRows.length > 0) setSelectedTransport(transportRows[0])
        setLoadingData(false)
      })
  }, [selectedDest])

  // Recalculate affordable rooms when budget/days/transport/hotels changes
  useEffect(() => {
    if (hotels.length === 0) return
    const transportCost = selectedTransport?.price_regular ?? 0
    setAffordableRooms(getAffordableRooms(hotels, budget, days, transportCost))
  }, [hotels, budget, days, selectedTransport])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setItinerary(null)
    setSaved(false)
    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: 'Ngwe Saung Beach', days, budget }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed')
      setItinerary(json.itinerary)
    } catch {
      // silenced
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !itinerary) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('itineraries').insert({
        user_id: user.id,
        destination: 'Ngwe Saung',
        days,
        budget,
        ai_response: itinerary,
        title: `Ngwe Saung — ${days} Days`,
      })
      if (error) throw error
      setSaved(true)
    } catch {
      // silenced
    } finally {
      setSaving(false)
    }
  }

  const transportCost = selectedTransport?.price_regular ?? 0
  const activeDest = DESTINATIONS.find(d => d.id === selectedDest)

  const categoryColors: Record<string, string> = {
    luxury:      'text-purple-400 bg-purple-400/10 border-purple-400/20',
    premium:     'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'mid-range': 'text-green-400 bg-green-400/10 border-green-400/20',
    boutique:    'text-amber-400 bg-amber-400/10 border-amber-400/20',
    villa:       'text-rose-400 bg-rose-400/10 border-rose-400/20',
    budget:      'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  }

  // ── STEP 1: Destination selector ──
  if (!selectedDest) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-surface text-primary">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="section-label mx-auto mb-5">
              {lang === 'en' ? 'Trip Planner' : 'ခရီးစဉ်စီစဉ်သူ'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary mb-4">
              {lang === 'en' ? 'Where are you going?' : 'ဘယ်ကို သွားမလဲ?'}
            </h1>
            <p className="text-secondary font-body text-lg">
              {lang === 'en' ? 'Choose your destination to start planning.' : 'စီစဉ်ရန် ခရီးစဉ်ကို ရွေးချယ်ပါ'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {DESTINATIONS.map(dest => (
              <button
                key={dest.id}
                onClick={() => dest.available && setSelectedDest(dest.id)}
                disabled={!dest.available}
                className={`relative rounded-2xl overflow-hidden text-left transition-all duration-300 group ${
                  dest.available
                    ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.img}
                    alt={lang === 'en' ? dest.nameEn : dest.nameMm}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {!dest.available && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur text-white text-xs font-semibold rounded-full font-body">
                      {lang === 'en' ? 'Coming Soon' : 'မကြာမီ'}
                    </div>
                  )}
                  {dest.available && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full font-body flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                      {lang === 'en' ? 'Available' : 'ရနိုင်သည်'}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white/70 text-xs font-body mb-0.5">
                      {lang === 'en' ? dest.regionEn : dest.regionMm}
                    </p>
                    <h3 className="text-white font-display text-xl font-bold">
                      {lang === 'en' ? dest.nameEn : dest.nameMm}
                    </h3>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-b-2xl border-t-0">
                  <p className="text-secondary text-xs font-body leading-relaxed">
                    {lang === 'en' ? dest.descEn : dest.descMm}
                  </p>
                  {dest.available && (
                    <div className="flex items-center gap-1 mt-3 text-blue-600 dark:text-blue-400 text-xs font-semibold font-body">
                      {lang === 'en' ? 'Plan this trip' : 'စီစဉ်ရန်'} <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-surface text-primary">
      <div className="max-w-4xl mx-auto w-full">

        {/* Header */}
        <div className="text-center mb-14">
          <button
            onClick={() => { setSelectedDest(null); setItinerary(null); setHotels([]); setTransport([]) }}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-secondary font-body mb-6 transition-colors"
          >
            ← {lang === 'en' ? 'Change destination' : 'ခရီးစဉ် ပြောင်းရန်'}
          </button>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4 text-primary">
            {lang === 'en' ? 'Plan Your' : 'သင့်ခရီးစဉ်'}<br />
            <span className="gradient-text">{lang === 'en' ? (activeDest?.nameEn ?? 'Escape') : (activeDest?.nameMm ?? 'ခရီးစဉ်')}</span>
          </h1>
          <p className="text-secondary text-lg max-w-lg mx-auto font-body">
            {lang === 'en'
              ? 'Set your budget and days — AI builds your itinerary with real hotels and transport prices.'
              : 'ဘတ်ဂျက်နှင့် ရက်အရေအတွက် သတ်မှတ်ပါ — AI မှ ဟိုတယ်နှင့် ယာဉ်ခများဖြင့် စီစဉ်မှုရေးဆွဲပေးမည်'
            }
          </p>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleGenerate} className="bg-card border border-card rounded-3xl p-6 sm:p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-4 uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Duration — <span className="text-amber-400">{days} {days === 1 ? 'Night' : 'Nights'}</span>
                  </label>
                  <input type="range" min={1} max={14} value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-amber-400 h-2 rounded-full" />
                  <div className="flex justify-between text-xs text-muted mt-2">
                    <span>1 night</span><span>14 nights</span>
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {[2, 3, 5, 7].map(d => (
                      <button key={d} type="button" onClick={() => setDays(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${days === d ? 'gradient-gold text-stone-900' : 'bg-surface-2 border border-theme text-secondary hover:text-primary'}`}>
                        {d} nights
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-4 uppercase tracking-wider">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    Budget — <span className="text-amber-400">{budget.toLocaleString()} MMK</span>
                  </label>
                  <input type="range" min={200000} max={10000000} step={100000} value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-amber-400 h-2 rounded-full" />
                  <div className="flex justify-between text-xs text-muted mt-2">
                    <span>200K</span><span>10M MMK</span>
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {[500000, 1000000, 2000000, 5000000].map(b => (
                      <button key={b} type="button" onClick={() => setBudget(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${budget === b ? 'gradient-gold text-stone-900' : 'bg-surface-2 border border-theme text-secondary hover:text-primary'}`}>
                        {b >= 1000000 ? `${b / 1000000}M` : `${b / 1000}K`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Breakdown Preview */}
              <div className="mt-8 p-4 bg-surface-2 rounded-2xl border border-theme">
                <div className="text-muted uppercase tracking-wider text-xs mb-3">Estimated Budget Split</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(() => {
                    const remaining = budget - transportCost
                    return [
                      { label: 'Hotel',      amount: Math.floor(remaining * 0.60) },
                      { label: 'Food',       amount: Math.floor(remaining * 0.20) },
                      { label: 'Transport',  amount: transportCost, sub: selectedTransport?.vehicle_type },
                      { label: 'Activities', amount: Math.floor(remaining * 0.15) },
                    ].map(item => (
                      <div key={item.label} className="text-center bg-surface-3 rounded-xl p-3">
                        <div className="text-sm font-bold text-amber-400">{item.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted mt-0.5">{item.label}</div>
                        {item.sub && <div className="text-xs text-muted/70 mt-0.5 truncate">{item.sub}</div>}
                      </div>
                    ))
                  })()}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-8 py-4 gradient-gold text-stone-900 font-bold rounded-2xl text-lg transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />Building your itinerary...</>
                ) : (
                  <><Sparkles className="w-5 h-5" />Generate My Itinerary</>
                )}
              </button>
            </form>

            {/* ── TRANSPORT SECTION ── */}
            {transport.length > 0 && (
              <div className="bg-card border border-card rounded-3xl p-6 md:p-8 mb-8">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Transport Options</h3>
                    <p className="text-muted text-sm mt-0.5">Real prices · Select one to update your budget split</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {transport.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTransport(t)}
                      className={`w-full text-left border rounded-2xl p-4 transition-all ${
                        selectedTransport?.id === t.id
                          ? 'border-amber-400/60 bg-amber-400/5'
                          : 'border-theme hover:border-amber-400/30 bg-surface-2'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          {selectedTransport?.id === t.id && (
                            <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-semibold text-primary text-sm">{t.route}</div>
                            <div className="text-muted text-xs mt-0.5">{t.vehicle_type}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <div className="bg-surface-3 rounded-xl px-3 py-2 text-center">
                            <div className="text-amber-400 font-bold text-sm">{t.price_regular.toLocaleString()}</div>
                            <div className="text-muted text-xs">Regular</div>
                          </div>
                          {t.price_weekend && (
                            <div className="bg-surface-3 rounded-xl px-3 py-2 text-center">
                              <div className="text-amber-400 font-bold text-sm">{t.price_weekend.toLocaleString()}</div>
                              <div className="text-muted text-xs">Fri–Sat</div>
                            </div>
                          )}
                          {t.price_holiday && (
                            <div className="bg-surface-3 rounded-xl px-3 py-2 text-center">
                              <div className="text-amber-400 font-bold text-sm">{t.price_holiday.toLocaleString()}</div>
                              <div className="text-muted text-xs">Holiday</div>
                            </div>
                          )}
                        </div>
                      </div>
                      {t.note && (
                        <div className="flex items-start gap-1.5 mt-3 text-xs text-muted">
                          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {t.note}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── HOTELS SECTION ── */}
            {affordableRooms.length > 0 && (
              <div className="bg-card border border-card rounded-3xl p-6 md:p-8 mb-8">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                    <Hotel className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Hotels Within Your Budget</h3>
                    <p className="text-muted text-sm mt-0.5">
                      {affordableRooms.length} room{affordableRooms.length !== 1 ? 's' : ''} available · Up to {Math.floor((budget - transportCost) * 0.60 / days).toLocaleString()} MMK/night
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {hotels.map(hotel => {
                    const hotelRooms = affordableRooms.filter(r => r.hotel === hotel.name)
                    if (hotelRooms.length === 0) return null
                    const catKey = hotel.price_category ?? 'standard'
                    const catStyle = categoryColors[catKey] ?? 'text-secondary bg-surface-2 border-theme'
                    const catLabel = catKey.charAt(0).toUpperCase() + catKey.slice(1)

                    return (
                      <div key={hotel.id} className="border border-theme rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 bg-surface-2 border-b border-theme">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-bold text-sm text-primary truncate">{hotel.name}</span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${catStyle}`}>
                              {catLabel}
                            </span>
                          </div>
                          <span className="text-muted text-xs flex-shrink-0 ml-2">{hotelRooms.length} room{hotelRooms.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="divide-y divide-white/5">
                          {hotelRooms.map((r, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-3 hover:bg-surface-2 transition-colors">
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                                <span className="text-sm text-primary truncate">{r.room}</span>
                              </div>
                              <div className="flex items-center gap-4 flex-shrink-0 pl-5 sm:pl-0">
                                <div className="text-right">
                                  <div className="text-amber-400 font-bold text-sm">{r.pricePerNight.toLocaleString()} <span className="text-muted font-normal text-xs">MMK/night</span></div>
                                  <div className="text-muted text-xs">{r.totalHotelCost.toLocaleString()} MMK total</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── ITINERARY ── */}
            {itinerary && (
              <div className="space-y-6">
                <div className="bg-card border border-card rounded-3xl p-6 sm:p-8">
                  <div className="flex items-start justify-between flex-wrap gap-6 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-1">{itinerary.destination}</h2>
                      <p className="text-secondary">{itinerary.total_days} days · {itinerary.best_time_to_visit}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted uppercase tracking-wider mb-1">Total Estimate</div>
                      <div className="text-3xl font-bold gradient-text">{itinerary.total_estimated_budget?.toLocaleString()}</div>
                      <div className="text-muted text-sm">MMK</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                    {Object.entries(itinerary.budget_breakdown ?? {}).map(([key, val]) => (
                      <div key={key} className="bg-surface-2 rounded-xl p-3 text-center border border-theme">
                        <div className="text-xs text-muted capitalize mb-1">{key}</div>
                        <div className="text-sm font-bold text-amber-400">{(val as number).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <button onClick={handleSave} disabled={saved || saving}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        saved ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'gradient-gold text-stone-900 hover:opacity-90'
                      }`}>
                      {saved ? <><BookmarkCheck className="w-4 h-4" />Saved to Dashboard</>
                        : saving ? <><div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />Saving...</>
                        : <><Bookmark className="w-4 h-4" />Save This Itinerary</>}
                    </button>
                  ) : (
                    <p className="text-sm text-muted">
                      <a href="/register" className="text-amber-400 hover:underline font-medium">Create a free account</a> to save this itinerary.
                    </p>
                  )}
                </div>

                {(itinerary.daily_plans ?? []).map((day: any) => (
                  <div key={day.day} className="bg-card border border-card rounded-3xl overflow-hidden">
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? 0 : day.day)}
                      className="w-full flex items-center justify-between p-6 hover:bg-surface-2 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center text-stone-900 font-bold text-sm flex-shrink-0">
                          {day.day}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg">{day.title}</div>
                          <div className="text-muted text-sm">{day.activities?.length ?? 0} activities</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-amber-400 font-bold">{day.estimated_cost?.toLocaleString()}</div>
                          <div className="text-muted text-xs">MMK</div>
                        </div>
                        {expandedDay === day.day ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
                      </div>
                    </button>

                    {expandedDay === day.day && (
                      <div className="px-6 pb-6 space-y-3">
                        {(day.activities ?? []).map((a: any, i: number) => (
                          <div key={i} className="flex gap-4 p-4 bg-surface-2 rounded-xl border border-theme">
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold w-14 flex-shrink-0 pt-0.5">
                              <Clock className="w-3 h-3" />{a.time}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-primary">{a.activity}</div>
                              <div className="text-muted text-xs mt-0.5">📍 {a.location}</div>
                              {a.notes && <div className="text-muted text-xs mt-1 italic">{a.notes}</div>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-amber-400 font-bold text-sm">{a.cost?.toLocaleString()}</div>
                              <div className="text-muted text-xs">MMK</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(itinerary.safety_tips?.length > 0) && (
                    <div className="bg-card border border-card rounded-3xl p-6">
                      <div className="flex items-center gap-2 font-bold text-lg mb-4">
                        <Shield className="w-5 h-5 text-red-400" /> Safety Tips
                      </div>
                      <ul className="space-y-2">
                        {itinerary.safety_tips.map((tip: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm text-secondary">
                            <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(itinerary.local_tips?.length > 0) && (
                    <div className="bg-card border border-card rounded-3xl p-6">
                      <div className="flex items-center gap-2 font-bold text-lg mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-400" /> Local Tips
                      </div>
                      <ul className="space-y-2">
                        {itinerary.local_tips.map((tip: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm text-secondary">
                            <span className="text-amber-400 flex-shrink-0 mt-0.5">•</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <PlannerContent />
    </Suspense>
  )
}
