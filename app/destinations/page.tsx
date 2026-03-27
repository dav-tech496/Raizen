import { getDestinations } from '@/lib/supabase/queries'
import DestinationsClient from './DestinationsClient'

// Revalidate every 60 seconds — edits in Supabase reflect on live site within 1 minute
export const revalidate = 60

export default async function DestinationsPage() {
  const destinations = await getDestinations()
  return <DestinationsClient destinations={destinations} />
}
