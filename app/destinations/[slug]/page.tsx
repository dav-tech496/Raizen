import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return [{ slug: 'ngwesaung' }, { slug: 'chaung-thar' }];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const titles: Record<string, string> = {
    ngwesaung: 'Ngwe Saung Beach — Raizen Myanmar',
    'chaung-thar': 'Chaung Thar Beach — Raizen Myanmar',
  };
  return { title: titles[params.slug] ?? 'Destination — Raizen Myanmar' };
}

export const revalidate = 3600;

const DESTINATION_CONFIG: Record<string, {
  heroImage: string;
  galleryImages: { src: string; alt: string }[];
  tagline: string;
  bodyText: string[];
  badgeTags: string[];
  bestTime: string;
  planLabel: string;
}> = {
  ngwesaung: {
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90&auto=format&fit=crop',
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop', alt: 'White Sand Coastline' },
      { src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80&auto=format&fit=crop', alt: 'Crystal Clear Waters' },
      { src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80&auto=format&fit=crop', alt: 'Resort Pool' },
      { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop', alt: 'Beach Sunset' },
      { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop', alt: 'Water Sports' },
      { src: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&q=80&auto=format&fit=crop', alt: 'Fishing Village' },
    ],
    tagline: "Myanmar's Most Beautiful Beach",
    bodyText: [
      "Ngwe Saung (Silver Beach) stretches 20 uninterrupted kilometers along the Bay of Bengal — one of Myanmar's most pristine and least-developed coastlines.",
      "Local fishing villages, fresh seafood, and a range of resorts from budget guesthouses to luxury bungalows make it perfect for every type of traveller.",
    ],
    badgeTags: ['20km White Sand', "Lover's Island", 'Luxury Resorts', 'Fresh Seafood', 'Water Sports', 'Peaceful'],
    bestTime: 'November — April (Dry Season)',
    planLabel: 'Plan My Ngwe Saung Trip',
  },
  'chaung-thar': {
    heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=90&auto=format&fit=crop',
    galleryImages: [
      { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80&auto=format&fit=crop', alt: 'Chaung Thar Beach' },
      { src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80&auto=format&fit=crop', alt: 'Clear Beach Waters' },
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop', alt: 'Sandy Shore' },
      { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop', alt: 'Sunset at Chaung Thar' },
      { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop', alt: 'Beachside Seafood' },
      { src: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=600&q=80&auto=format&fit=crop', alt: 'Local Beach Life' },
    ],
    tagline: "Myanmar's Most Loved Local Beach",
    bodyText: [
      "Chaung Thar is Myanmar's most popular local beach destination — lively, affordable, and famous for some of the best sunsets on the Bay of Bengal.",
      "Seafood stalls right on the sand, bungalow resorts for every budget, and a warm local atmosphere that makes every visit feel like home.",
    ],
    badgeTags: ['Long Sandy Beach', 'Seafood Restaurants', 'Budget Friendly', 'Bungalow Resorts', 'Stunning Sunsets', 'Local Atmosphere'],
    bestTime: 'November — April (Dry Season)',
    planLabel: 'Plan My Chaung Thar Trip',
  },
};

interface HotelRoom { room_type: string; price_per_night: number; capacity: number | null; }
interface Hotel { id: string; name: string; price_category: string | null; price_per_night_mmk: number | null; hotel_rooms: HotelRoom[]; }

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
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: destination } = await supabase
    .from('destinations').select('*').eq('slug', slug).single();
  if (!destination) notFound();

  const { data: hotelsRaw } = await supabase
    .from('hotels')
    .select('id, name, price_category, price_per_night_mmk, hotel_rooms(room_type, price_per_night, capacity)')
    .eq('destination_id', destination.id)
    .order('name');

  const hotels: Hotel[] = (hotelsRaw ?? []) as Hotel[];

  return (
    <div className="min-h-screen bg-rose-50 dark:bg-gray-950 pb-28">

      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image src={config.heroImage} alt={destination.name} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        {/* Back button */}
        <Link
          href="/destinations"
          className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white rounded-full p-2.5 hover:bg-black/60 transition-colors"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-xs opacity-80 mb-0.5">{destination.region}</p>
          <h1 className="text-2xl font-bold">{destination.name}</h1>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {config.badgeTags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* About */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white text-base mb-2">{config.tagline}</h2>
          {config.bodyText.map((para, i) => (
            <p key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{para}</p>
          ))}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {config.badgeTags.map((tag) => (
              <span key={tag} className="text-[11px] bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span className="text-lg">☀️</span>
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Best time to visit</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">{config.bestTime}</p>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="font-bold text-gray-900 dark:text-white text-base mb-3">Gallery</h2>
          <div className="grid grid-cols-3 gap-2">
            {config.galleryImages.map((img) => (
              <div key={img.src} className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="33vw" />
              </div>
            ))}
          </div>
        </div>

        {/* Hotels */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-base">Hotels &amp; Pricing</h2>
            <span className="text-[11px] text-gray-400">MMK / night</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Verified prices in Myanmar Kyat.</p>
          <div className="space-y-3">
            {hotels.map((hotel) => {
              const rooms = hotel.hotel_rooms ?? [];
              const minPrice = rooms.length > 0
                ? Math.min(...rooms.map((r) => r.price_per_night))
                : hotel.price_per_night_mmk;
              return (
                <div key={hotel.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{hotel.name}</h3>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {hotel.price_category && (
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full capitalize">
                          {hotel.price_category}
                        </span>
                      )}
                      {minPrice != null && (
                        <p className="text-[11px] text-gray-400 whitespace-nowrap">
                          From <span className="font-bold text-red-600">{minPrice.toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  {rooms.length > 0 && (
                    <div className="space-y-1">
                      {rooms.map((room) => (
                        <div key={room.room_type} className="flex items-center justify-between text-xs py-0.5 border-t border-gray-50 dark:border-gray-800">
                          <span className="text-gray-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block shrink-0" />
                            {room.room_type}
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 ml-2 shrink-0">
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
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 pb-2">
          <Link
            href="/planner"
            prefetch
            className="w-full bg-red-600 hover:bg-red-700 text-white text-center font-bold py-3.5 rounded-2xl transition-colors text-sm shadow-sm"
          >
            {config.planLabel}
          </Link>
          <Link
            href="/destinations"
            prefetch
            className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-center font-semibold py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm"
          >
            ← Back to Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
