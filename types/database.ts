export type Lang = 'en' | 'mm'

export interface Destination {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  region: string | null
  country?: string | null     
  price_from?: number | null  
  highlights: string[] | null
  created_at: string
}

export interface Hotel {
  id: string
  destination_id: string
  name: string
  price_category: 'budget' | 'mid-range' | 'premium' | 'luxury' | 'boutique' | 'villa'
  price_per_night_mmk: number | null
  address: string | null
  amenities: string[] | null
  rating: number | null
  contact: string | null
  verified: boolean
  image_url: string | null
  description: string | null
  rooms: HotelRoom[]
}

export interface HotelRoom {
  id: string
  hotel_id: string
  room_type: string
  price_per_night: number
  capacity: number
}

export interface Transport {
  id: string
  destination_id: string
  route: string
  vehicle_type: string
  price_regular: number
  price_weekend: number | null
  price_holiday: number | null
  note: string | null
}

export interface ItineraryActivity {
  time_en: string
  time_mm: string
  name_en: string
  name_mm: string
  detail_en: string
  detail_mm: string
}

export interface ItineraryTemplate {
  id: string
  destination_id: string
  day_number: number
  title_en: string
  title_mm: string
  activities: ItineraryActivity[]
}

export interface Profile {
  id: string
  full_name: string | null
  preferred_lang: Lang
  created_at: string
  updated_at: string
}

export interface SavedItinerary {
  id: string
  user_id: string
  destination: string
  days: number
  budget: number
  title: string | null
  ai_response: PlanResult | null
  created_at: string
}

// ─── Planner form state ──────────────────────────────────────────

export type TravelerType = 'solo' | 'couple' | 'family'
export type DepartureType = 'regular' | 'weekend' | 'holiday'

export interface PlannerFormValues {
  destinationId: string
  destinationSlug: string
  days: number
  dailyBudget: number
  travelerType: TravelerType
  travelerCount: number
  departureType: DepartureType
}

// ─── Planner result ──────────────────────────────────────────────

export interface MatchedRoom {
  roomType: string
  pricePerNight: number
  capacity: number
  totalForStay: number
}

export interface MatchedHotel {
  name: string
  tier: string
  minPrice: number
  matchedRooms: MatchedRoom[]
}

export interface DayPlan {
  dayNumber: number
  titleEn: string
  titleMm: string
  activities: ItineraryActivity[]
}

export interface PlanResult {
  destinationName: string
  days: number
  travelerLabel: { en: string; mm: string }
  departureLabel: { en: string; mm: string }
  busTicket: {
    route: string
    vehicleType: string
    pricePerPax: number
    totalPrice: number
    note: string | null
  }
  matchedHotels: MatchedHotel[]
  dayPlans: DayPlan[]
  totalCost: number
  cheapestHotelTotal: number
}

export interface Itinerary {
  id: string;
  destination_id: string;
  title: string;
  day_number: number;
  activities: ItineraryActivity[];
  image_url?: string | null;
  duration_days?: number | null; 
  price_per_pax?: number | null; 
  price_from?: number | null;
  days?: number | null;
}

export interface Station {
  id: string;
  name: string;
  location: string | null;
}
