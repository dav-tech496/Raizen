import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DestinationDetailClient from './DestinationDetailClient'
import { DESTINATION_CONFIG, type Hotel } from './config'

/* ─── Static params ─────────────────────────────────────────────── */
export async function generateStaticParams() {
  return [{ slug: 'ngwesaung' }, { slug: 'chaung-thar' }]
}

/* ─── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    ngwesaung: 'Ngwe Saung Beach — Raizen Myanmar',
    'chaung-thar': 'Chaung Thar Beach — Raizen Myanmar',
  }
  return { title: titles[params.slug] ?? 'Destination — Raizen Myanmar' }
}

export const revalidate = 3600

/* ─── Page ───────────────────────────────────────────────────────── */
export default async function DestinationPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const config = DESTINATION_CONFIG[slug]
  if (!config) notFound()

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!destination) notFound()

  const { data: hotelsRaw } = await supabase
    .from('hotels')
    .select(
      'id, name, price_category, price_per_night_mmk, hotel_rooms(room_type, price_per_night, capacity)'
    )
    .eq('destination_id', destination.id)
    .order('name')

  const hotels: Hotel[] = (hotelsRaw ?? []) as Hotel[]

  return (
    <DestinationDetailClient
      destination={destination}
      hotels={hotels}
      config={config}
    />
  )
}
