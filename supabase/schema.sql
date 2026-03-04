-- ============================================================
-- RAIZEN — Supabase Production Schema
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE destinations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  region      TEXT,
  highlights  TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hotels (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  price_range    TEXT,
  address        TEXT,
  amenities      TEXT[],
  rating         NUMERIC(2,1),
  contact        TEXT,
  verified       BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE itineraries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  days        INTEGER NOT NULL,
  budget      INTEGER NOT NULL,
  ai_response JSONB NOT NULL,
  title       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotels_destination_id  ON hotels(destination_id);
CREATE INDEX idx_itineraries_user_id    ON itineraries(user_id);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX idx_destinations_slug      ON destinations(slug);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels       ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "destinations_public_read" ON destinations FOR SELECT USING (true);
CREATE POLICY "hotels_public_read"       ON hotels       FOR SELECT USING (true);

CREATE POLICY "itineraries_select_own" ON itineraries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "itineraries_insert_own" ON itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "itineraries_delete_own" ON itineraries FOR DELETE USING (auth.uid() = user_id);

-- SEED DESTINATIONS
INSERT INTO destinations (name, slug, description, image_url, region, highlights) VALUES
(
  'Bagan', 'bagan',
  'An ancient city and UNESCO World Heritage Site in Mandalay Region, home to over 3,000 Buddhist temples and pagodas dating from the 9th to 13th centuries. Sunrises over Bagan are among the most breathtaking sights in Southeast Asia.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
  'Mandalay Region',
  ARRAY['Shwezigon Pagoda','Ananda Temple','Hot Air Balloon Rides','Dhammayan Gyi Temple','Bagan Archaeological Museum','E-bike Temple Tours']
),
(
  'Ngwe Saung', 'ngwesaung',
  'One of Myanmar''s most pristine beaches stretching 20km along the Bay of Bengal. Crystal-clear turquoise waters, white sand, and untouched natural beauty define this hidden gem of the Ayeyarwady Region.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
  'Ayeyarwady Region',
  ARRAY['20km White Sand Beach','Lover Island Day Trip','Snorkeling & Diving','Fresh Seafood Villages','Beach Bonfires','Water Sports']
),
(
  'Inle Lake', 'inle-lake',
  'A serene freshwater lake in the Shan Hills at 880m altitude, famous for its floating villages, unique leg-rowing fishermen, and the Intha ethnic culture. One of Myanmar''s most iconic and photogenic destinations.',
  'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&auto=format&fit=crop',
  'Shan State',
  ARRAY['Floating Villages','Leg-Rowing Fishermen','Phaung Daw Oo Pagoda','Floating Gardens','Indein Ruins','Local Weaving Markets']
);

-- SEED HOTELS (Bagan)
INSERT INTO hotels (destination_id, name, price_range, address, amenities, rating, verified) VALUES
((SELECT id FROM destinations WHERE slug='bagan'), 'Bagan Lodge', '$80 – $150 / night', 'New Bagan, Nyaung-U Township', ARRAY['Swimming Pool','Spa','Fine Dining','Temple Views','Free WiFi','Airport Shuttle'], 4.5, true),
((SELECT id FROM destinations WHERE slug='bagan'), 'Thazin Garden Hotel', '$55 – $100 / night', 'New Bagan Village, Bagan', ARRAY['Tropical Garden','Restaurant','Free WiFi','Bicycle Rental'], 4.2, true),
((SELECT id FROM destinations WHERE slug='bagan'), 'Ostello Bello Bagan', '$12 – $35 / night', 'Nyaung-U, Bagan', ARRAY['Shared Kitchen','Free WiFi','Guided Tours','Social Rooftop'], 4.3, true);

-- SEED HOTELS (Ngwe Saung)
INSERT INTO hotels (destination_id, name, price_range, address, amenities, rating, verified) VALUES
((SELECT id FROM destinations WHERE slug='ngwesaung'), 'Aureum Palace Hotel & Resort', '$120 – $260 / night', 'Ngwe Saung Beach, Pathein', ARRAY['Private Beach','Infinity Pool','Full Spa','Multiple Restaurants','Water Sports'], 4.7, true),
((SELECT id FROM destinations WHERE slug='ngwesaung'), 'Ngwe Saung Yacht Club & Resort', '$90 – $180 / night', 'Ngwe Saung, Ayeyarwady Region', ARRAY['Beachfront','Pool','Seafood Restaurant','Kayaking','Free WiFi'], 4.4, true),
((SELECT id FROM destinations WHERE slug='ngwesaung'), 'Blue Ocean Resort', '$35 – $75 / night', 'Ngwe Saung Beach', ARRAY['Direct Beach Access','Restaurant','Free WiFi','Bicycle Rental'], 4.0, true);

-- SEED HOTELS (Inle Lake)
INSERT INTO hotels (destination_id, name, price_range, address, amenities, rating, verified) VALUES
((SELECT id FROM destinations WHERE slug='inle-lake'), 'Inle Princess Resort', '$150 – $320 / night', 'Magyizin Village, Inle Lake', ARRAY['Overwater Bungalows','Full Spa','Lakeside Restaurant','Private Boat Tours','Yoga'], 4.8, true),
((SELECT id FROM destinations WHERE slug='inle-lake'), 'Paramount Inle Resort', '$100 – $210 / night', 'Kela Village, Nyaungshwe', ARRAY['Lake Views','Pool','Restaurant','Boat Service','Free WiFi'], 4.5, true),
((SELECT id FROM destinations WHERE slug='inle-lake'), 'Remember Inn', '$20 – $55 / night', 'Nyaungshwe Township', ARRAY['Restaurant','Free WiFi','Bike Rental','Tour Desk'], 4.1, true);
