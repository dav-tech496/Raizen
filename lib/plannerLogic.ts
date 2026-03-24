// lib/plannerLogic.ts
// Pure business logic — no React, no Supabase imports.
// All planner calculations live here.

import type {
  Hotel,
  Transport,
  ItineraryTemplate,
  PlannerFormValues,
  PlanResult,
  MatchedHotel,
  MatchedRoom,
  DayPlan,
} from '@/types'

// ─── Formatters ──────────────────────────────────────────────────

export function formatMMK(amount: number): string {
  return amount.toLocaleString('en-US')
}

export function getBudgetTierLabel(budget: number): { en: string; mm: string } {
  if (budget <= 150_000) return { en: 'Budget', mm: 'ဘတ်ဂျက်' }
  if (budget <= 300_000) return { en: 'Mid-Range', mm: 'အလယ်အလတ်' }
  if (budget <= 500_000) return { en: 'Premium', mm: 'ပရီမီယံ' }
  return { en: 'Luxury', mm: 'ဇိမ်ခံ' }
}

export function getTravelerLabel(type: PlannerFormValues['travelerType']): { en: string; mm: string } {
  const map = {
    solo:   { en: 'Solo Traveler', mm: 'တစ်ဦးတည်း' },
    couple: { en: 'Couple',        mm: 'စုံတွဲ' },
    family: { en: 'Family',        mm: 'မိသားစု' },
  }
  return map[type]
}

export function getDepartureLabel(type: PlannerFormValues['departureType']): { en: string; mm: string } {
  const map = {
    regular: { en: 'Weekday',          mm: 'နေ့ရက်' },
    weekend: { en: 'Weekend',          mm: 'စနေ/တနင်္ဂနွေ' },
    holiday: { en: 'Holiday',          mm: 'ရုံးပိတ်ရက်' },
  }
  return map[type]
}

export function getTravelerCount(type: PlannerFormValues['travelerType']): number {
  return type === 'solo' ? 1 : type === 'couple' ? 2 : 4
}

// ─── Bus ticket ───────────────────────────────────────────────────

export function calculateBusTicket(
  transport: Transport,
  departureType: PlannerFormValues['departureType'],
  pax: number
): PlanResult['busTicket'] {
  const pricePerPax =
    departureType === 'weekend'
      ? (transport.price_weekend ?? transport.price_regular)
      : departureType === 'holiday'
        ? (transport.price_holiday ?? transport.price_regular)
        : transport.price_regular

  return {
    route:       transport.route,
    vehicleType: transport.vehicle_type,
    pricePerPax,
    totalPrice:  pricePerPax * pax,
    note:        transport.note,
  }
}

// ─── Hotel matching ───────────────────────────────────────────────

export function matchHotelsTobudget(
  hotels: Hotel[],
  dailyBudget: number,
  days: number,
  pax: number
): MatchedHotel[] {
  const results: MatchedHotel[] = []

  for (const hotel of hotels) {
    const matchedRooms: MatchedRoom[] = hotel.rooms
      .filter((r) => r.price_per_night <= dailyBudget && r.capacity >= pax)
      .map((r) => ({
        roomType:       r.room_type,
        pricePerNight:  r.price_per_night,
        capacity:       r.capacity,
        totalForStay:   r.price_per_night * days,
      }))

    if (matchedRooms.length > 0) {
      results.push({
        name:         hotel.name,
        tier:         hotel.price_category,
        minPrice:     Math.min(...matchedRooms.map((r) => r.pricePerNight)),
        matchedRooms,
      })
    }
  }

  return results.sort((a, b) => a.minPrice - b.minPrice)
}

// ─── Day plan selection ───────────────────────────────────────────

export function selectDayPlans(
  templates: ItineraryTemplate[],
  days: number
): DayPlan[] {
  const plans: DayPlan[] = []

  for (let d = 1; d <= days; d++) {
    const template =
      templates.find((t) => t.day_number === d) ??
      templates[(d - 1) % templates.length]

    if (!template) continue

    plans.push({
      dayNumber:  d,
      titleEn:    template.title_en,
      titleMm:    template.title_mm,
      activities: template.activities,
    })
  }

  return plans
}

// ─── Total cost ───────────────────────────────────────────────────

export function calculateTotalCost(
  busTotal: number,
  matchedHotels: MatchedHotel[]
): { grandTotal: number; cheapestHotelTotal: number } {
  if (matchedHotels.length === 0) {
    return { grandTotal: busTotal, cheapestHotelTotal: 0 }
  }
  const cheapestHotelTotal = matchedHotels[0].matchedRooms[0]?.totalForStay ?? 0
  return { grandTotal: busTotal + cheapestHotelTotal, cheapestHotelTotal }
}

// ─── Master build function ────────────────────────────────────────

export function buildPlanResult(
  form: PlannerFormValues,
  hotels: Hotel[],
  transports: Transport[],
  templates: ItineraryTemplate[]
): PlanResult {
  const pax       = getTravelerCount(form.travelerType)
  const transport = transports[0]

  const busTicket = transport
    ? calculateBusTicket(transport, form.departureType, pax)
    : { route: 'Transport unavailable', vehicleType: 'Bus', pricePerPax: 0, totalPrice: 0, note: null }

  const matchedHotels                     = matchHotelsTobudget(hotels, form.dailyBudget, form.days, pax)
  const dayPlans                          = selectDayPlans(templates, form.days)
  const { grandTotal, cheapestHotelTotal } = calculateTotalCost(busTicket.totalPrice, matchedHotels)

  return {
    destinationName: form.destinationSlug,
    days:            form.days,
    travelerLabel:   getTravelerLabel(form.travelerType),
    departureLabel:  getDepartureLabel(form.departureType),
    busTicket,
    matchedHotels,
    dayPlans,
    totalCost:          grandTotal,
    cheapestHotelTotal,
  }
}
