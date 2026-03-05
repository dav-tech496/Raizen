import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ArrowRight, CheckCircle, Waves, Sun, Wind, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props { params: { slug: string } }

const HOTELS = [
  {
    name: 'AHTINKAYA RESORT',
    category: 'Luxury',
    color: 'from-amber-500/20 to-orange-500/10',
    rooms: [
      { type: 'Executive Deluxe', price: 350000 },
      { type: 'Sea View Villa (2nd Row)', price: 450000 },
      { type: 'Sea View Villa', price: 550000 },
      { type: 'Executive Suite', price: 750000 },
      { type: 'Extra Bed', price: 120000 },
    ],
  },
  {
    name: 'EXCEL HOTEL',
    category: 'Mid-Range',
    color: 'from-blue-500/20 to-cyan-500/10',
    rooms: [
      { type: 'Garden View (2 Pax)', price: 158000 },
      { type: 'Deluxe Garden View (2 Pax)', price: 170000 },
      { type: 'Garden View (4 Pax)', price: 315000 },
      { type: 'Jacuzzi Garden View (4 Pax)', price: 339000 },
      { type: 'Sea View (2 Pax)', price: 291000 },
      { type: 'Sea View (4 Pax)', price: 389000 },
      { type: 'Jacuzzi Sea View (4 Pax)', price: 413000 },
    ],
  },
  {
    name: 'CENTER POINT',
    category: 'Premium',
    color: 'from-purple-500/20 to-pink-500/10',
    rooms: [
      { type: 'Executive Family Seafront Bungalow (4 Pax)', price: 790000 },
      { type: 'Executive Seafront Bungalow (2 Pax)', price: 570000 },
      { type: 'Executive 2nd Seaview Bungalow (2 Pax)', price: 570000 },
      { type: 'Deluxe Seaview Building (2 Pax)', price: 320000 },
      { type: 'Deluxe Garden View Building (2 Pax)', price: 320000 },
      { type: 'Extra Bed (Bungalow)', price: 115000 },
      { type: 'Extra Bed (Deluxe)', price: 75000 },
    ],
  },
  {
    name: 'OCEAN PARADISE',
    category: 'Boutique',
    color: 'from-teal-500/20 to-emerald-500/10',
    rooms: [
      { type: 'Sky Suite Penthouse (3 Pax)', price: 225000 },
      { type: 'Ocean Suite Penthouse', price: 172500 },
      { type: 'Ocean Suite Sea Side', price: 150000 },
      { type: 'Ocean Superior Penthouse', price: 135000 },
      { type: 'Ocean Superior With Balcony', price: 112500 },
      { type: 'Ocean Superior Without Balcony', price: 105000 },
    ],
  },
  {
    name: 'SUNNY VILLA',
    category: 'Villa',
    color: 'from-yellow-500/20 to-amber-500/10',
    rooms: [
      { type: 'Villa Superior (2 Pax)', price: 135000 },
      { type: 'Villa (2 Pax)', price: 110000 },
      { type: 'Villa (3 Pax)', price: 150000 },
      { type: 'Villa (5 Pax)', price: 240000 },
    ],
  },
]

const HIGHLIGHTS = [
  '20km White Sand Beach',
  'Crystal Clear Water',
  'Lover Island Day Trip',
  'Fresh Seafood Restaurants',
  'Water Sports & Snorkeling',
  'Beach Sunrise & Sunset',
  'Fishing Village Culture',
  'Peaceful & Uncrowded',
]

const GALLERY = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520454974749-611f37e6bcdf?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80&auto=format&fit=crop',
]

export default async function DestinationPage({ params }: Props) {
  if (params.slug !== 'ngwesaung') notFound()

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="relative h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85&auto=format&fit=crop"
          alt="Ngwe Saung Beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-transparent to-stone-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/50 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            Ayeyarwady Region, Myanmar
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-shadow-lg">
            Ngwe Saung
          </h1>
          <p className="text-white/70 text-xl max-w-lg mb-8 font-light">
            Myanmar&apos;s most pristine beach — 20km of white sand on the Bay of Bengal
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Waves, label: '20km Beach' },
              { icon: Sun, label: 'Year-Round Sun' },
              { icon: Wind, label: 'Sea Breeze' },
              { icon: Star, label: '5 Resorts' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium">
                <badge.icon className="w-4 h-4 text-amber-400" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* About + Plan sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2">
            <div className="section-label mb-6">About the Destination</div>
            <h2 className="text-4xl font-bold mb-6">Where the Bay Meets<br /><span className="gradient-text">Untouched Paradise</span></h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              Ngwe Saung (Silver Beach) is one of Myanmar&apos;s most beautiful and least-developed beaches. 
              Located about 6 hours from Yangon by road, or accessible by flight to Pathein, the beach stretches 
              for 20 uninterrupted kilometers with almost no development — just sand, sea, and sky.
            </p>
            <p className="text-white/60 leading-relaxed mb-10">
              Unlike the busier Ngapali Beach, Ngwe Saung retains a quiet, authentic character. 
              Local fishing villages dot the coastline, seafood restaurants serve the morning catch, 
              and resorts range from budget-friendly villas to luxury seafront bungalows.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {HIGHLIGHTS.map((h) => (
                <div key={h} className="flex items-center gap-3 glass-card rounded-xl p-3">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Plan Card */}
          <div>
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-stone-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Plan Your Visit</h3>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Enter your budget and get an AI-generated day-by-day itinerary with real hotel pricing.
              </p>
              <Link
                href="/planner?destination=Ngwe Saung"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 gradient-gold text-stone-900 font-bold rounded-xl transition-all hover:opacity-90"
              >
                Generate Itinerary
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-4 p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl">
                <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">Best Time to Visit</div>
                <div className="text-white/70 text-sm">November — April (Dry Season)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-24">
          <div className="section-label mb-6">Gallery</div>
          <h2 className="text-4xl font-bold mb-10">See the Beauty<br /><span className="gradient-text">Up Close</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden card-hover ${i === 0 ? 'col-span-2 h-72' : 'h-48'}`}>
                <img src={src} alt={`Ngwe Saung ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Hotels */}
        <div>
          <div className="section-label mb-6">Where to Stay</div>
          <h2 className="text-4xl font-bold mb-4">
            Verified Hotels &<br />
            <span className="gradient-text">Real Pricing</span>
          </h2>
          <p className="text-white/50 text-lg mb-12 max-w-xl">
            All prices are in Myanmar Kyat (MMK) per night. Use the AI Planner to match rooms to your budget automatically.
          </p>

          <div className="space-y-6">
            {HOTELS.map((hotel) => (
              <div key={hotel.name} className={`glass-card rounded-2xl overflow-hidden`}>
                <div className={`bg-gradient-to-r ${hotel.color} p-6 border-b border-white/5`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{hotel.name}</h3>
                      <span className="text-amber-400 text-sm font-medium">{hotel.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/40 mb-1">Starting from</div>
                      <div className="text-lg font-bold gradient-text">
                        {Math.min(...hotel.rooms.map(r => r.price)).toLocaleString()} MMK
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hotel.rooms.map((room) => (
                      <div key={room.type} className="flex items-center justify-between py-2.5 px-4 bg-white/3 rounded-xl border border-white/5">
                        <span className="text-white/70 text-sm">{room.type}</span>
                        <span className="text-amber-400 font-bold text-sm ml-4 whitespace-nowrap">
                          {room.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/planner?destination=Ngwe Saung" className="btn-primary text-lg px-10 py-4 rounded-2xl font-bold">
              <ArrowRight className="w-5 h-5" />
              Find Hotels Within My Budget
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
