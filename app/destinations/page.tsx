import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DestinationsPage() {
  const supabase = createClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-amber-300 mb-4">
            <MapPin className="w-4 h-4" />
            Explore Myanmar
          </div>
          <h1 className="text-5xl font-bold mb-4">Destinations</h1>
          <p className="text-stone-400 text-xl max-w-2xl mx-auto">
            From ancient temples to pristine beaches, discover Myanmar&apos;s most stunning destinations.
          </p>
        </div>

        {destinations && destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group block">
                <div className="glass rounded-2xl overflow-hidden hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                  {dest.image_url && (
                    <div className="relative h-56 overflow-hidden">
                      <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      {dest.region}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                    <p className="text-stone-400 text-sm line-clamp-2 mb-4">{dest.description}</p>
                    {dest.highlights && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dest.highlights.slice(0, 3).map((h: string) => (
                          <span key={h} className="text-xs px-2 py-1 bg-stone-800 rounded-full text-stone-400">{h}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg">Loading destinations...</p>
          </div>
        )}
      </div>
    </div>
  )
}
