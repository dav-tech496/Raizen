// lib/supabase/client.ts
// Browser-side Supabase client — use in Client Components only

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables.\n' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file ' +
      'and in the Vercel dashboard under Project → Settings → Environment Variables.'
    )
  }

  return createBrowserClient(url, key)
}
