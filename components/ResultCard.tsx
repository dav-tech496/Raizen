'use client'

import { useCallback } from 'react'
import { useLang } from '@/context/LangContext'
import { formatMMK } from '@/lib/plannerLogic'
import { generateItineraryPDF } from '@/lib/pdfGenerator'
import type { PlanResult } from '@/types'

interface Props {
  result: PlanResult
  onSave?: () => void
  isSaving?: boolean
}

const TIER_STYLES: Record<string, string> = {
  'mid-range': 'bg-[#EDE9FE] text-[#5B21B6]',
  villa:       'bg-green-pale text-green',
  premium:     'bg-[#FCE7F3] text-[#9D174D]',
  luxury:      'bg-amber-pale text-[#92400E]',
  budget:      'bg-surface2 text-ink2',
  boutique:    'bg-[#D1FAE5] text-[#065F46]',
}

export default function ResultCard({ result, onSave, isSaving }: Props) {
  const { lang, t } = useLang()
  const isEn = lang !== 'mm'

  const handleDownloadPDF = useCallback(async () => {
    try {
      await generateItineraryPDF(result, lang)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert(isEn ? 'PDF generation failed. Please try again.' : 'PDF ဖန်တီးမရပါ')
    }
  }, [result, lang, isEn])

  return (
    <div className="px-[18px] py-6 animate-fade-up">

      {/* Header */}
      <div className="mb-[18px]">
        <h2 className="text-[19px] font-semibold text-ink tracking-[-0.35px] mb-1">
          {isEn
            ? `Your ${result.days}-Day ${result.destinationName} Trip`
            : `သင့် ${result.days} ရက် ${result.destinationName} ခရီးစဉ်`}
        </h2>
        <p className="text-[13px] text-ink2 font-light">
          {isEn ? result.travelerLabel.en : result.travelerLabel.mm}
          {' · '}
          {isEn ? result.departureLabel.en : result.departureLabel.mm}
        </p>
      </div>

      {/* Bus ticket */}
      <div className="bg-green rounded-md p-[18px] mb-[14px] flex items-center gap-[14px]">
        <div className="w-[46px] h-[46px] rounded-[13px] bg-white/15 flex items-center justify-center text-[22px] flex-shrink-0">
          🚌
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white mb-[3px]">{result.busTicket.route}</div>
          <div className="text-xs text-white/70">
            {t('busRoundTrip')} · {result.busTicket.pricePerPax > 0 ? result.busTicket.totalPrice / result.busTicket.pricePerPax : 0} {t('pax')}
          </div>
          {result.busTicket.note && (
            <div className="text-[11px] text-white/55 mt-1">{result.busTicket.note}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white tracking-[-0.3px]">
            {formatMMK(result.busTicket.totalPrice)}
          </div>
          <div className="text-[10px] text-white/60">MMK</div>
        </div>
      </div>

      {/* Cost summary */}
      <div className="bg-surface border border-border rounded-md p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-center py-[6px] text-[13px] border-b border-border">
          <span className="text-ink2 font-light">{t('busTickets')}</span>
          <span className="font-semibold text-ink">{formatMMK(result.busTicket.totalPrice)} MMK</span>
        </div>
        <div className="flex justify-between items-center py-[6px] text-[13px] border-b border-border">
          <span className="text-ink2 font-light">
            {t('hotelEstimate')} ({result.days} {t('nights')})
          </span>
          <span className="font-semibold text-ink">
            {result.cheapestHotelTotal > 0
              ? `${formatMMK(result.cheapestHotelTotal)} MMK`
              : (isEn ? 'No match' : 'ကိုက်ညီမှုမရှိ')}
          </span>
        </div>
        <div className="flex justify-between items-center pt-[10px] mt-1">
          <span className="text-sm font-semibold text-ink">{t('estimatedTotal')}</span>
          <span className="text-[22px] font-bold text-green tracking-[-0.4px]">
            {formatMMK(result.totalCost)} MMK
          </span>
        </div>
      </div>

      {/* Matched hotels */}
      <h3 className="text-base font-semibold text-ink tracking-[-0.25px] mb-3">{t('matchedHotels')}</h3>
      {result.matchedHotels.length === 0 ? (
        <p className="text-sm text-ink2 bg-surface2 rounded-md p-4 mb-3">{t('noHotelsFound')}</p>
      ) : (
        result.matchedHotels.map((hotel) => (
          <div key={hotel.name} className="bg-surface border border-border rounded-md overflow-hidden mb-[11px] shadow-sm">
            <div className="flex items-start justify-between px-4 py-[14px] border-b border-border">
              <div>
                <div className="text-[15px] font-semibold text-ink mb-1">{hotel.name}</div>
                <span className={`text-[10px] font-medium px-[9px] py-[3px] rounded-full ${TIER_STYLES[hotel.tier] ?? 'bg-surface2 text-ink2'}`}>
                  {hotel.tier}
                </span>
              </div>
              <div className="text-right text-xs text-ink3">
                {t('from')}
                <strong className="block text-[15px] font-semibold text-green">
                  {formatMMK(hotel.minPrice)} MMK
                </strong>
              </div>
            </div>
            <div className="px-4 pb-[14px] pt-2">
              {hotel.matchedRooms.map((room) => (
                <div key={room.roomType} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-[13px] text-ink2 font-light">{room.roomType}</div>
                    <div className="text-[11px] text-green mt-[2px]">
                      {formatMMK(room.pricePerNight)} × {result.days} {t('nights')} = {formatMMK(room.totalForStay)} MMK
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-ink ml-2 shrink-0">
                    {formatMMK(room.pricePerNight)}/{t('night')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Day plans */}
      <h3 className="text-base font-semibold text-ink tracking-[-0.25px] mb-3 mt-2">{t('dayByDay')}</h3>
      {result.dayPlans.map((day) => (
        <div key={day.dayNumber} className="bg-surface border border-border rounded-md overflow-hidden mb-[11px] shadow-sm">
          <div className="flex items-center justify-between px-4 py-[13px] border-b border-border bg-surface2">
            <span className="text-[11px] font-semibold tracking-[0.07em] uppercase text-green">
              {isEn ? `Day ${day.dayNumber}` : `နေ့ ${day.dayNumber}`}
            </span>
            <span className="text-sm font-semibold text-ink">
              {isEn ? day.titleEn : day.titleMm}
            </span>
          </div>
          <div className="px-4 py-[14px] flex flex-col gap-3">
            {day.activities.map((act, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[11px] text-ink3 min-w-[46px] pt-[2px] font-medium">
                  {isEn ? act.time_en : act.time_mm}
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-ink mb-[2px]">
                    {isEn ? act.name_en : act.name_mm}
                  </div>
                  <div className="text-xs text-ink3 leading-[1.45]">
                    {isEn ? act.detail_en : act.detail_mm}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 bg-green text-white text-[13px] font-semibold py-[15px] rounded-md border-2 border-green transition-all active:bg-green-mid disabled:opacity-60"
          >
            {isSaving ? '…' : t('saveItinerary')}
          </button>
        )}
        <button
          onClick={handleDownloadPDF}
          className={`${onSave ? '' : 'flex-1'} flex items-center justify-center gap-2 bg-surface text-green text-[13px] font-semibold py-[15px] rounded-md border-2 border-green transition-all active:bg-green-pale`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t('saveAsPdf')}
        </button>
      </div>

      <div className="h-5" />
    </div>
  )
}
