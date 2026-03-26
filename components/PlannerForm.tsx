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

const MIN_BUDGET = 30_000
const MAX_BUDGET = 1_000_000
const DEFAULT_BUDGET = 200_000

export default function PlannerForm({ destinations, onSubmit, isLoading }: Props) {
  const { lang, t } = useLang()

  const [destinationId, setDestinationId] = useState(destinations[0]?.id ?? '')
  const [days, setDays] = useState(3)
  const [dailyBudget, setDailyBudget] = useState(DEFAULT_BUDGET)
  const [travelerType, setTravelerType] = useState<TravelerType>('solo')
  const [departureType, setDepartureType] = useState<DepartureType>('regular')

  // Slider fill percentage CSS var
  const pct = Math.round(
    ((dailyBudget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100
  )

  // Sync CSS variable for range track fill
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

  return (
    <form onSubmit={handleSubmit} className="px-[18px] pt-6 pb-2 flex flex-col gap-6">

      {/* Destination */}
      <div>
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {t('destination')}
        </label>
        <div className="grid grid-cols-1 gap-[9px]">
          {destinations.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDestinationId(d.id)}
              className={`flex items-center gap-3 px-4 py-[13px] rounded-md border text-left transition-all ${
                destinationId === d.id
                  ? 'border-green bg-green-pale shadow-[0_0_0_2px_rgba(45,106,79,.15)]'
                  : 'border-border bg-surface'
              }`}
            >
              <div
                className={`w-[10px] h-[10px] rounded-full border-2 flex-shrink-0 transition-colors ${
                  destinationId === d.id ? 'border-green bg-green' : 'border-border2 bg-surface'
                }`}
              />
              <span className={`text-[15px] font-medium ${destinationId === d.id ? 'text-green' : 'text-ink'}`}>
                {d.name}
              </span>
              {destinationId === d.id && (
                <span className="ml-auto text-[10px] font-semibold bg-green text-white rounded-full px-[9px] py-[3px]">
                  {t('availableNow')}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Number of days */}
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

      {/* Daily budget slider */}
      <div>
        <div className="flex items-center justify-between mb-[10px]">
          <label className="text-xs font-semibold tracking-[0.06em] uppercase text-ink2">
            {t('dailyBudget')}
          </label>
          <span className="text-xs font-medium bg-green-pale text-green px-[10px] py-[4px] rounded-full">
            {tierText}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-md px-4 py-[14px] mb-3 text-center">
          <span className="text-[28px] font-bold text-ink tracking-[-0.5px]">
            {dailyBudget.toLocaleString('en-US')}
          </span>
          <span className="text-sm text-ink3 ml-[6px]">MMK / {lang === 'mm' ? 'ရက်' : 'day'}</span>
        </div>

        <input
          id="budget-slider"
          type="range"
          min={MIN_BUDGET}
          max={MAX_BUDGET}
          step={10_000}
          value={dailyBudget}
          onChange={(e) => setDailyBudget(Number(e.target.value))}
          className="w-full"
          style={{ ['--pct' as string]: `${pct}%` }}
        />

        <div className="flex justify-between mt-[6px]">
          <span className="text-[11px] text-ink3 font-light">30K MMK</span>
          <span className="text-[11px] text-ink3 font-light">1,000K MMK</span>
        </div>
      </div>

      {/* Traveling as */}
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

      {/* Departure day */}
      <div>
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {t('departureDay')}
        </label>
        <div className="grid grid-cols-3 gap-[9px]">
          {([
            ['regular', 'weekday'],
            ['weekend', 'weekend'],
            ['holiday', 'holiday'],
          ] as const).map(([val, labelKey]) => (
            <button
              key={val}
              type="button"
              onClick={() => setDepartureType(val)}
              className={`py-[12px] rounded-md border text-[13px] font-medium transition-all ${
                departureType === val
                  ? 'bg-green-pale border-green text-green'
                  : 'bg-surface border-border text-ink2 hover:border-green/40'
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
        {departureType !== 'regular' && (
          <p className="text-[11px] text-amber mt-[7px] font-light">
            {lang === 'mm'
              ? 'မှတ်ချက်: စနေ/တနင်္ဂနွေနှင့် ရုံးပိတ်ရက်တွင် ဘတ်ကားခ ပိုများနိုင်ပါသည်'
              : 'Note: Bus prices may be higher on weekends and holidays.'}
          </p>
        )}
      </div>

      {/* Travel style (coming soon) */}
      <div className="opacity-60">
        <label className="block text-xs font-semibold tracking-[0.06em] uppercase text-ink2 mb-[10px]">
          {t('travelStyle')}
        </label>
        <div className="bg-surface border border-border rounded-md px-4 py-[13px] flex items-center justify-between">
          <span className="text-[13px] text-ink3 font-light">{t('travelStyleSoon')}</span>
          <span className="text-[10px] font-semibold bg-amber-pale text-[#92400E] rounded-full px-[10px] py-[3px]">
            {t('soon')}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !destinationId}
        className="w-full bg-green text-white text-[15px] font-semibold py-4 rounded-md shadow-[0_4px_18px_rgba(45,106,79,.32)] disabled:opacity-60 transition-opacity active:opacity-80 mt-1"
      >
        {isLoading ? '…' : t('showMyPlan')}
      </button>
    </form>
  )
}
