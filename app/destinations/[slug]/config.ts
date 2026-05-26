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
  /** Google Maps place query for the static map thumbnail & directions link */
  mapQuery: string
  /** Full Google Maps directions URL (leave destination blank so it routes from user location) */
  mapsDirectionsUrl: string
  /** Human-readable location label shown in the map card */
  locationLabel: string
}

/* ─── Static config per destination ────────────────────────────── */
export const DESTINATION_CONFIG: Record<string, DestinationConfig> = {
  ngwesaung: {
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/2/29/Ngwe_Saung_beach_05.jpg',
    galleryImages: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Ngwe_Saung_beach_05.jpg',
        alt: 'White sand beach',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Ngwe_Saung_Beach_from_Lovers_island.jpg',
        alt: 'Clear ocean waters',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Lover_island.jpg',
        alt: 'Beach at sunset',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Ngwe_Saung_Beach.jpg',
        alt: 'Beachside activities',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Ngwe-Saung_Banner.jpg',
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
    mapQuery: 'Ngwe+Saung+Beach,Myanmar',
    mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ngwe+Saung+Beach,Myanmar',
    locationLabel: 'Ngwe Saung, Ayeyarwady Region',
  },
  'chaung-thar': {
    heroImage:
      'https://upload.wikimedia.org/wikipedia/commons/e/eb/20170304_084223-01_Chaungtha_beach.jpg',
    galleryImages: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/20170304_084223-01_Chaungtha_beach.jpg',
        alt: 'Chaung Thar beach',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/ChaungThaBeach.JPG',
        alt: 'Golden sunset over the bay',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Chaungthabeach.jpg',
        alt: 'Sandy shoreline',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Myanmar_Traditional_Boat_in_front_of_a_Hotel_in_Chaung_Tha_Beach.JPG',
        alt: 'Tropical beach scenery',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Pagoda_at_Chaung_Tha_Beach.JPG',
        alt: 'Beach at dusk',
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
    mapQuery: 'Chaung+Thar+Beach,Myanmar',
    mapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Chaung+Thar+Beach,Myanmar',
    locationLabel: 'Chaung Thar, Ayeyarwady Region',
  },
}
