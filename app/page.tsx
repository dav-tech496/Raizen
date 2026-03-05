import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Star, MapPin, Waves, Sun, Camera } from 'lucide-react'

const STATS = [
  { value: '20km', label: 'Pristine Coastline' },
  { value: '5★', label: 'Luxury Resorts' },
  { value: 'AI', label: 'Smart Planning' },
  { value: 'MMK', label: 'Local Pricing' },
]

const FEATURES = [
  { icon: Sparkles, title: 'Gemini AI Planner', desc: 'Tell us your budget and days — our AI builds a complete day-by-day itinerary with real Ngwe Saung pricing in MMK.' },
  { icon: Shield, title: 'Verified Hotels', desc: 'Every hotel listing is manually verified with accurate room types and current pricing from resort contacts.' },
  { icon: Star, title: 'Save & Revisit', desc: 'Create a free account to save unlimited itineraries and access them anytime from any device.' },
  { icon: Camera, title: 'Local Expertise', desc: 'Built by travelers who know Ngwe Saung — real tips, real places, real experiences.' },
]

const EXPERIENCES = [
  { title: 'Beach Sunrise', desc: 'Wake up to golden hour on 20km of empty white sand', icon: Sun },
  { title: 'Crystal Waters', desc: 'Snorkel in some of the clearest water in Southeast Asia', icon: Waves },
  { title: 'Seafood Feasts', desc: 'Fresh catch served at beachside restaurants every evening', icon: Star },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85&auto=format&fit=crop"
            alt="Ngwe Saung Beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/30 to-stone-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
          <div className="max-w-3xl">
            <div className="section-label mb-6">
              <Sparkles className="w-3 h-3" />
              AI-Powered Myanmar Travel
            </div>

            <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] mb-6 text-shadow-lg">
              Ngwe Saung<br />
              <span className="gradient-text">Reimagined.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-xl leading-relaxed font-light">
              Myanmar&apos;s most pristine beach, planned perfectly by AI. Real hotels, real prices, zero guesswork.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/planner" className="btn-primary text-lg px-8 py-4 rounded-2xl font-bold">
                <Sparkles className="w-5 h-5" />
                Plan My Trip Free
              </Link>
              <Link href="/destinations/ngwesaung" className="btn-ghost text-lg px-8 py-4 rounded-2xl">
                Explore Ngwe Saung
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-6 pb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-white/50 text-xs mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINATION SHOWCASE ── */}
      <section className="py-32 px-6 bg-stone-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-6">
                <MapPin className="w-3 h-3" />
                The Destination
              </div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Myanmar&apos;s Best-Kept<br />
                <span className="gradient-text">Secret Beach</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Ngwe Saung stretches 20 kilometers along the Bay of Bengal — a near-empty coastline of powder-white sand and turquoise water just hours from Yangon. No crowds. No chaos. Just pure beach.
              </p>
              <div className="space-y-4">
                {EXPERIENCES.map((e) => (
                  <div key={e.title} className="flex items-start gap-4 glass-card rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0">
                      <e.icon className="w-5 h-5 text-stone-900" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{e.title}</div>
                      <div className="text-white/50 text-sm mt-0.5">{e.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/destinations/ngwesaung" className="btn-primary">
                  View Full Guide <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48 card-hover">
                  <img src="https://images.unsplash.com/photo-1520454974749-611f37e6bcdf?w=400&q=80&auto=format&fit=crop" alt="Beach" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-64 card-hover">
                  <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80&auto=format&fit=crop" alt="Resort" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden h-64 card-hover">
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80&auto=format&fit=crop" alt="Ngwe Saung" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48 card-hover">
                  <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80&auto=format&fit=crop" alt="Sunset" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 px-6 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="section-label mb-6 mx-auto w-fit">How Raizen Works</div>
            <h2 className="text-5xl font-bold mb-4">Plan in <span className="gradient-text">3 Steps</span></h2>
            <p className="text-white/50 text-xl max-w-xl mx-auto">From blank page to complete itinerary in under 60 seconds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set Your Budget', desc: 'Enter your total MMK budget and how many days you want to spend at Ngwe Saung.' },
              { step: '02', title: 'AI Builds Your Plan', desc: 'Gemini AI matches your budget to real hotels, activities, food, and transport with accurate local pricing.' },
              { step: '03', title: 'Save & Go', desc: 'Save your itinerary to your account, share it, or use it as your travel companion on the ground.' },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-8 card-hover">
                <div className="text-6xl font-bold gradient-text opacity-30 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-32 px-6 bg-stone-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="section-label mb-6 mx-auto w-fit">Why Raizen</div>
            <h2 className="text-5xl font-bold">Built for <span className="gradient-text">Smart Travelers</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-6 card-hover group">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-stone-900" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=60&auto=format&fit=crop" alt="Beach" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Your Perfect Beach Trip<br />
            <span className="gradient-text">Starts Here</span>
          </h2>
          <p className="text-white/60 text-xl mb-10">
            Join travelers who plan smarter with Raizen. Free forever.
          </p>
          <Link href="/planner" className="btn-primary text-xl px-12 py-5 rounded-2xl font-bold">
            <Sparkles className="w-6 h-6" />
            Generate My Itinerary
          </Link>
        </div>
      </section>
    </div>
  )
}
