import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSavedItineraries } from '@/lib/supabase/queries'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/dashboard')

  const itineraries = await getSavedItineraries(user.id)
  return <DashboardClient user={user} itineraries={itineraries} />
}
