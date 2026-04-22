// lib/supabase/queries.ts
// All Supabase data-fetching functions — server-side only.
// Selects only necessary columns to minimise payload size.

import { createClient } from './server'
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

/** Fetch all destinations — only the columns the UI actually uses */
export async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('id, name, slug, description, image_url, region, highlights, created_at')
    .order('created_at', { ascending: true })

  if (error) throw new Error(`getDestinations: ${error.message}`)
  return (data ?? []) as Destination[]
}

/** Fetch a single destination by slug */
export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('id, name, slug, description, image_url, region, highlights, created_at')
    .eq('slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(`getDestinationBySlug: ${error.message}`)
  return (data ?? null) as Destination | null
}

/**
 * Lightweight fetch for the planner destination selector.
 * Only id + name + slug needed — saves ~60% payload vs SELECT *.
 */
export async function getDestinationsSummary(): Promise<Pick<Destination, 'id' | 'name' | 'slug'>[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('id, name, slug')
    .order('created_at', { ascending: true })

  if (error) throw new Error(`getDestinationsSummary: ${error.message}`)
  return (data ?? []) as Pick<Destination, 'id' | 'name' | 'slug'>[]
}

// ─── Hotels ──────────────────────────────────────────────────────

export async function getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  const supabase = await createClient()

  const { data: hotels, error: hotelError } = await supabase
    .from('hotels')
    .select('id, destination_id, name, price_category, price_per_night_mmk, address, amenities, rating, contact, verified, image_url, description')
    .eq('destination_id', destinationId)
    .not('price_category', 'is', null)
    .order('created_at', { ascending: true })

  if (hotelError) throw new Error(`getHotelsByDestination: ${hotelError.message}`)
  if (!hotels || hotels.length === 0) return []

  const hotelIds = hotels.map((h) => h.id)

  const { data: rooms, error: roomError } = await supabase
    .from('hotel_rooms')
    .select('id, hotel_id, room_type, price_per_night, capacity')
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
    .select('id, destination_id, route, vehicle_type, price_regular, price_weekend, price_holiday, note')
    .eq('destination_id', destinationId)

  if (error) throw new Error(`getTransportOptions: ${error.message}`)
  return (data ?? []) as Transport[]
}

// ─── Itinerary Templates ─────────────────────────────────────────

export async function getItineraryTemplates(destinationId: string): Promise<ItineraryTemplate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('itinerary_templates')
    .select('id, destination_id, day_number, title_en, title_mm, activities')
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
    .select('id, full_name, preferred_lang, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(`getProfile: ${error.message}`)
  return (data ?? null) as Profile | null
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
    .select('id, destination, days, budget, title, ai_response, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`getSavedItineraries: ${error.message}`)
  return data ?? []
}
