export interface Destination {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  region: string | null
  highlights: string[] | null
  created_at: string
}

export interface Hotel {
  id: string
  destination_id: string
  name: string
  price_range: string | null
  price_per_night_mmk: number | null
  price_category: string | null
  address: string | null
  amenities: string[] | null
  rating: number | null
  contact: string | null
  verified: boolean
  image_url: string | null
  description: string | null
  created_at: string
}

export interface HotelRoom {
  id: string
  hotel_id: string
  room_type: string
  price_per_night: number
  capacity: number | null
  created_at: string
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
  created_at: string
}

export interface Activity {
  time: string
  activity: string
  location: string
  cost: number
  notes: string
}

export interface DayPlan {
  day: number
  title: string
  activities: Activity[]
  estimated_cost: number
}

export interface BudgetBreakdown {
  transport: number
  hotel: number
  food: number
  activities: number
  misc: number
}

export interface ItineraryAIResponse {
  destination: string
  total_days: number
  total_estimated_budget: number
  currency: string
  budget_breakdown: BudgetBreakdown
  daily_plans: DayPlan[]
  safety_tips: string[]
  best_time_to_visit: string
  local_tips: string[]
}

export interface Itinerary {
  id: string
  user_id: string
  destination: string
  days: number
  budget: number
  ai_response: ItineraryAIResponse
  title: string | null
  created_at: string
}

export interface PlannerFormData {
  destination: string
  days: number
  budget: number
}
