import { getDestinations } from '@/lib/supabase/queries'
import HomeClient from './HomeClient'

// Revalidate every 30 seconds — edits in Supabase Table Editor appear on the live site quickly
export const revalidate = 30

export default async function HomePage() {
  const destinations = await getDestinations()
  const featured = destinations.find((d) => d.slug === 'ngwesaung') ?? destinations[0] ?? null
  return <HomeClient featured={featured} />
}
