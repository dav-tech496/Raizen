import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// ─── Validation ───────────────────────────────────────────────────────────────

const RequestSchema = z.object({
  destination: z.string().min(2).max(100),
  days: z.number().int().min(1).max(30),
  budget: z.number().int().min(200000).max(100000000),
})

// ─── Budget tier helpers ──────────────────────────────────────────────────────

type PriceCategory = 'budget' | 'mid-range' | 'premium' | 'luxury' | 'boutique' | 'villa'

function getBudgetTier(budget: number, days: number): PriceCategory[] {
  const perDay = budget / days
  if (perDay < 100_000)  return ['budget']
  if (perDay < 250_000)  return ['budget', 'mid-range']
  if (perDay < 500_000)  return ['mid-range', 'boutique']
  if (perDay < 800_000)  return ['premium', 'boutique', 'villa']
  return ['luxury', 'villa', 'premium']
}

// ─── POST /api/generate-itinerary ────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    // 1. Parse & validate request body
    const body = await req.json()
    const validation = RequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { destination, days, budget } = validation.data

    // 2. Resolve destination slug → row
    const supabase = await createClient()

    // Accept either slug (e.g. "bagan") or display name (e.g. "Bagan")
    const { data: dest, error: destError } = await supabase
      .from('destinations')
      .select('id, name, slug, description, region, highlights')
      .or(`slug.eq.${destination.toLowerCase()},name.ilike.${destination}`)
      .single()

    if (destError || !dest) {
      return NextResponse.json(
        { error: `Destination "${destination}" not found. Available: bagan, ngwesaung, inle-lake` },
        { status: 404 }
      )
    }

    // 3. Fetch itinerary day templates (up to `days` days)
    const { data: templates, error: tplError } = await supabase
      .from('itinerary_templates')
      .select('day_number, title_en, title_mm, activities')
      .eq('destination_id', dest.id)
      .order('day_number', { ascending: true })
      .limit(days)

    if (tplError) throw new Error(`itinerary_templates: ${tplError.message}`)

    // 4. Fetch transport options
    const { data: transports, error: trnError } = await supabase
      .from('transport')
      .select('route, vehicle_type, price_regular, price_weekend, price_holiday, note')
      .eq('destination_id', dest.id)

    if (trnError) throw new Error(`transport: ${trnError.message}`)

    // 5. Fetch hotels filtered by budget tier, with rooms
    const allowedCategories = getBudgetTier(budget, days)

    const { data: hotels, error: htlError } = await supabase
      .from('hotels')
      .select(`
        id, name, price_category, rating, address, amenities, description, image_url,
        hotel_rooms ( room_type, price_per_night, capacity )
      `)
      .eq('destination_id', dest.id)
      .in('price_category', allowedCategories)
      .order('rating', { ascending: false })

    if (htlError) throw new Error(`hotels: ${htlError.message}`)

    // 6. If requested days exceed available templates, cycle/repeat them
    const availableDays = templates?.length ?? 0
    const itineraryDays = Array.from({ length: days }, (_, i) => {
      const tpl = availableDays > 0 ? templates![i % availableDays] : null
      return {
        day: i + 1,
        title: tpl?.title_en ?? `Day ${i + 1}`,
        title_mm: tpl?.title_mm ?? `ရက် ${i + 1}`,
        activities: (tpl?.activities ?? []) as {
          name_en: string
          name_mm: string
          time_en: string
          time_mm: string
          detail_en: string
          detail_mm: string
        }[],
      }
    })

    // 7. Calculate costs
    //    Pick the cheapest room per qualifying hotel that fits the per-night slice
    const budgetPerNight = Math.floor(budget / days)

    const hotelSuggestions = (hotels ?? []).map((h) => {
      const rooms = (h.hotel_rooms as { room_type: string; price_per_night: number; capacity: number | null }[]) ?? []
      // Find the best-value room at or under budget-per-night; else cheapest available
      const sorted = [...rooms].sort((a, b) => a.price_per_night - b.price_per_night)
      const bestFit = sorted.find((r) => r.price_per_night <= budgetPerNight) ?? sorted[0] ?? null

      return {
        id: h.id,
        name: h.name,
        price_category: h.price_category,
        rating: h.rating,
        address: h.address,
        amenities: h.amenities,
        description: h.description,
        image_url: h.image_url,
        recommended_room: bestFit,
        estimated_total_mmk: bestFit ? bestFit.price_per_night * days : null,
      }
    })

    // 8. Pick the first hotel as the default recommendation for total price calc
    const primaryHotel = hotelSuggestions[0] ?? null
    const hotelTotal = primaryHotel?.estimated_total_mmk ?? 0
    const transportCost = transports?.[0]?.price_regular ?? 0
    const totalEstimate = hotelTotal + transportCost * 2 // round-trip

    // 9. Shape the final itinerary object (matches ResultCard expectations)
    const itinerary = {
      destination: {
        name: dest.name,
        slug: dest.slug,
        description: dest.description,
        region: dest.region,
        highlights: dest.highlights ?? [],
      },
      days,
      budget,
      budget_tier: allowedCategories[allowedCategories.length - 1],
      schedule: itineraryDays,
      hotels: hotelSuggestions,
      transport: (transports ?? []).map((t) => ({
        route: t.route,
        vehicle_type: t.vehicle_type,
        price_regular: t.price_regular,
        price_weekend: t.price_weekend,
        price_holiday: t.price_holiday,
        note: t.note,
      })),
      cost_summary: {
        hotel_total_mmk: hotelTotal,
        transport_roundtrip_mmk: transportCost * 2,
        estimated_total_mmk: totalEstimate,
        budget_remaining_mmk: Math.max(0, budget - totalEstimate),
        currency: 'MMK',
      },
    }

    return NextResponse.json({ itinerary }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[generate-itinerary] Error:', message)

    return NextResponse.json(
      { error: 'Failed to build itinerary. Please try again.' },
      { status: 500 }
    )
  }
}
