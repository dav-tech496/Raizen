'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ItineraryAIResponse, PlannerFormData } from '@/types'
import { Sparkles, MapPin, Calendar, Wallet, Bookmark, BookmarkCheck, Shield, Lightbulb, Clock } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

const DESTINATIONS = ['Bagan', 'Ngwe Saung', 'Inle Lake', 'Mandalay', 'Yangon', 'Kyaiktiyo', 'Mrauk U']

function PlannerContent() {
  const searchParams = useSearchParams()
  const defaultDestination = searchParams.get('destination') ?? ''

  const [user, setUser] = useState<User | null>(null)
  const [destination, setDestination] = useState(defaultDestination)
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState(500000)
  const [itinerary, setItinerary] = useState<ItineraryAIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination) return
    setLoading(true)
    setError(null)
    setItinerary(null)
    setSaved(false)

    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, budget }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to generate itinerary')
      setItinerary(json.itinerary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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
        destination,
        days,
        budget,
        ai_response: itinerary,
        title: `${destination} — ${days} Days`,
      })
      if (error) throw error
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-amber-300 mb-4">
            <Sparkles className="w-4 h-4" />
            AI Trip Planner
          </div>
          <h1 className="text-5xl font-bold mb-4">Plan Your Myanmar Adventure</h1>
          <p className="text-stone-400 text-xl">Tell us your destination, duration, and budget — Raizen does the rest.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-3">
                <MapPin className="w-4 h-4 text-amber-400" /> Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Select destination</option>
                {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-3">
                <Calendar className="w-4 h-4 text-amber-400" />
                Duration: <span className="text-amber-400 font-bold ml-1">{days} {days === 1 ? 'day' : 'days'}</span>
              </label>
              <input type="range" min={1} max={14} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-amber-500" />
              <div className="flex justify-between text-xs text-stone-500 mt-1"><span>1 day</span><span>14 days</span></div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-3">
                <Wallet className="w-4 h-4 text-amber-400" />
                Budget: <span className="text-amber-400 font-bold ml-1">{budget.toLocaleString()} MMK</span>
              </label>
              <input type="range" min={50000} max={5000000} step={50000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-amber-500" />
              <div className="flex justify-between text-xs text-stone-500 mt-1"><span>50K</span><span>5M MMK</span></div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={loading || !destination}
              className="inline-flex items-center gap-3 px-10 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl transition-all duration-200 text-lg hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />Generating your itinerary...</>
              ) : (
                <><Sparkles className="w-5 h-5" />Generate Itinerary</>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center mb-6">{error}</div>
        )}

        {/* Itinerary Display */}
        {itinerary && (
          <div className="space-y-6">
            {/* Header */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-1">{itinerary.destination}</h2>
                  <p className="text-stone-400">{itinerary.total_days} days · {itinerary.best_time_to_visit}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-400 mb-1">Total Budget</div>
                  <div className="text-2xl font-bold text-amber-400">{itinerary.total_estimated_budget.toLocaleString()} MMK</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {Object.entries(itinerary.budget_breakdown).map(([key, val]) => (
                  <div key={key} className="bg-stone-800/50 rounded-xl p-3 text-center">
                    <div className="text-xs text-stone-500 capitalize mb-1">{key}</div>
                    <div className="text-sm font-bold text-amber-300">{(val as number).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {user ? (
                <button
                  onClick={handleSave}
                  disabled={saved || saving}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500 hover:bg-amber-400 text-stone-950 hover:scale-105'} disabled:cursor-not-allowed`}
                >
                  {saved ? <><BookmarkCheck className="w-4 h-4" />Saved!</> : saving ? <><div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />Saving...</> : <><Bookmark className="w-4 h-4" />Save Itinerary</>}
                </button>
              ) : (
                <p className="text-sm text-stone-500"><a href="/register" className="text-amber-400 hover:underline">Create a free account</a> to save this itinerary.</p>
              )}
            </div>

            {/* Daily Plans */}
            {itinerary.daily_plans.map((day) => (
              <div key={day.day} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Day {day.day}</span>
                    <h3 className="text-xl font-bold">{day.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-stone-500">Daily Est.</div>
                    <div className="text-sm font-bold text-amber-300">{day.estimated_cost.toLocaleString()} MMK</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-stone-800/40 rounded-xl">
                      <div className="flex-shrink-0 w-14 text-xs text-amber-400 font-mono font-bold pt-0.5">
                        <Clock className="w-3 h-3 inline mr-1" />{activity.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{activity.activity}</div>
                        <div className="text-xs text-stone-400 mt-0.5">📍 {activity.location}</div>
                        {activity.notes && <div className="text-xs text-stone-500 mt-1 italic">{activity.notes}</div>}
                      </div>
                      <div className="flex-shrink-0 text-xs font-semibold text-amber-300 text-right">
                        {activity.cost.toLocaleString()}<br /><span className="text-stone-500 font-normal">MMK</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {itinerary.safety_tips.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-4"><Shield className="w-5 h-5 text-red-400" />Safety Tips</h3>
                  <ul className="space-y-2">{itinerary.safety_tips.map((tip, i) => <li key={i} className="flex gap-2 text-sm text-stone-300"><span className="text-red-400 flex-shrink-0">•</span>{tip}</li>)}</ul>
                </div>
              )}
              {itinerary.local_tips.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-4"><Lightbulb className="w-5 h-5 text-amber-400" />Local Tips</h3>
                  <ul className="space-y-2">{itinerary.local_tips.map((tip, i) => <li key={i} className="flex gap-2 text-sm text-stone-300"><span className="text-amber-400 flex-shrink-0">•</span>{tip}</li>)}</ul>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <PlannerContent />
    </Suspense>
  )
}
