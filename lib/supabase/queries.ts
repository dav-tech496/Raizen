// lib/supabase/queries.ts
// All Supabase data-fetching functions — server-side only.
// Each function returns typed data or throws a descriptive error.

import { createClient } from './server';
import type {
  Destination,
  Hotel,
  HotelRoom,
  Transport,
  ItineraryTemplate,
  ItineraryActivity,
  Profile,
} from '@/types'

// ─── Destinations ────────────────────────────────────────────────

export async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw new Error(`getDestinations: ${error.message}`)
  return data ?? []
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(`getDestinationBySlug: ${error.message}`)
  return data ?? null
}

// ─── Hotels ──────────────────────────────────────────────────────

export async function getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  const supabase = await createClient()

  const { data: hotels, error: hotelError } = await supabase
    .from('hotels')
    .select('*')
    .eq('destination_id', destinationId)
    .not('price_category', 'is', null)
    .order('created_at', { ascending: true })

  if (hotelError) throw new Error(`getHotelsByDestination: ${hotelError.message}`)
  if (!hotels || hotels.length === 0) return []

  const hotelIds = hotels.map((h) => h.id)

  const { data: rooms, error: roomError } = await supabase
    .from('hotel_rooms')
    .select('*')
    .in('hotel_id', hotelIds)
    .order('price_per_night', { ascending: true })

  if (roomError) throw new Error(`getHotelRooms: ${roomError.message}`)

  const roomsByHotel = (rooms ?? []).reduce<Record<string, HotelRoom[]>>((acc, room) => {
    if (!acc[room.hotel_id]) acc[room.hotel_id] = []
    acc[room.hotel_id].push(room)
    return acc
  }, {})

  return hotels.map((h) => ({
    ...h,
    rooms: roomsByHotel[h.id] ?? [],
  })) as Hotel[]
}

// ─── Transport ───────────────────────────────────────────────────

export async function getTransportOptions(destinationId: string): Promise<Transport[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('transport')
    .select('*')
    .eq('destination_id', destinationId)

  if (error) throw new Error(`getTransportOptions: ${error.message}`)
  return data ?? []
}

// ─── Itinerary Templates ─────────────────────────────────────────

export async function getItineraryTemplates(destinationId: string): Promise<ItineraryTemplate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('itinerary_templates')
    .select('*')
    .eq('destination_id', destinationId)
    .order('day_number', { ascending: true })

  if (error) throw new Error(`getItineraryTemplates: ${error.message}`)

  return (data ?? []).map((row) => ({
    ...row,
    activities: (row.activities as ItineraryActivity[]) ?? [],
  }))
}

// ─── Profile ─────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(`getProfile: ${error.message}`)
  return data ?? null
}

export async function upsertProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })

  if (error) throw new Error(`upsertProfile: ${error.message}`)
}

// ─── Saved Itineraries ───────────────────────────────────────────

export async function saveItinerary(
  userId: string,
  payload: {
    destination: string
    days: number
    budget: number
    title: string
    ai_response: object
  }
): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('itineraries')
    .insert({ user_id: userId, ...payload })
    .select('id')
    .single()

  if (error) throw new Error(`saveItinerary: ${error.message}`)
  return data.id
}

export async function getSavedItineraries(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`getSavedItineraries: ${error.message}`)
  return data ?? []
}
