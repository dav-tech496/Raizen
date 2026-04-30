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
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop',
    nights: '2–7 nights',
    rating: '4.8',
  },
  'chaung-thar': {
    heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop',
    nights: '2–5 nights',
    rating: '4.6',
  },
};

const COMING_SOON = [
  { name: 'Bagan', region: 'Mandalay Region', tagline: 'Ancient temples & hot air balloons' },
  { name: 'Inle Lake', region: 'Shan State', tagline: 'Floating villages & serene waters' },
];

export default async function DestinationsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
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
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest mb-2">
            Destinations
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Where do you want to go?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Handpicked destinations across Myanmar — more coming soon.
          </p>
        </div>

        {/* Available */}
        <div className="space-y-8 mb-12">
          {available.map((dest) => {
            const meta = DESTINATION_META[dest.slug];
            return (
              <div key={dest.id} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors shadow-sm hover:shadow-md">
                <div className="relative h-56 md:h-72 w-full">
                  <Image
                    src={meta.heroImage}
                    alt={dest.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    Available Now
                  </span>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs opacity-75 mb-0.5">{dest.region}</p>
                    <h2 className="text-2xl font-bold">{dest.name}</h2>
                  </div>
                </div>
                <div className="p-5">
                  {dest.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">{dest.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>⭐ {meta.rating}</span>
                    <span>🌙 {meta.nights}</span>
                    <span>🏖️ Beach</span>
                  </div>
                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {dest.highlights.slice(0, 6).map((tag: string) => (
                        <span key={tag} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Link href={`/destinations/${dest.slug}`} prefetch className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm">
                      Explore
                    </Link>
                    <Link href="/planner" prefetch className="flex-1 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 text-center font-semibold py-2.5 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm">
                      Plan Trip
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Coming Soon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMING_SOON.map((d) => (
              <div key={d.name} className="border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-5 opacity-60">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{d.region}</p>
                <h4 className="font-bold text-gray-700 dark:text-gray-300 text-lg">{d.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{d.tagline}</p>
                <span className="inline-block mt-3 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2.5 py-0.5 rounded-full">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
