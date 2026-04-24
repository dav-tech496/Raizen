/**
 * lib/data.ts — replaces the deleted queries.ts
 * Use these functions in Server Components, Route Handlers, and Server Actions only.
 */

import { createServerClient } from "@/lib/supabase-server";
import type {
  Destination,
  Hotel,
  HotelRoom,
  Itinerary,
  ItineraryTemplate,
  Transport,
  Station,
} from "@/types/database";

// ─── Destinations ────────────────────────────────────────────────────────────

export async function getAllDestinations(): Promise<Destination[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("name", { ascending: true });
  if (error) { console.error("[getAllDestinations]", error.message); return []; }
  return data as Destination[];
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("[getFeaturedDestinations]", error.message); return []; }
  return data as Destination[];
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) { console.error("[getDestinationBySlug]", error.message); return null; }
  return data as Destination;
}

// ─── Hotels ──────────────────────────────────────────────────────────────────

export async function getAllHotels(): Promise<Hotel[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .order("name", { ascending: true });
  if (error) { console.error("[getAllHotels]", error.message); return []; }
  return data as Hotel[];
}

export async function getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("destination_id", destinationId);
  if (error) { console.error("[getHotelsByDestination]", error.message); return []; }
  return data as Hotel[];
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("id", id)
    .single();
  if (error) { console.error("[getHotelById]", error.message); return null; }
  return data as Hotel;
}

// ─── Hotel Rooms ─────────────────────────────────────────────────────────────

export async function getRoomsByHotel(hotelId: string): Promise<HotelRoom[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hotel_rooms")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("price_per_night", { ascending: true });
  if (error) { console.error("[getRoomsByHotel]", error.message); return []; }
  return data as HotelRoom[];
}

// ─── Itineraries ─────────────────────────────────────────────────────────────

export async function getAllItineraries(): Promise<Itinerary[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("[getAllItineraries]", error.message); return []; }
  return data as Itinerary[];
}

export async function getFeaturedItineraries(): Promise<Itinerary[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("[getFeaturedItineraries]", error.message); return []; }
  return data as Itinerary[];
}

export async function getItineraryById(id: string): Promise<Itinerary | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("id", id)
    .single();
  if (error) { console.error("[getItineraryById]", error.message); return null; }
  return data as Itinerary;
}

// ─── Itinerary Templates ─────────────────────────────────────────────────────

export async function getTemplatesByItinerary(itineraryId: string): Promise<ItineraryTemplate[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("itinerary_templates")
    .select("*")
    .eq("itinerary_id", itineraryId)
    .order("day_number", { ascending: true });
  if (error) { console.error("[getTemplatesByItinerary]", error.message); return []; }
  return data as ItineraryTemplate[];
}

// ─── Transport ───────────────────────────────────────────────────────────────

export async function getAllTransport(): Promise<Transport[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("transport")
    .select("*")
    .order("name", { ascending: true });
  if (error) { console.error("[getAllTransport]", error.message); return []; }
  return data as Transport[];
}

// ─── Stations ────────────────────────────────────────────────────────────────

export async function getAllStations(): Promise<Station[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .order("name", { ascending: true });
  if (error) { console.error("[getAllStations]", error.message); return []; }
  return data as Station[];
}
