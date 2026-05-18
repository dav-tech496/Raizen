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

export interface DestinationConfig {
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

/* ─── Static config per destination ────────────────────────────── */
export const DESTINATION_CONFIG: Record<string, DestinationConfig> = {
  ngwesaung: {
    // Hero — tropical white sand beach, wide angle
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85&auto=format&fit=crop',
    galleryImages: [
      {
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop',
        alt: 'Ngwe Saung white sand beach',
      },
      {
        src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80&auto=format&fit=crop',
        alt: 'Crystal clear waters',
      },
      {
        src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop',
        alt: 'Beach sunset',
      },
      {
        src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop',
        alt: 'Water sports',
      },
      {
        src: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&q=80&auto=format&fit=crop',
        alt: 'Fishing village',
      },
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
    // Hero — lively local beach with warm golden tones
    heroImage:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85&auto=format&fit=crop',
    galleryImages: [
      {
        src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80&auto=format&fit=crop',
        alt: 'Chaung Thar beach',
      },
      {
        src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80&auto=format&fit=crop',
        alt: 'Sunset over the bay',
      },
      {
        src: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80&auto=format&fit=crop',
        alt: 'Sandy shore',
      },
      {
        src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop',
        alt: 'Beachside seafood',
      },
      {
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop',
        alt: 'Local beach life',
      },
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
