# 🇲🇲 Raizen — Myanmar Travel Brain

AI-powered travel planner for Myanmar, built with Next.js 14, Supabase, and Gemini AI.

## Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Vercel

## Features
- 🤖 AI Trip Planner (Gemini AI with MMK pricing)
- 📍 Destination Pages (Bagan, Ngwe Saung, Inle Lake)
- 🔐 Authentication (Login / Register)
- 💾 Save Itineraries (authenticated users)
- 🏨 Hotel Listings
- 📱 Mobile-first responsive design

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in your credentials
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor.

## Deploy

Push to GitHub → Import in Vercel → Set environment variables → Deploy.
