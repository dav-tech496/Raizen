import { getDestinations } from '@/lib/supabase/queries'
import DestinationsClient from './DestinationsClient'

export const revalidate = 3600

export default async function DestinationsPage() {
  const destinations = await getDestinations()
  return <DestinationsClient destinations={destinations} />
}
