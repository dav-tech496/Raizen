import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PlannerClient from './PlannerClient'
import type { Hotel, HotelRoom, Transport, ItineraryTemplate, ItineraryActivity } from '@/types'

export const metadata: Metadata = {
  title: 'Plan Your Trip — Raizen Myanmar',
  description: 'Plan a complete Myanmar trip with matched hotels and real MMK bus ticket prices.',
}

export const revalidate = 300

const AVAILABLE_SLUGS = ['ngwesaung', 'chaung-thar']

export default async function PlannerPage() {
  const supabase = await createClient()

  // Fetch destinations
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name, slug, region, description, highlights, image_url, created_at')
    .in('slug', AVAILABLE_SLUGS)

  const sortedDests = (destinations ?? []).sort((a, b) =>
    a.slug === 'ngwesaung' ? -1 : b.slug === 'ngwesaung' ? 1 : 0
  )

  const destIds = sortedDests.map((d) => d.id)

  // Fetch all hotels for these destinations
  const { data: hotelsRaw } = await supabase
    .from('hotels')
    .select('*')
    .in('destination_id', destIds)
    .order('price_per_night_mmk', { ascending: true, nullsFirst: false })

  const hotelIds = (hotelsRaw ?? []).map((h) => h.id)

  // Fetch all rooms
  const { data: roomsRaw } = await supabase
    .from('hotel_rooms')
    .select('*')
    .in('hotel_id', hotelIds)

  const roomsByHotel: Record<string, HotelRoom[]> = {}
  for (const room of roomsRaw ?? []) {
    if (!roomsByHotel[room.hotel_id]) roomsByHotel[room.hotel_id] = []
    roomsByHotel[room.hotel_id].push(room as HotelRoom)
  }

  const hotels: Hotel[] = (hotelsRaw ?? []).map((h) => ({
    ...h,
    rooms: roomsByHotel[h.id] ?? [],
  })) as Hotel[]

  // Fetch all transport options
  const { data: transportsRaw } = await supabase
    .from('transport')
    .select('*')
    .in('destination_id', destIds)

  const transports: Transport[] = (transportsRaw ?? []) as Transport[]

  // Fetch all itinerary templates
  const { data: templatesRaw } = await supabase
    .from('itinerary_templates')
    .select('*')
    .in('destination_id', destIds)
    .order('day_number', { ascending: true })

  const templates: ItineraryTemplate[] = (templatesRaw ?? []).map((row) => ({
    ...row,
    activities: (row.activities as ItineraryActivity[]) ?? [],
  })) as ItineraryTemplate[]

  return (
    <PlannerClient
      destinations={sortedDests}
      hotels={hotels}
      transports={transports}
      templates={templates}
    />
  )
}
