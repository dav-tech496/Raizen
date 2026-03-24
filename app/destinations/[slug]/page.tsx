import { notFound } from 'next/navigation'
import { getDestinationBySlug, getHotelsByDestination } from '@/lib/supabase/queries'
import DestinationDetailClient from './DestinationDetailClient'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const dest = await getDestinationBySlug(params.slug)
  if (!dest) return { title: 'Destination Not Found' }
  return {
    title: `${dest.name} — Raizen Myanmar`,
    description: dest.description ?? `Explore ${dest.name} with Raizen.`,
  }
}

export default async function DestinationDetailPage({ params }: Props) {
  const destination = await getDestinationBySlug(params.slug)
  if (!destination) notFound()
  const hotels = await getHotelsByDestination(destination.id)
  return <DestinationDetailClient destination={destination} hotels={hotels} />
}
