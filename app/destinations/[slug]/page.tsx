import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Tell Next.js which slugs exist at build time
export async function generateStaticParams() {
  return [{ slug: 'ngwesaung' }, { slug: 'chaung-thar' }];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    ngwesaung: 'Ngwe Saung Beach — Raizen Myanmar',
    'chaung-thar': 'Chaung Thar Beach — Raizen Myanmar',
  };
  return { title: titles[params.slug] ?? 'Destination — Raizen Myanmar' };
}

export const revalidate = 3600;

// ─── Per-destination static config ───────────────────────────────────────────
const DESTINATION_CONFIG: Record<
  string,
  {
    heroImage: string;
    galleryImages: { src: string; alt: string }[];
    tagline: string;
    bodyText: string[];
    badgeTags: string[];
    bestTime: string;
    planLabel: string;
  }
> = {
  // ── Ngwe Saung ──────────────────────────────────────────────────────────────
  ngwesaung: {
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90&auto=format&fit=crop',
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop', alt: 'White Sand Coastline' },
      { src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80&auto=format&fit=crop', alt: 'Crystal Clear Waters' },
      { src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80&auto=format&fit=crop', alt: 'Resort Pool' },
      { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop', alt: 'Beach Sunset' },
      { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop', alt: 'Water Sports' },
    ],
    tagline: 'Where the Bay Meets Untouched Paradise',
    bodyText: [
      "Ngwe Saung (Silver Beach) is one of Myanmar's most beautiful and least-developed beaches. Located about 6 hours from Yangon, the beach stretches for 20 uninterrupted kilometers — just sand, sea, and sky.",
      "Unlike the busier Ngapali Beach, Ngwe Saung retains a quiet, authentic character. Local fishing villages, fresh seafood restaurants, and resorts from budget guesthouses to luxury bungalows all line the shore.",
    ],
    badgeTags: ['20km White Sand', "Lover's Island", 'Luxury Resorts', 'Fresh Seafood', 'Water Sports', 'Peaceful'],
    bestTime: 'November — April (Dry Season)',
    planLabel: 'Plan My Ngwe Saung Trip',
  },
  // ── Chaung Thar ─────────────────────────────────────────────────────────────
  'chaung-thar': {
    heroImage:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=90&auto=format&fit=crop',
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80&auto=format&fit=crop', alt: 'Chaung Thar Beach' },
      { src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80&auto=format&fit=crop', alt: 'Clear Beach Waters' },
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop', alt: 'Sandy Beach' },
      { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop', alt: 'Sunset at Chaung Thar' },
      { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop', alt: 'Seafood by the Beach' },
    ],
    tagline: 'A Beloved Local Beach Escape',
    bodyText: [
      "Chaung Thar is one of Myanmar's most popular beach destinations, cherished by local travellers for its lively atmosphere, affordable resorts, and stunning sunsets over the Bay of Bengal.",
      "Unlike quieter Ngwe Saung, Chaung Thar buzzes with energy — seafood stalls right on the sand, bungalow resorts for every budget, and a warm local atmosphere that makes every visit memorable.",
    ],
    badgeTags: ['Long Sandy Beach', 'Seafood Restaurants', 'Budget Friendly', 'Bungalow Resorts', 'Stunning Sunsets', 'Local Atmosphere'],
    bestTime: 'November — April (Dry Season)',
    planLabel: 'Plan My Chaung Thar Trip',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface HotelRoom {
  room_type: string;
  price_per_night: number;
  capacity: number | null;
}
interface Hotel {
  id: string;
  name: string;
  price_category: string | null;
  price_per_night_mmk: number | null;
  hotel_rooms: HotelRoom[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const config = DESTINATION_CONFIG[slug];
  if (!config) notFound();

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!destination) notFound();

  const { data: hotelsRaw } = await supabase
    .from('hotels')
    .select('id, name, price_category, price_per_night_mmk, hotel_rooms(room_type, price_per_night, capacity)')
    .eq('destination_id', destination.id)
    .order('name');

  const hotels: Hotel[] = (hotelsRaw ?? []) as Hotel[];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* ── Hero ── */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <Image
          src={config.heroImage}
          alt={destination.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <p className="text-sm font-medium opacity-80 mb-1">{destination.region}</p>
          <h1 className="text-3xl md:text-5xl font-bold">{destination.name}</h1>
          <div className="flex flex-wrap gap-2 mt-3 text-sm">
            {config.badgeTags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* ── Description ── */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{config.tagline}</h2>
          {config.bodyText.map((para, i) => (
            <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{para}</p>
          ))}
          <div className="flex flex-wrap gap-2 mt-5">
            {config.badgeTags.map((tag) => (
              <span key={tag} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm px-3 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">Best time to visit</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-0.5">{config.bestTime}</p>
            </div>
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">See the Beauty Up Close</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {config.galleryImages.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                  <p className="text-white text-xs font-medium">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Hotels ── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Verified Hotels &amp; MMK Pricing
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">All prices in Myanmar Kyat per night.</p>
          <div className="space-y-4">
            {hotels.map((hotel) => {
              const rooms = hotel.hotel_rooms ?? [];
              const minPrice = rooms.length > 0
                ? Math.min(...rooms.map((r) => r.price_per_night))
                : hotel.price_per_night_mmk;
              return (
                <div key={hotel.id} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{hotel.name}</h3>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {hotel.price_category && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full capitalize">
                          {hotel.price_category}
                        </span>
                      )}
                      {minPrice != null && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          From{' '}
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {minPrice.toLocaleString()} MMK
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  {rooms.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {rooms.map((room) => (
                        <div key={room.room_type} className="flex items-center justify-between text-sm py-0.5">
                          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block shrink-0" />
                            {room.room_type}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white ml-3 shrink-0">
                            {room.price_per_night.toLocaleString()} MMK
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/planner" prefetch className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-6 rounded-xl transition-colors">
            {config.planLabel}
          </Link>
          <Link href="/destinations" prefetch className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-center font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            ← Back
          </Link>
        </div>
      </div>
    </main>
  );
}
