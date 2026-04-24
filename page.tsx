// app/page.tsx — Server Component
import { getFeaturedDestinations, getFeaturedItineraries } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const [destinations, itineraries] = await Promise.all([
    getFeaturedDestinations(),
    getFeaturedItineraries(),
  ]);

  return (
    <main className="container mx-auto px-4 py-16 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Discover Raizen Tourism
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Handcrafted travel experiences across stunning destinations.
        </p>
      </section>

      {/* Featured Destinations */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Featured Destinations</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {dest.image_url && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={dest.image_url}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{dest.name}</h3>
                {dest.country && (
                  <p className="text-sm text-gray-500">{dest.country}</p>
                )}
                {dest.price_from && (
                  <p className="mt-1 font-medium text-primary">
                    From ${dest.price_from.toLocaleString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Itineraries */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Popular Itineraries</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itin) => (
            <Link
              key={itin.id}
              href={`/itineraries/${itin.id}`}
              className="group rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {itin.image_url && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={itin.image_url}
                    alt={itin.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{itin.title}</h3>
                {itin.duration_days && (
                  <p className="text-sm text-gray-500">
                    {itin.duration_days} days
                  </p>
                )}
                {itin.price && (
                  <p className="mt-1 font-medium text-primary">
                    From ${itin.price.toLocaleString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
