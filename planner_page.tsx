import {
  getDestinations,
  getHotelsByDestination,
  getTransportOptions,
  getItineraryTemplates,
} from '@/lib/supabase/queries'
import PlannerClient from './PlannerClient'

// Revalidate every 30 seconds — price changes in Supabase appear within 30s
export const revalidate = 30

export default async function PlannerPage() {
  const destinations = await getDestinations()

  if (destinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-pale flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-ink mb-2">No destinations yet</h2>
        <p className="text-sm text-ink2 font-light max-w-[260px]">
          Add a destination in the Supabase Table Editor and it will appear here automatically.
        </p>
      </div>
    )
  }

  const ngweSaung = destinations.find((d) => d.slug === 'ngwesaung') ?? destinations[0]

  const [hotels, transports, templates] = await Promise.all([
    getHotelsByDestination(ngweSaung.id),
    getTransportOptions(ngweSaung.id),
    getItineraryTemplates(ngweSaung.id),
  ])

  return (
    <PlannerClient
      destinations={destinations}
      hotels={hotels}
      transports={transports}
      templates={templates}
    />
  )
}
