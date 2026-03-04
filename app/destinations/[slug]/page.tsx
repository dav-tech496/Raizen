import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const supabase = createClient()
  const { data } = await supabase.from('destinations').select('slug')
  return (data ?? []).map((d) => ({ slug: d.slug }))
}

export default async function DestinationPage({ params }: Props) {
  const supabase = createClient()

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!destination) notFound()

  const { data: hotels } = await supabase
    .from('hotels')
    .select('*')
    .eq('destination_id', destination.id)
    .order('rating', { ascending: false })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[65vh] overflow-hidden">
        {destination.image_url && (
          <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            {destination.region}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">{destination.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
              <p className="text-stone-300 text-lg leading-relaxed">{destination.description}</p>
            </div>

            {destination.highlights && destination.highlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.highlights.map((h: string) => (
                    <div key={h} className="flex items-center gap-3 glass rounded-xl p-4">
                      <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <span className="text-stone-200">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hotels && hotels.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Where to Stay</h2>
                <div className="space-y-4">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="glass rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-bold text-lg">{hotel.name}</h4>
                            {hotel.verified && (
                              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">✓ Verified</span>
                            )}
                          </div>
                          {hotel.address && (
                            <p className="text-stone-400 text-sm mb-3">{hotel.address}</p>
                          )}
                          {hotel.amenities && (
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((a: string) => (
                                <span key={a} className="text-xs px-2 py-1 bg-stone-800 rounded-full text-stone-400">{a}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          {hotel.rating && (
                            <div className="flex items-center gap-1 justify-end text-amber-400 mb-1">
                              <Star className="w-4 h-4 fill-amber-400" />
                              <span className="font-bold">{hotel.rating}</span>
                            </div>
                          )}
                          <div className="text-sm font-semibold">{hotel.price_range}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Plan Your Trip</h3>
              <p className="text-stone-400 text-sm mb-6">
                Get a personalized AI itinerary for {destination.name} with realistic local pricing.
              </p>
              <Link
                href={`/planner?destination=${encodeURIComponent(destination.name)}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors"
              >
                Generate Itinerary
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
