'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Wallet, Calendar, Bookmark, BookmarkCheck, Shield, Lightbulb, Clock, ChevronDown, ChevronUp, Hotel, CheckCircle } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

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
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
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
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const remaining = budget - (itinerary?.total_estimated_budget ?? 0)

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label mb-6 mx-auto w-fit">
            <Sparkles className="w-3 h-3" /> AI Trip Planner
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Plan Your<br /><span className="gradient-text">Ngwe Saung Escape</span>
          </h1>
          <p className="text-white/50 text-xl max-w-lg mx-auto">
            Set your budget and days — our AI builds your complete itinerary with hotels that fit your wallet.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="glass-card rounded-3xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-400" />
                Duration — <span className="text-amber-400">{days} {days === 1 ? 'Night' : 'Nights'}</span>
              </label>
              <input type="range" min={1} max={14} value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 rounded-full" />
              <div className="flex justify-between text-xs text-white/30 mt-2">
                <span>1 night</span><span>14 nights</span>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                {[2, 3, 5, 7].map(d => (
                  <button key={d} type="button" onClick={() => setDays(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${days === d ? 'gradient-gold text-stone-900' : 'glass text-white/60 hover:text-white'}`}>
                    {d} nights
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-amber-400" />
                Budget — <span className="text-amber-400">{budget.toLocaleString()} MMK</span>
              </label>
              <input type="range" min={200000} max={10000000} step={100000} value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 rounded-full" />
              <div className="flex justify-between text-xs text-white/30 mt-2">
                <span>200K</span><span>10M MMK</span>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                {[500000, 1000000, 2000000, 5000000].map(b => (
                  <button key={b} type="button" onClick={() => setBudget(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${budget === b ? 'gradient-gold text-stone-900' : 'glass text-white/60 hover:text-white'}`}>
                    {b >= 1000000 ? `${b/1000000}M` : `${b/1000}K`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Breakdown Preview */}
          <div className="mt-8 p-4 bg-white/3 rounded-2xl border border-white/5">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Estimated Budget Split</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Hotel', pct: 55, color: 'bg-amber-400' },
                { label: 'Food', pct: 20, color: 'bg-blue-400' },
                { label: 'Transport', pct: 15, color: 'bg-green-400' },
                { label: 'Activities', pct: 10, color: 'bg-purple-400' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-sm font-bold text-white">{Math.floor(budget * item.pct / 100).toLocaleString()}</div>
                  <div className="text-xs text-white/40 mt-0.5">{item.label}</div>
                </div>
              ))}
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

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center mb-6">{error}</div>
        )}

        {/* Affordable Hotels */}
        {affordableHotels.length > 0 && (
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Hotel className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-xl font-bold">Hotels Within Your Budget</h3>
                <p className="text-white/40 text-sm">{affordableHotels.length} options available · Based on {Math.floor(budget * 0.55 / days).toLocaleString()} MMK/night hotel budget</p>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {affordableHotels.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/3 rounded-xl border border-white/5 hover:border-amber-400/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{h.hotel}</div>
                      <div className="text-white/40 text-xs">{h.room}</div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-amber-400 font-bold text-sm">{h.pricePerNight.toLocaleString()}/night</div>
                    <div className="text-white/40 text-xs">{h.totalHotelCost.toLocaleString()} total</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        {itinerary && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-start justify-between flex-wrap gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-1">{itinerary.destination}</h2>
                  <p className="text-white/50">{itinerary.total_days} days · {itinerary.best_time_to_visit}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Estimate</div>
                  <div className="text-3xl font-bold gradient-text">{itinerary.total_estimated_budget?.toLocaleString()}</div>
                  <div className="text-white/40 text-sm">MMK</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {Object.entries(itinerary.budget_breakdown ?? {}).map(([key, val]) => (
                  <div key={key} className="bg-white/3 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-white/40 capitalize mb-1">{key}</div>
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
                <p className="text-sm text-white/40">
                  <a href="/register" className="text-amber-400 hover:underline font-medium">Create a free account</a> to save this itinerary.
                </p>
              )}
            </div>

            {/* Daily Plans */}
            {(itinerary.daily_plans ?? []).map((day: any) => (
              <div key={day.day} className="glass-card rounded-3xl overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === day.day ? 0 : day.day)}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center text-stone-900 font-bold text-sm">
                      {day.day}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">{day.title}</div>
                      <div className="text-white/40 text-sm">{day.activities?.length ?? 0} activities</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-amber-400 font-bold">{day.estimated_cost?.toLocaleString()}</div>
                      <div className="text-white/30 text-xs">MMK</div>
                    </div>
                    {expandedDay === day.day ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
                  </div>
                </button>

                {expandedDay === day.day && (
                  <div className="px-6 pb-6 space-y-3">
                    {(day.activities ?? []).map((a: any, i: number) => (
                      <div key={i} className="flex gap-4 p-4 bg-white/3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold w-14 flex-shrink-0 pt-0.5">
                          <Clock className="w-3 h-3" />{a.time}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{a.activity}</div>
                          <div className="text-white/40 text-xs mt-0.5">📍 {a.location}</div>
                          {a.notes && <div className="text-white/30 text-xs mt-1 italic">{a.notes}</div>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-amber-400 font-bold text-sm">{a.cost?.toLocaleString()}</div>
                          <div className="text-white/30 text-xs">MMK</div>
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
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex items-center gap-2 font-bold text-lg mb-4">
                    <Shield className="w-5 h-5 text-red-400" /> Safety Tips
                  </div>
                  <ul className="space-y-2">
                    {itinerary.safety_tips.map((tip: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-white/60">
                        <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(itinerary.local_tips?.length > 0) && (
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex items-center gap-2 font-bold text-lg mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-400" /> Local Tips
                  </div>
                  <ul className="space-y-2">
                    {itinerary.local_tips.map((tip: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-white/60">
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
