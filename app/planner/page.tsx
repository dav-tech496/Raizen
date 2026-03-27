import {
  getDestinations,
  getHotelsByDestination,
  getTransportOptions,
  getItineraryTemplates,
} from '@/lib/supabase/queries'
import PlannerClient from './PlannerClient'

// Revalidate every 60 seconds — price changes in Supabase appear within 1 minute
export const revalidate = 60

export default async function PlannerPage() {
  const destinations = await getDestinations()
  const ngweSaung = destinations.find((d) => d.slug === 'ngwesaung') ?? destinations[0]

  if (!ngweSaung) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-ink2 text-sm">No destinations available yet.</p>
      </div>
    )
  }

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
