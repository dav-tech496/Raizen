'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Wallet, Calendar, Bookmark, BookmarkCheck, Shield, Lightbulb, Clock, ChevronDown, ChevronUp, Hotel, CheckCircle, MapPin, ArrowRight, Waves } from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'
import type { User } from '@supabase/supabase-js'

const DESTINATIONS = [
  {
    id: 'ngwesaung',
    nameEn: 'Ngwe Saung Beach',
    nameMm: 'ငွေဆောင် ကမ်းခြေ',
    regionEn: 'Ayeyarwady Region',
    regionMm: 'အင်းဝမဒေသ',
    descEn: 'Myanmar\'s most pristine 20km white sand beach on the Bay of Bengal.',
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

const HOTELS = [
  { name: 'AHTINKAYA RESORT', category: 'Luxury', rooms: [
    { type: 'Executive Deluxe', price: 350000 },
    { type: 'Sea View Villa (2nd Row)', price: 450000 },
    { type: 'Sea View Villa', price: 550000 },
    { type: 'Executive Suite', price: 750000 },
  ]},
  { name: 'EXCEL HOTEL', category: 'Mid-Range', rooms: [
    { type: 'Garden View (2 Pax)', price: 158000 },
    { type: 'Deluxe Garden View (2 Pax)', price: 170000 },
    { type: 'Garden View (4 Pax)', price: 315000 },
    { type: 'Jacuzzi Garden View (4 Pax)', price: 339000 },
    { type: 'Sea View (2 Pax)', price: 291000 },
    { type: 'Sea View (4 Pax)', price: 389000 },
    { type: 'Jacuzzi Sea View (4 Pax)', price: 413000 },
  ]},
  { name: 'CENTER POINT', category: 'Premium', rooms: [
    { type: 'Executive Family Seafront Bungalow (4 Pax)', price: 790000 },
    { type: 'Executive Seafront Bungalow (2 Pax)', price: 570000 },
    { type: 'Executive 2nd Seaview Bungalow (2 Pax)', price: 570000 },
    { type: 'Deluxe Seaview Building (2 Pax)', price: 320000 },
    { type: 'Deluxe Garden View Building (2 Pax)', price: 320000 },
  ]},
  { name: 'OCEAN PARADISE', category: 'Boutique', rooms: [
    { type: 'Sky Suite Penthouse (3 Pax)', price: 225000 },
    { type: 'Ocean Suite Penthouse', price: 172500 },
    { type: 'Ocean Suite Sea Side', price: 150000 },
    { type: 'Ocean Superior Penthouse', price: 135000 },
    { type: 'Ocean Superior With Balcony', price: 112500 },
    { type: 'Ocean Superior Without Balcony', price: 105000 },
  ]},
  { name: 'SUNNY VILLA', category: 'Villa', rooms: [
    { type: 'Villa Superior (2 Pax)', price: 135000 },
    { type: 'Villa (2 Pax)', price: 110000 },
    { type: 'Villa (3 Pax)', price: 150000 },
    { type: 'Villa (5 Pax)', price: 240000 },
  ]},
]

function getAffordableHotels(totalBudget: number, days: number) {
  const hotelBudget = Math.floor(totalBudget * 0.55)
  const perNightBudget = Math.floor(hotelBudget / days)
  const results: { hotel: string; category: string; room: string; pricePerNight: number; totalHotelCost: number }[] = []
  HOTELS.forEach(hotel => {
    hotel.rooms.forEach(room => {
      if (room.price <= perNightBudget) {
        results.push({
          hotel: hotel.name,
          category: hotel.category,
          room: room.type,
          pricePerNight: room.price,
          totalHotelCost: room.price * days,
        })
      }
    })
  })
  return results.sort((a, b) => b.pricePerNight - a.pricePerNight)
}

function PlannerContent() {
  const searchParams = useSearchParams()
  const { lang } = useLang()
  const [selectedDest, setSelectedDest] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState(1500000)
  const [itinerary, setItinerary] = useState<any>(null)
  const [affordableHotels, setAffordableHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedDay, setExpandedDay] = useState<number>(1)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setItinerary(null)
    setSaved(false)

    const hotels = getAffordableHotels(budget, days)
    setAffordableHotels(hotels)

    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: 'Ngwe Saung Beach', days, budget }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to generate itinerary')
      setItinerary(json.itinerary)
    } catch (err) {
      // error silenced
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
    } catch (err) {
      // save error silenced
    } finally {
      setSaving(false)
    }
  }

  const remaining = budget - (itinerary?.total_estimated_budget ?? 0)
  const activeDest = DESTINATIONS.find(d => d.id === selectedDest)

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
              {lang === 'en' ? 'Where are you\ngoing?' : 'ဘယ်ကို\nသွားမလဲ?'}
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
            onClick={() => { setSelectedDest(null); setItinerary(null) }}
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
              ? 'Set your budget and days — our AI builds your complete itinerary with hotels that fit your wallet.'
              : 'ဘတ်ဂျက်နှင့် ရက်အရေအတွက် သတ်မှတ်ပါ — AI မှ သင့်ဘတ်ဂျက်နှင့် ကိုက်ညီသော ဟိုတယ်များဖြင့် ပြည့်စုံသော စီစဉ်မှု ရေးဆွဲပေးမည်'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="bg-card border border-card rounded-3xl p-8 mb-8">
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
                    {b >= 1000000 ? `${b/1000000}M` : `${b/1000}K`}
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
                const transport = 150000
                const remaining = budget - transport
                return [
                  { label: 'Hotel', amount: Math.floor(remaining * 0.60) },
                  { label: 'Food', amount: Math.floor(remaining * 0.20) },
                  { label: 'Transport', amount: transport },
                  { label: 'Activities', amount: Math.floor(remaining * 0.15) },
                ].map(item => (
                  <div key={item.label} className="text-center bg-surface-3 rounded-xl p-3">
                    <div className="text-sm font-bold text-amber-400">{item.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted mt-0.5">{item.label}</div>
                    {item.label === 'Transport' && <div className="text-xs text-muted mt-0.5">fixed</div>}
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



{/* Affordable Hotels */}
        {affordableHotels.length > 0 && (
          <div className="bg-card border border-card rounded-3xl p-6 md:p-8 mb-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                <Hotel className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Hotels Within Your Budget</h3>
                <p className="text-muted text-sm mt-0.5">
                  {affordableHotels.length} room{affordableHotels.length !== 1 ? 's' : ''} available &middot; Up to {Math.floor(budget * 0.55 / days).toLocaleString()} MMK/night
                </p>
              </div>
            </div>

            {/* Group by hotel */}
            <div className="space-y-4">
              {HOTELS.map(hotel => {
                const hotelRooms = affordableHotels.filter(h => h.hotel === hotel.name)
                if (hotelRooms.length === 0) return null
                const categoryColors: Record<string, string> = {
                  Luxury: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
                  Premium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                  'Mid-Range': 'text-green-400 bg-green-400/10 border-green-400/20',
                  Boutique: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                  Villa: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
                }
                const catStyle = categoryColors[hotel.category] ?? 'text-secondary bg-surface-2 border-theme'
                return (
                  <div key={hotel.name} className="border border-theme rounded-2xl overflow-hidden">
                    {/* Hotel header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-surface-2 border-b border-theme">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-primary">{hotel.name}</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${catStyle}`}>
                          {hotel.category}
                        </span>
                      </div>
                      <span className="text-muted text-xs">{hotelRooms.length} room{hotelRooms.length !== 1 ? 's' : ''}</span>
                    </div>
                    {/* Room rows */}
                    <div className="divide-y divide-white/5">
                      {hotelRooms.map((h, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-3 hover:bg-surface-2 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-primary truncate">{h.room}</span>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0 pl-5 sm:pl-0">
                            <div className="text-right">
                              <div className="text-amber-400 font-bold text-sm">{h.pricePerNight.toLocaleString()} <span className="text-muted font-normal text-xs">MMK/night</span></div>
                              <div className="text-muted text-xs">{h.totalHotelCost.toLocaleString()} MMK total</div>
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

        {/* Itinerary */}
        {itinerary && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-card border border-card rounded-3xl p-8">
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

            {/* Daily Plans */}
            {(itinerary.daily_plans ?? []).map((day: any) => (
              <div key={day.day} className="bg-card border border-card rounded-3xl overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === day.day ? 0 : day.day)}
                  className="w-full flex items-center justify-between p-6 hover:bg-surface-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center text-stone-900 font-bold text-sm">
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

            {/* Tips */}
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
