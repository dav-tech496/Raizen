export type Destination = {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price_from: number | null;
  country: string | null;
  featured: boolean;
};

export type Hotel = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  image_url: string | null;
  destination_id: string | null;
  stars: number | null;
  location: string | null;
};

export type HotelRoom = {
  id: string;
  created_at: string;
  hotel_id: string;
  room_type: string;
  price_per_night: number;
  capacity: number;
};

export type Itinerary = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  destination_id: string | null;
  duration_days: number | null;
  price: number | null;
  image_url: string | null;
  featured: boolean;
};

export type ItineraryTemplate = {
  id: string;
  created_at: string;
  title: string;
  itinerary_id: string | null;
  day_number: number;
  content: string | null;
};

export type Profile = {
  id: string;
  created_at: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export type Transport = {
  id: string;
  created_at: string;
  name: string;
  type: string | null;
  description: string | null;
  price: number | null;
};

export type Station = {
  id: string;
  created_at: string;
  name: string;
  location: string | null;
};
