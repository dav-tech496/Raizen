import { notFound } from 'next/navigation'
import { getDestinationBySlug, getHotelsByDestination } from '@/lib/supabase/queries'
import DestinationDetailClient from './DestinationDetailClient'

// Next.js 14+ requires params to be awaited in async server components
interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const dest = await getDestinationBySlug(slug)
  if (!dest) return { title: 'Destination Not Found' }
  return {
    title: `${dest.name} — Raizen Myanmar`,
    description: dest.description ?? `Explore ${dest.name} with Raizen.`,
  }
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) notFound()
  const hotels = await getHotelsByDestination(destination.id)
  return <DestinationDetailClient destination={destination} hotels={hotels} />
}
