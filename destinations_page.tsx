import { getDestinations } from '@/lib/supabase/queries'
import DestinationsClient from './DestinationsClient'

// Revalidate every 30 seconds — new rows added in Supabase Table Editor appear within 30s
export const revalidate = 30

export default async function DestinationsPage() {
  const destinations = await getDestinations()
  return <DestinationsClient destinations={destinations} />
}
