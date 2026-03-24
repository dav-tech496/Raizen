'use client'

import { useState, useCallback } from 'react'
import { useLang } from '@/context/LangContext'
import { getBudgetTierLabel, formatMMK } from '@/lib/plannerLogic'
import type { Destination, PlannerFormValues, TravelerType, DepartureType } from '@/types'

interface Props {
  destinations: Destination[]
  onSubmit: (values: PlannerFormValues) => void
  isLoading: boolean
}

const TRAVELER_OPTIONS: { type: TravelerType; icon: string; en: string; mm: string }[] = [
  { type: 'solo',   icon: '🧍', en: 'Solo',   mm: 'တစ်ဦးတည်း' },
  { type: 'couple', icon: '👫', en: 'Couple', mm: 'စုံတွဲ' },
  { type: 'family', icon: '👨‍👩‍👧', en: 'Family', mm: 'မိသားစု' },
]

const DEP_OPTIONS: { type: DepartureType; en: string; mm: string; price: number }[] = [
  { type: 'regular', en: 'Weekday',         mm: 'နေ့ရက်',         price: 70_000 },
  { type: 'weekend', en: 'Weekend',         mm: 'စနေ/တနင်္ဂနွေ', price: 80_000 },
  { type: 'holiday', en: 'Holiday',         mm: 'ရုံးပိတ်ရက်',   price: 110_000 },
]

export default function PlannerForm({ destinations, onSubmit, isLoading }: Props) {
  const { lang, t } = useLang()

  const [destId,   setDestId]   = useState(destinations[0]?.id   ?? '')
  const [destSlug, setDestSlug] = useState(destinations[0]?.slug ?? 'ngwesaung')
  const [days,     setDays]     = useState(3)
  const [budget,   setBudget]   = useState(200_000)
  const [traveler, setTraveler] = useState<TravelerType>('couple')
  const [departure,setDeparture]= useState<DepartureType>('regular')

  const daysPercent   = ((days - 1)          / (7 - 1))                * 100
  const budgetPercent = ((budget - 100_000)  / (800_000 - 100_000))   * 100
  const tier          = getBudgetTierLabel(budget)

  const handleDestChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const dest = destinations.find((d) => d.id === e.target.value)
    if (dest) { setDestId(dest.id); setDestSlug(dest.slug) }
  }, [destinations])

  const handleSubmit = () => {
    onSubmit({
      destinationId:   destId,
      destinationSlug: destSlug,
      days,
      dailyBudget:     budget,
      travelerType:    traveler,
      travelerCount:   traveler === 'solo' ? 1 : traveler === 'couple' ? 2 : 4,
      departureType:   departure,
    })
  }

  const inputCls =
    'w-full px-4 py-[14px] text-sm text-ink bg-surface border-[1.5px] border-border2 rounded-md outline-none appearance-none focus:border-green focus:shadow-[0_0_0_3px_rgba(45,106,79,.12)] transition-[border-color,box-shadow]'

  return (
    <div className="px-[18px] pt-6">

      {/* Destination */}
      <div className="mb-[22px]">
        <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
          {t('destination')}
        </label>
        <div className="relative">
          <select value={destId} onChange={handleDestChange} className={inputCls}>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
            <option disabled>Bagan ({lang === 'mm' ? 'မကြာမီ' : 'Coming Soon'})</option>
            <option disabled>Inle Lake ({lang === 'mm' ? 'မကြာမီ' : 'Coming Soon'})</option>
          </select>
          <div className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-ink3" />
        </div>
      </div>

      {/* Days slider */}
      <div className="mb-[22px]">
        <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
          {t('numberOfDays')}
        </label>
        <div className="flex items-center gap-3 mb-[10px]">
          <input
            type="range" min={1} max={7} step={1} value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ '--pct': `${daysPercent}%` } as React.CSSProperties}
            className="flex-1"
          />
          <div className="text-lg font-semibold text-green min-w-[70px] text-right tracking-[-0.3px]">
            <strong>{days}</strong>{' '}
            <span className="text-xs font-normal text-ink3">
              {lang === 'mm' ? 'ရက်' : days === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-ink3">{lang === 'mm' ? '၁ ရက်' : '1 day'}</span>
          <span className="text-[11px] text-ink3">{lang === 'mm' ? '၇ ရက်' : '7 days'}</span>
        </div>
      </div>

      {/* Budget slider */}
      <div className="mb-[22px]">
        <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
          {t('dailyBudget')}
        </label>
        <div className="flex items-center gap-3 mb-[10px]">
          <input
            type="range" min={100_000} max={800_000} step={10_000} value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ '--pct': `${budgetPercent}%` } as React.CSSProperties}
            className="flex-1"
          />
          <div className="text-[14px] font-semibold text-green min-w-[100px] text-right tracking-[-0.3px]">
            {formatMMK(budget)}
          </div>
        </div>
        <div className="flex justify-between mb-[10px]">
          <span className="text-[11px] text-ink3">100K MMK</span>
          <span className="text-[11px] text-ink3">800K MMK</span>
        </div>
        <div className="flex items-center justify-between bg-surface2 rounded-sm px-[14px] py-[10px] border border-border">
          <span className="text-xs text-ink3">{t('budgetTier')}</span>
          <span className="text-[13px] font-semibold text-green">
            {lang === 'mm' ? tier.mm : tier.en}
          </span>
        </div>
      </div>

      {/* Traveler */}
      <div className="mb-[22px]">
        <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
          {t('travelingAs')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TRAVELER_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setTraveler(opt.type)}
              className={`border-[1.5px] rounded-md py-[14px] px-2 text-center transition-all ${
                traveler === opt.type ? 'border-green bg-green-pale' : 'border-border2 bg-surface'
              }`}
            >
              <div className="text-[22px] mb-[6px]">{opt.icon}</div>
              <div className={`text-xs font-medium ${traveler === opt.type ? 'text-green' : 'text-ink2'}`}>
                {lang === 'mm' ? opt.mm : opt.en}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Departure day */}
      <div className="mb-[22px]">
        <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
          {t('departureDay')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DEP_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setDeparture(opt.type)}
              className={`border-[1.5px] rounded-md py-[11px] px-2 text-center text-sm transition-all ${
                departure === opt.type
                  ? 'border-green bg-green-pale text-green font-medium'
                  : 'border-border2 bg-surface text-ink2'
              }`}
            >
              {lang === 'mm' ? opt.mm : opt.en}
              <br />
              <span className="text-[10px] opacity-70">{formatMMK(opt.price)} MMK</span>
            </button>
          ))}
        </div>
      </div>

      {/* Travel style — coming soon */}
      <div className="mb-[22px]">
        <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
          {t('travelStyle')}
        </label>
        <div className="flex items-center justify-between bg-surface2 border-[1.5px] border-dashed border-border2 rounded-md px-4 py-4">
          <span className="text-sm font-medium text-ink2">{t('travelStyleSoon')}</span>
          <span className="text-[10px] font-medium bg-amber-pale text-[#92400E] rounded-full px-[11px] py-[3px]">
            {t('soon')}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-green text-white text-[15px] font-semibold py-4 rounded-md shadow-[0_4px_18px_rgba(45,106,79,.32)] transition-transform active:scale-[0.98] disabled:opacity-70 mt-1"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        {isLoading ? '…' : t('showMyPlan')}
      </button>
    </div>
  )
}
