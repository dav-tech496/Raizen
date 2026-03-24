'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'
import PlannerForm from '@/components/PlannerForm'
import ResultCard from '@/components/ResultCard'
import LoadingOverlay from '@/components/LoadingOverlay'
import { useLang } from '@/context/LangContext'
import { buildPlanResult } from '@/lib/plannerLogic'
import { createClient } from '@/lib/supabase/client'
import { saveItinerary } from '@/lib/supabase/queries'
import type {
  Destination,
  Hotel,
  Transport,
  ItineraryTemplate,
  PlannerFormValues,
  PlanResult,
} from '@/types'

interface Props {
  destinations: Destination[]
  hotels: Hotel[]
  transports: Transport[]
  templates: ItineraryTemplate[]
}

const LOADING_STEPS = {
  en: [
    'Checking hotels for your budget…',
    'Checking bus ticket prices…',
    'Building your day-by-day plan…',
    'Finalizing your trip…',
  ],
  mm: [
    'ဟိုတယ်များကို စစ်ဆေးနေသည်…',
    'ဘတ်စ်ကားစျေးနှုန်းများ စစ်ဆေးနေသည်…',
    'ခရီးစဉ်အစီအစဉ် တည်ဆောက်နေသည်…',
    'ဆုံးဖြတ်ချက်ချနေသည်…',
  ],
}

export default function PlannerClient({ destinations, hotels, transports, templates }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState<PlanResult | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { lang } = useLang()
  const router = useRouter()

  async function handleSubmit(values: PlannerFormValues) {
    setIsLoading(true)
    setResult(null)

    const steps = LOADING_STEPS[lang]
    let step = 0
    setLoadingMsg(steps[0])
    const interval = setInterval(() => {
      step = Math.min(step + 1, steps.length - 1)
      setLoadingMsg(steps[step])
    }, 700)

    await new Promise((res) => setTimeout(res, 2800))
    clearInterval(interval)

    const planResult = buildPlanResult(values, hotels, transports, templates)

    // Resolve destination display name
    const destName =
      destinations.find((d) => d.id === values.destinationId)?.name ?? values.destinationSlug
    planResult.destinationName = destName

    setIsLoading(false)
    setResult(planResult)

    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  async function handleSave() {
    if (!result) return
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login?redirectTo=/planner')
      return
    }

    setIsSaving(true)
    try {
      await saveItinerary(user.id, {
        destination: result.destinationName,
        days: result.days,
        budget: result.busTicket.pricePerPax,
        title: `${result.days}-Day ${result.destinationName} Trip`,
        ai_response: result as object,
      })
      alert(lang === 'mm' ? 'ခရီးစဉ်သိမ်းဆည်းပြီးပါပြီ!' : 'Itinerary saved successfully!')
    } catch {
      alert(
        lang === 'mm'
          ? 'ဖြစ်မလာပါ — နောက်မှထပ်ကြိုးစားပါ'
          : 'Failed to save — please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {isLoading && <LoadingOverlay message={loadingMsg} />}

      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="max-w-[480px] mx-auto pb-[90px]">
        {/* Planner hero */}
        <div
          className="px-[18px] py-7 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1B3A2F 0%,#0D2318 100%)' }}
        >
          <div className="text-[11px] font-medium tracking-[0.09em] uppercase text-green-light mb-2">
            {lang === 'mm' ? 'ခရီးစဉ်စီစဉ်သူ' : 'Trip Planner'}
          </div>
          <h1 className="text-[24px] font-semibold text-white tracking-[-0.4px] mb-[6px]">
            {lang === 'mm' ? 'သင့်မြန်မာနိုင်ငံ ခရီးစဉ်စီစဉ်ပါ' : 'Plan Your Myanmar Trip'}
          </h1>
          <p className="text-[13px] text-white/55 font-light leading-[1.55]">
            {lang === 'mm'
              ? 'သင့်နှစ်သက်မှုများကို ဖော်ပြပါ၊ ကိုက်ညီသောဟိုတယ်များနှင့် ဘတ်စ်ကားလက်မှတ်စျေးနှုန်းများ ပြသမည်'
              : "Tell us your preferences and we'll show matched hotels and bus ticket prices."}
          </p>
        </div>

        <PlannerForm
          destinations={destinations}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {result && (
          <div id="result-section">
            <ResultCard result={result} onSave={handleSave} isSaving={isSaving} />
          </div>
        )}
      </main>

      <BottomNav />
    </>
  )
}
