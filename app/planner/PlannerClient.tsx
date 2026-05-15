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

    const destId = values.destinationId
    const filteredHotels    = hotels.filter((h) => h.destination_id === destId)
    const filteredTransports = transports.filter((t) => t.destination_id === destId)
    const filteredTemplates  = templates.filter((t) => t.destination_id === destId)

    const planResult = buildPlanResult(values, filteredHotels, filteredTransports, filteredTemplates)

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

    // Check auth via browser client (no server cookies needed)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login?redirectTo=/planner')
      return
    }

    setIsSaving(true)
    try {
      // Use the API route so server cookies are handled server-side
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: result.destinationName,
          days: result.days,
          budget: result.busTicket.pricePerPax,
          title: `${result.days}-Day ${result.destinationName} Trip`,
          ai_response: result,
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Failed to save')
      }

      alert(lang === 'mm' ? 'ခရီးစဉ်သိမ်းဆည်းပြီးပါပြီ!' : 'Itinerary saved successfully!')
    } catch (err) {
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

        {/* Viber Click Now Box */}
        <div className="mx-[18px] mt-6 mb-2 rounded-2xl overflow-hidden shadow-lg">
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: 'linear-gradient(135deg,#7B61FF 0%,#5B3FE8 100%)' }}
          >
            {/* Viber logo */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#7B61FF"/>
                <path d="M22.1 10.3C20.5 8.8 18.3 8 16 8c-4.7 0-8.5 3.5-8.5 7.8 0 1.4.4 2.7 1.1 3.9L8 24l4.5-1.1c1.1.6 2.3.9 3.5.9 4.7 0 8.5-3.5 8.5-7.8 0-2.1-.9-4-2.4-5.4v-.3zm-6.1 12c-1.1 0-2.1-.3-3-.8l-.2-.1-2.7.7.7-2.5-.2-.2c-.6-1-1-2.1-1-3.3 0-3.6 3.3-6.5 7.4-6.5 2 0 3.8.7 5.2 2 1.4 1.3 2.2 3 2.2 4.8-.1 3.6-3.4 6.5-7.4 6.5v.4zm4.1-4.9c-.2-.1-1.4-.7-1.6-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.1-.7-.6-1.2-1.3-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.3-.4.1-.1.1-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.5.5-.8 1.1-.8 1.9 0 1.1.8 2.2.9 2.4.1.2 1.7 2.6 4.1 3.6.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.5 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3l.3-.1z" fill="white"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-[14px] leading-tight">
                {lang === 'mm' ? 'Viber မှတဆင့် ဆက်သွယ်ပါ' : 'Have questions? Chat on Viber'}
              </p>
              <p className="text-white/70 text-[12px] mt-0.5">
                {lang === 'mm' ? 'အမြန်ဆုံးပြန်ကြားပါမည်' : 'We reply fast — tap to open Viber'}
              </p>
            </div>
          </div>
          
            href="viber://chat?number=%2B639751067759"
            className="flex items-center justify-center gap-2 w-full py-[14px] font-bold text-[14px] tracking-wide text-white active:opacity-80 transition-opacity"
            style={{ background: '#5B3FE8' }}
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            {lang === 'mm' ? 'ယခုဆက်သွယ်ရန်' : 'Chat Now — 09751067759'}
          </a>
        </div>

      </main>

      <BottomNav />
    </>
  )
}
