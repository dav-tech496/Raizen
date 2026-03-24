# 🇲🇲 Raizen — Myanmar Travel Planner

Production-ready Next.js travel SaaS — mobile-first, bilingual (EN/မြန်မာ), real MMK pricing.

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (DM Sans + Playfair Display)
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth (email/password)
- **PDF**: jsPDF (proper A4 generation, no print dialog)
- **Deployment**: Vercel

## Quick Start

```bash
npm install
cp .env.local .env.local   # fill in your Supabase keys
npm run dev
```

## Environment Variables

Add these to `.env.local` and to Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://wnzoxfacvypcnrmsvnpt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get your keys from:
https://supabase.com/dashboard/project/wnzoxfacvypcnrmsvnpt/settings/api

## File Structure

```
raizen/
├── app/
│   ├── layout.tsx              # Root layout + fonts + LangProvider
│   ├── globals.css             # Tailwind base + slider CSS + print
│   ├── page.tsx                # Home (Server Component — fetches destinations)
│   ├── HomeClient.tsx          # Home UI (Client Component)
│   ├── destinations/
│   │   ├── page.tsx            # Destinations list (Server)
│   │   ├── DestinationsClient.tsx
│   │   └── [slug]/
│   │       ├── page.tsx        # Destination detail (Server)
│   │       └── DestinationDetailClient.tsx
│   ├── planner/
│   │   ├── page.tsx            # Planner (Server — loads all data)
│   │   └── PlannerClient.tsx   # Planner UI + result
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── dashboard/
│       ├── page.tsx            # Protected — redirects if no session
│       └── DashboardClient.tsx
├── components/
│   ├── Navbar.tsx              # Sticky top bar + hamburger
│   ├── Drawer.tsx              # Slide-in nav + language switcher + auth
│   ├── BottomNav.tsx           # Fixed bottom tab navigation
│   ├── Hero.tsx                # Home hero section
│   ├── FeaturedCard.tsx        # Featured destination card
│   ├── PlannerForm.tsx         # Full planner form with sliders
│   ├── ResultCard.tsx          # Plan result — bus, hotels, days, PDF
│   └── LoadingOverlay.tsx      # Full-screen loading spinner
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── queries.ts          # All DB functions (typed)
│   ├── plannerLogic.ts         # All business logic (pure functions)
│   ├── pdfGenerator.ts         # jsPDF A4 itinerary generator
│   └── utils.ts                # cn(), formatMMK()
├── context/
│   └── LangContext.tsx         # EN/MM language context + full dictionary
├── types/
│   └── index.ts                # All TypeScript interfaces
├── middleware.ts               # Auth guard for /dashboard
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import in Vercel → https://vercel.com/new
3. Add environment variables (same as `.env.local`)
4. Deploy → done

## Supabase Tables

- `destinations` — destination data
- `hotels` + `hotel_rooms` — hotel + room pricing
- `transport` — bus ticket prices (regular/weekend/holiday)
- `itinerary_templates` — day-by-day plan content (EN + MM)
- `profiles` — user profiles (auto-created on signup)
- `itineraries` — saved user itineraries (RLS protected)
