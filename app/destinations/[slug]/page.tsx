import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DestinationDetailClient from './DestinationDetailClient'

/* ─── Static params ─────────────────────────────────────────────── */
export async function generateStaticParams() {
  return [{ slug: 'ngwesaung' }, { slug: 'chaung-thar' }]
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    ngwesaung: 'Ngwe Saung Beach — Raizen Myanmar',
    'chaung-thar': 'Chaung Thar Beach — Raizen Myanmar',
  }
  return { title: titles[params.slug] ?? 'Destination — Raizen Myanmar' }
}

export const revalidate = 3600

/* ─── Static config ─────────────────────────────────────────────── */
export const DESTINATION_CONFIG: Record<
  string,
  {
    heroImage: string
    galleryImages: { src: string; alt: string }[]
    tagline: string
    bodyText: string[]
    badgeTags: string[]
    bestTime: string
    planLabel: string
    rating: string
    nights: string
    distance: string
  }
> = {
  ngwesaung: {
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Ngwe_Saung_beach.jpg/1280px-Ngwe_Saung_beach.jpg',
    galleryImages: [
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Ngwe_Saung_beach.jpg/800px-Ngwe_Saung_beach.jpg', alt: 'Ngwe Saung white sand beach' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ngwe_Saung_Beach_Myanmar.jpg/800px-Ngwe_Saung_Beach_Myanmar.jpg', alt: 'Ngwe Saung coastline' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ngwesaung_beach_myanmar.jpg/800px-Ngwesaung_beach_myanmar.jpg', alt: 'Ngwe Saung palm trees' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ngwe_Saung_Beach_2.jpg/800px-Ngwe_Saung_Beach_2.jpg', alt: 'Ngwe Saung waves' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ngwe_Saung_Twin_Pagoda.jpg/800px-Ngwe_Saung_Twin_Pagoda.jpg', alt: 'Ngwe Saung twin pagoda' },
    ],
    tagline: "Myanmar's Most Beautiful Beach",
    bodyText: [
      "Ngwe Saung (Silver Beach) stretches 20 uninterrupted kilometers along the Bay of Bengal — one of Myanmar's most pristine and least-developed coastlines.",
      'Local fishing villages, fresh seafood, and a range of resorts from budget guesthouses to luxury bungalows make it perfect for every type of traveller.',
    ],
    badgeTags: ['20km White Sand', "Lover's Island", 'Luxury Resorts', 'Fresh Seafood', 'Water Sports', 'Peaceful'],
    bestTime: 'November — April (Dry Season)',
    planLabel: 'Plan My Ngwe Saung Trip',
    rating: '4.8',
    nights: '2–7 nights',
    distance: '5 hrs from Yangon',
  },
  'chaung-thar': {
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/20170304_084223-01_Chaungtha_beach.jpg/1280px-20170304_084223-01_Chaungtha_beach.jpg',
    galleryImages: [
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/20170304_084223-01_Chaungtha_beach.jpg/800px-20170304_084223-01_Chaungtha_beach.jpg', alt: 'Chaung Thar beach' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Chaungtha_beach_2017.jpg/800px-Chaungtha_beach_2017.jpg', alt: 'Chaung Thar shoreline' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Chaungtha_Beach_Myanmar.jpg/800px-Chaungtha_Beach_Myanmar.jpg', alt: 'Chaung Thar sunset' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Chaungtha_beach_boats.jpg/800px-Chaungtha_beach_boats.jpg', alt: 'Chaung Thar fishing boats' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chaungtha_local_beach.jpg/800px-Chaungtha_local_beach.jpg', alt: 'Chaung Thar local life' },
    ],
    tagline: "Myanmar's Most Loved Local Beach",
    bodyText: [
      "Chaung Thar is Myanmar's most popular local beach destination — lively, affordable, and famous for some of the best sunsets on the Bay of Bengal.",
      'Seafood stalls right on the sand, bungalow resorts for every budget, and a warm local atmosphere that makes every visit feel like home.',
    ],
    badgeTags: ['Long Sandy Beach', 'Seafood Restaurants', 'Budget Friendly', 'Bungalow Resorts', 'Stunning Sunsets', 'Local Atmosphere'],
    bestTime: 'November — April (Dry Season)',
    planLabel: 'Plan My Chaung Thar Trip',
    rating: '4.6',
    nights: '2–5 nights',
    distance: '4 hrs from Yangon',
  },
}

/* ─── Types ─────────────────────────────────────────────────────── */
export interface HotelRoom {
  room_type: string
  price_per_night: number
  capacity: number | null
}

export interface Hotel {
  id: string
  name: string
  price_category: string | null
  price_per_night_mmk: number | null
  hotel_rooms: HotelRoom[]
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default async function DestinationPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const config = DESTINATION_CONFIG[slug]
  if (!config) notFound()

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!destination) notFound()

  const { data: hotelsRaw } = await supabase
    .from('hotels')
    .select('id, name, price_category, price_per_night_mmk, hotel_rooms(room_type, price_per_night, capacity)')
    .eq('destination_id', destination.id)
    .order('name')

  const hotels: Hotel[] = (hotelsRaw ?? []) as Hotel[]

  return (
    <DestinationDetailClient
      destination={destination}
      hotels={hotels}
      config={config}
    />
  )
}
