import { getDestinations } from '@/lib/supabase/queries'
import HomeClient from './HomeClient'

// Revalidate every 60 seconds — so edits in Supabase show up on the live site within 1 minute
export const revalidate = 60

export default async function HomePage() {
  const destinations = await getDestinations()
  const featured = destinations.find((d) => d.slug === 'ngwesaung') ?? destinations[0] ?? null
  return <HomeClient featured={featured} />
}
