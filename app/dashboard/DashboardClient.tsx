'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Itinerary } from '@/types'
import { MapPin, Calendar, Wallet, Trash2, Sparkles, LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Props {
  user: User
  initialItineraries: Itinerary[]
}

export default function DashboardClient({ user, initialItineraries }: Props) {
  const router = useRouter()
  const [itineraries, setItineraries] = useState(initialItineraries)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('itineraries').delete().eq('id', id)
    if (!error) setItineraries((prev) => prev.filter((it) => it.id !== id))
    setDeleting(null)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-stone-400">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 glass hover:bg-red-500/10 text-stone-400 hover:text-red-400 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold text-amber-400">{itineraries.length}</div>
            <div className="text-stone-400 text-sm mt-1">Saved Itineraries</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold text-amber-400">
              {[...new Set(itineraries.map((i) => i.destination))].length}
            </div>
            <div className="text-stone-400 text-sm mt-1">Destinations Explored</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl font-bold text-amber-400">
              {itineraries.reduce((sum, i) => sum + i.days, 0)}
            </div>
            <div className="text-stone-400 text-sm mt-1">Total Days Planned</div>
          </div>
        </div>

        {/* Itineraries */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Saved Itineraries</h2>
          <Link
            href="/planner"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            New Itinerary
          </Link>
        </div>

        {itineraries.length === 0 ? (
          <div className="text-center py-24 glass rounded-2xl">
            <Sparkles className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No itineraries yet</h3>
            <p className="text-stone-500 mb-6">Plan your first Myanmar adventure with AI.</p>
            <Link href="/planner" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl">
              Plan Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold leading-tight pr-2">
                    {itinerary.title ?? `${itinerary.destination} Trip`}
                  </h3>
                  <button
                    onClick={() => handleDelete(itinerary.id)}
                    disabled={deleting === itinerary.id}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-stone-500 hover:text-red-400 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-stone-400 text-sm">
                    <MapPin className="w-4 h-4 text-amber-400" />{itinerary.destination}
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-sm">
                    <Calendar className="w-4 h-4 text-amber-400" />{itinerary.days} days
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-sm">
                    <Wallet className="w-4 h-4 text-amber-400" />{itinerary.budget.toLocaleString()} MMK budget
                  </div>
                </div>
                <div className="text-xs text-stone-600">
                  Saved {new Date(itinerary.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
