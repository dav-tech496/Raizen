'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Calendar, Wallet, Trash2, Sparkles, LogOut, TrendingUp } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Itinerary {
  id: string; user_id: string; destination: string; days: number
  budget: number; ai_response: any; title: string | null; created_at: string
}

export default function DashboardClient({ user, initialItineraries }: { user: User; initialItineraries: Itinerary[] }) {
  const router = useRouter()
  const [itineraries, setItineraries] = useState(initialItineraries)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from('itineraries').delete().eq('id', id)
    if (!error) setItineraries(prev => prev.filter(it => it.id !== id))
    setDeleting(null)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const totalDays = itineraries.reduce((s, i) => s + i.days, 0)
  const destinations = [...new Set(itineraries.map(i => i.destination))].length

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="section-label mb-3">My Account</div>
            <h1 className="text-5xl font-bold mb-2">Dashboard</h1>
            <p className="text-white/40">{user.email}</p>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Saved Itineraries', value: itineraries.length, icon: Sparkles },
            { label: 'Destinations Explored', value: destinations, icon: MapPin },
            { label: 'Total Nights Planned', value: totalDays, icon: Calendar },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Itineraries */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Saved Itineraries</h2>
          <Link href="/planner"
            className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-stone-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all">
            <Sparkles className="w-4 h-4" /> New Itinerary
          </Link>
        </div>

        {itineraries.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-stone-900" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No itineraries yet</h3>
            <p className="text-white/40 mb-8 max-w-sm mx-auto">Plan your first Ngwe Saung adventure with AI — takes less than 60 seconds.</p>
            <Link href="/planner" className="btn-primary">Start Planning</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {itineraries.map(it => (
              <div key={it.id} className="glass-card rounded-2xl p-6 hover:border-amber-400/20 border border-white/5 transition-all card-hover">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg leading-tight pr-3">
                    {it.title ?? `${it.destination} Trip`}
                  </h3>
                  <button onClick={() => handleDelete(it.id)} disabled={deleting === it.id}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-all disabled:opacity-40 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />{it.destination}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />{it.days} nights
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Wallet className="w-3.5 h-3.5 text-amber-400" />{it.budget.toLocaleString()} MMK budget
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/25">
                    {new Date(it.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <TrendingUp className="w-3 h-3" /> Saved
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
