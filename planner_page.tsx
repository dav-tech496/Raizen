import {
  getDestinations,
  getHotelsByDestination,
  getTransportOptions,
  getItineraryTemplates,
} from '@/lib/supabase/queries'
import PlannerClient from './PlannerClient'
import EmptyState from '@/components/EmptyState'

// Revalidate every 60 seconds — price changes in Supabase appear within 1 minute
export const revalidate = 60

export default async function PlannerPage() {
  const destinations = await getDestinations()

  if (destinations.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-[18px] pt-16">
        <EmptyState
          title="No destinations yet"
          description="The planner needs at least one destination. Add one in the Supabase table editor and it will appear here automatically."
          ctaLabel="Go Home"
          ctaHref="/"
        />
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
