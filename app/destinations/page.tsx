import Image from 'next/image';
import Link from 'next/link';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destinations — Raizen Myanmar',
  description: 'Explore top beach destinations in Myanmar with verified MMK hotel prices.',
};

export const revalidate = 3600;

const AVAILABLE_SLUGS = ['ngwesaung', 'chaung-thar'];

const DESTINATION_META: Record<string, { heroImage: string; nights: string; rating: string }> = {
  ngwesaung: {
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop',
    nights: '2–7 nights',
    rating: '4.8',
  },
  'chaung-thar': {
    heroImage:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop',
    nights: '2–5 nights',
    rating: '4.6',
  },
};

export default async function DestinationsPage() {
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

  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name, slug, region, highlights, description')
    .in('slug', AVAILABLE_SLUGS);

  const available = (destinations ?? []).sort((a, b) => {
    if (a.slug === 'ngwesaung') return -1;
    if (b.slug === 'ngwesaung') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* ── Page header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 pt-6 pb-5">
        <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Destinations</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Where do you want to go?</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Handpicked destinations — more coming soon.
        </p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {available.map((dest) => {
          const meta = DESTINATION_META[dest.slug];
          return (
            <div
              key={dest.id}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
            >
              {/* Hero image */}
              <div className="relative h-48 w-full">
                <Image
                  src={meta.heroImage}
                  alt={dest.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Available badge */}
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  Available Now
                </span>
                {/* Destination label */}
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-[11px] opacity-80 mb-0.5">{dest.region}</p>
                  <h2 className="text-xl font-bold leading-tight">{dest.name}</h2>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                {/* Stats */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">⭐ <span className="font-semibold text-gray-700 dark:text-gray-200">{meta.rating}</span></span>
                  <span>🌙 {meta.nights}</span>
                  <span>🏖️ Beach</span>
                </div>

                {/* Description */}
                {dest.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {dest.description}
                  </p>
                )}

                {/* Highlight tags */}
                {dest.highlights && dest.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {dest.highlights.slice(0, 5).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[11px] bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/destinations/${dest.slug}`}
                    prefetch
                    className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-center font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Explore
                  </Link>
                  <Link
                    href="/planner"
                    prefetch
                    className="flex-1 border border-red-600 text-red-600 dark:text-red-400 dark:border-red-500 text-center font-semibold py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                  >
                    Plan Trip
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
