import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import DestinationsClient from './DestinationsClient'

export const metadata: Metadata = {
  title: 'Destinations — Raizen Myanmar',
  description: 'Explore top beach destinations in Myanmar with verified MMK hotel prices.',
}

export const revalidate = 3600

const AVAILABLE_SLUGS = ['ngwesaung', 'chaung-thar']

export default async function DestinationsPage() {
  const supabase = await createClient()

  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name, slug, region, highlights, description, image_url, created_at')
    .in('slug', AVAILABLE_SLUGS)

  const sorted = (destinations ?? []).sort((a, b) =>
    a.slug === 'ngwesaung' ? -1 : b.slug === 'ngwesaung' ? 1 : 0
  )

  return <DestinationsClient destinations={sorted} />
}
