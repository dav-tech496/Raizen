import Link from 'next/link'
import { MapPin, Sparkles, Shield, Star, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: '✨', title: 'AI-Powered Planning', desc: 'Gemini AI crafts personalized day-by-day itineraries with realistic Myanmar Kyat pricing.' },
  { icon: '📍', title: 'Local Destinations', desc: 'Expert guides for Bagan, Inle Lake, Ngwe Saung, and more hidden gems across Myanmar.' },
  { icon: '🛡️', title: 'Safety First', desc: 'Every itinerary includes current safety tips and practical local travel advisories.' },
  { icon: '⭐', title: 'Save & Revisit', desc: 'Create a free account to save all your itineraries and plan multiple trips.' },
]

const DESTINATIONS = [
  { name: 'Bagan', slug: 'bagan', tagline: '3,000+ Ancient Temples', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop' },
  { name: 'Inle Lake', slug: 'inle-lake', tagline: 'Floating Villages & Culture', img: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop' },
  { name: 'Ngwe Saung', slug: 'ngwesaung', tagline: '20km Pristine Beach', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-950" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-amber-300 mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Myanmar Travel Planner
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Myanmar<br />
            <span className="gradient-text">with Intelligence</span>
          </h1>
          <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Raizen uses Gemini AI to craft personalized itineraries for Myanmar&apos;s most
            breathtaking destinations — complete with local pricing, safety tips, and day-by-day plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planner" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all duration-200 text-lg hover:scale-105">
              <Sparkles className="w-5 h-5" />
              Plan My Trip
            </Link>
            <Link href="/destinations" className="inline-flex items-center gap-2 px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-200 text-lg">
              Explore Destinations
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Top Destinations</h2>
          <p className="text-stone-400 text-lg">Handpicked Myanmar experiences waiting for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DESTINATIONS.map((d) => (
            <Link key={d.slug} href={`/destinations/${d.slug}`} className="group block">
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold">{d.name}</h3>
                  <p className="text-amber-400 text-sm mt-1">{d.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-stone-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Why Raizen?</h2>
            <p className="text-stone-400 text-lg">Built for the modern Myanmar traveler</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to explore Myanmar?</h2>
          <p className="text-stone-400 text-lg mb-10">Generate your personalized itinerary in seconds — completely free.</p>
          <Link href="/planner" className="inline-flex items-center gap-2 px-10 py-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all duration-200 text-xl hover:scale-105">
            <Sparkles className="w-6 h-6" />
            Start Planning Free
          </Link>
        </div>
      </section>
    </div>
  )
}
