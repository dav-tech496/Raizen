import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// Call this to instantly refresh the site after editing Supabase data
// GET /api/revalidate?secret=YOUR_SECRET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/destinations')
  revalidatePath('/planner')
  revalidatePath('/destinations/[slug]', 'page')

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
    message: 'All pages refreshed from Supabase',
  })
}
