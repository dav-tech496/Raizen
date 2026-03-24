import { getDestinations } from '@/lib/supabase/queries'
import HomeClient from './HomeClient'

export const revalidate = 3600

export default async function HomePage() {
  const destinations = await getDestinations()
  const featured = destinations.find((d) => d.slug === 'ngwesaung') ?? destinations[0] ?? null
  return <HomeClient featured={featured} />
}
