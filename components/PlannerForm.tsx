'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/context/LangContext'
import { getBudgetTierLabel } from '@/lib/plannerLogic'
import type { Destination, PlannerFormValues, TravelerType, DepartureType } from '@/types'

interface Props {
  destinations: Destination[]
  onSubmit: (values: PlannerFormValues) => void
  isLoading: boolean
}

const MIN_BUDGET = 100_000
const MAX_BUDGET = 1_000_000
const DEFAULT_BUDGET = 200_000

const DEST_IMAGES: Record<string, string> = {
  ngwesaung:
    'https://upload.wikimedia.org/wikipedia/commons/2/29/Ngwe_Saung_beach_05.jpg',
  'chaung-thar':
    'https://upload.wikimedia.org/wikipedia/commons/e/eb/20170304_084223-01_Chaungtha_beach.jpg',
}

const DEST_SUBTITLES: Record<string, { en: string; mm: string }> = {
  ngwesaung:    { en: 'Silver Beach · 20km coastline', mm: 'ငွေဆောင် · ကမ်းခြေ ၂၀ ကီလိုမီတာ' },
  'chaung-thar': { en: 'Golden Beach · Famous sunsets', mm: 'ကျောင်းသာ · နေဝင်ချိန် အလှဆုံး' },
}

export default function PlannerForm({ destinations, onSubmit, isLoading }: Props) {
  const { lang, t } = useLang()

  const [destinationId, setDestinationId] = useState(destinations[0]?.id ?? '')
  const [days, setDays] = useState(2)
  const [dailyBudget, setDailyBudget] = useState(DEFAULT_BUDGET)
  const [travelerType, setTravelerType] = useState<TravelerType>('solo')
  const [departureType, setDepartureType] = useState<DepartureType>('regular')

  const pct = Math.round(((dailyBudget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100)

  useEffect(() => {
    const el = document.getElementById('budget-slider') as HTMLInputElement | null
    if (el) el.style.setProperty('--pct', `${pct}%`)
  }, [pct])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dest = destinations.find((d) => d.id === destinationId)
    if (!dest) return
    onSubmit({
      destinationId,
      destinationSlug: dest.slug,
      days,
      dailyBudget,
      travelerType,
      travelerCount: travelerType === 'solo' ? 1 : travelerType === 'couple' ? 2 : 4,
      departureType,
    })
  }

  const tierLabel = getBudgetTierLabel(dailyBudget)
  const tierText = lang === 'mm' ? tierLabel.mm : tierLabel.en

  // Tier color mapping
  const tierColor =
    dailyBudget <= 150_000
      ? 'text-ink2'
      : dailyBudget <= 300_000
      ? 'text-green'
      : dailyBudget <= 500_000
      ? 'text-[#D4A017]'
      : 'text-[#9D174D]'

  return (
    <form onSubmit={handleSubmit} className="px-[18px] pt-6 pb-2 flex flex-col gap-6">

      {/* ── Destination ── */}
      <div>
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {t('destination')}
        </label>
        <div className="flex flex-col gap-[9px]">
          {destinations.map((d) => {
            const isSelected = destinationId === d.id
            const imgUrl = DEST_IMAGES[d.slug] ?? ''
            const subtitle = DEST_SUBTITLES[d.slug]
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDestinationId(d.id)}
                className={`relative h-[76px] rounded-md overflow-hidden border-2 text-left transition-all ${
                  isSelected ? 'border-green' : 'border-transparent'
                }`}
              >
                {/* Background image */}
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={d.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                {/* Content */}
                <div className="relative z-10 flex items-center justify-between h-full px-3">
                  <div>
                    <div className="text-[14px] font-bold text-white">{d.name}</div>
                    {subtitle && (
                      <div className="text-[10px] text-white/65 mt-[2px]">
                        {lang === 'mm' ? subtitle.mm : subtitle.en}
                      </div>
                    )}
                  </div>
                  {isSelected ? (
                    <span className="text-[9px] font-bold bg-green text-white rounded-full px-[9px] py-[3px] whitespace-nowrap">
                      {lang === 'mm' ? 'ရွေးချယ်ထားသည် ✓' : 'Selected ✓'}
                    </span>
                  ) : (
                    <span className="text-[9px] text-white/50 bg-white/10 rounded-full px-[9px] py-[3px] whitespace-nowrap">
                      {lang === 'mm' ? 'နှိပ်ပါ' : 'Tap to select'}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Number of days ── */}
      <div>
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {t('numberOfDays')}
        </label>
        <div className="flex gap-[9px]">
          {[2, 3, 4, 5, 7].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`flex-1 py-[12px] rounded-md text-[15px] font-semibold border transition-all ${
                days === d
                  ? 'bg-green text-white border-green shadow-sm'
                  : 'bg-surface text-ink border-border hover:border-green/40'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink3 mt-[8px] font-light">
          {days} {lang === 'mm' ? 'ရက် ရွေးချယ်ထားသည်' : `${days === 1 ? 'day' : 'days'} selected`}
        </p>
      </div>

      {/* ── Daily budget slider ── */}
      <div>
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {lang === 'mm' ? 'နေ့စဉ် ဘတ်ဂျက် (တစ်ဦးချင်း)' : 'Daily Budget / Person'}
        </label>

        <div className="bg-surface border border-border rounded-md px-4 py-[14px] mb-3 text-center">
          <span className="text-[28px] font-bold text-ink tracking-[-0.5px]">
            {dailyBudget.toLocaleString('en-US')}
          </span>
          <span className="text-sm text-ink3 ml-[6px]">MMK / {lang === 'mm' ? 'ရက်' : 'day'}</span>
          <div className="flex items-center justify-center gap-[6px] mt-[5px]">
            <div className="w-[7px] h-[7px] rounded-full bg-green opacity-80" />
            <span className={`text-[12px] font-semibold ${tierColor}`}>{tierText}</span>
          </div>
        </div>

        <input
          id="budget-slider"
          type="range"
          min={MIN_BUDGET}
          max={MAX_BUDGET}
          step={10_000}
          value={dailyBudget}
          onChange={(e) => setDailyBudget(Number(e.target.value))}
          className="w-full accent-green"
          style={{ ['--pct' as string]: `${pct}%` }}
        />

        <div className="flex justify-between mt-[6px]">
          <span className="text-[11px] text-ink3 font-light">100K MMK</span>
          <span className="text-[11px] text-ink3 font-light">1,000K MMK</span>
        </div>
      </div>

      {/* ── Traveling as ── */}
      <div>
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {t('travelingAs')}
        </label>
        <div className="grid grid-cols-3 gap-[9px]">
          {([
            ['solo',   '🧍', 'solo'],
            ['couple', '👫', 'couple'],
            ['family', '👨‍👩‍👧‍👦', 'family'],
          ] as const).map(([val, emoji, labelKey]) => (
            <button
              key={val}
              type="button"
              onClick={() => setTravelerType(val)}
              className={`flex flex-col items-center gap-[6px] py-[14px] rounded-md border text-[13px] font-medium transition-all ${
                travelerType === val
                  ? 'bg-green-pale border-green text-green'
                  : 'bg-surface border-border text-ink2 hover:border-green/40'
              }`}
            >
              <span className="text-[22px]">{emoji}</span>
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Departure day — segmented control ── */}
      <div>
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {t('departureDay')}
        </label>
        <div className="flex bg-surface2 rounded-md p-[3px] gap-[3px]">
          {([
            ['regular', 'weekday'],
            ['weekend', 'weekend'],
            ['holiday', 'holiday'],
          ] as const).map(([val, labelKey]) => (
            <button
              key={val}
              type="button"
              onClick={() => setDepartureType(val)}
              className={`flex-1 py-[9px] rounded-[10px] text-[12px] font-semibold transition-all ${
                departureType === val
                  ? 'bg-surface text-green shadow-sm border border-border'
                  : 'text-ink3 hover:text-ink2'
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
        {departureType !== 'regular' && (
          <p className="text-[11px] text-[#D4A017] mt-[7px] font-light">
            {lang === 'mm'
              ? 'မှတ်ချက်: စနေ/တနင်္ဂနွေနှင့် ရုံးပိတ်ရက်တွင် ဘတ်ကားခ ပိုများနိုင်ပါသည်'
              : 'Note: Bus prices may be higher on weekends and holidays.'}
          </p>
        )}
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isLoading || !destinationId}
        className="w-full bg-green text-white text-[15px] font-semibold py-4 rounded-md shadow-[0_4px_18px_rgba(185,28,28,.3)] disabled:opacity-60 transition-opacity active:opacity-80 mt-1"
      >
        {isLoading ? '…' : t('showMyPlan')}
      </button>
    </form>
  )
}
