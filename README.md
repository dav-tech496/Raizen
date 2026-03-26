# Raizen — Myanmar Travel Planner

A Next.js 14 (App Router) travel planner for Myanmar destinations with Supabase backend.

## 🚀 Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# → Edit .env.local and fill in your Supabase keys

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project → Settings → API → `anon public` key |

**For Vercel deployment:**
Go to **Vercel → Your Project → Settings → Environment Variables** and add both variables above.

## 🏗️ Project Structure

```
app/
  page.tsx                    # Home (SSR, revalidates hourly)
  layout.tsx                  # Root layout + fonts + LangProvider
  login/
    page.tsx                  # Suspense wrapper (required for useSearchParams)
    LoginForm.tsx             # Actual login form client component
  register/page.tsx           # Registration form
  dashboard/page.tsx          # Protected — redirects if not logged in
  destinations/
    page.tsx                  # Destinations list (SSR)
    [slug]/page.tsx           # Destination detail (SSR, async params)
  planner/page.tsx            # Trip planner (SSR data fetch → client form)
  api/itineraries/route.ts    # POST route for saving itineraries

components/
  Navbar.tsx                  # Sticky top nav with hamburger
  Drawer.tsx                  # Slide-in menu with nav + auth + language
  BottomNav.tsx               # Mobile bottom navigation
  Hero.tsx                    # Home page hero section
  FeaturedCard.tsx            # Featured destination card
  PlannerForm.tsx             # Trip planner form
  ResultCard.tsx              # Trip result display + PDF download
  LoadingOverlay.tsx          # Full-screen loading overlay

lib/
  supabase/client.ts          # Browser Supabase client
  supabase/server.ts          # Server Supabase client (cookies)
  supabase/queries.ts         # All DB query functions
  plannerLogic.ts             # Pure business logic (no React/Supabase)
  pdfGenerator.ts             # jsPDF itinerary generator
  utils.ts                    # cn() + formatMMK()

context/
  LangContext.tsx             # EN/MM language context + translations

types/
  index.ts                    # All TypeScript types
```

## 🛠️ Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (see above)
4. Deploy — **no build overrides needed**

## 🗄️ Supabase Tables Required

- `destinations` — id, name, slug, description, image_url, region, highlights, created_at
- `hotels` — id, destination_id, name, price_category, verified, ...
- `hotel_rooms` — id, hotel_id, room_type, price_per_night, capacity
- `transport` — id, destination_id, route, vehicle_type, price_regular, price_weekend, price_holiday, note
- `itinerary_templates` — id, destination_id, day_number, title_en, title_mm, activities (jsonb)
- `itineraries` — id, user_id, destination, days, budget, title, ai_response (jsonb), created_at
- `profiles` — id, full_name, preferred_lang, created_at, updated_at
