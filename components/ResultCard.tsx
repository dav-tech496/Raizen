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

const VIBER_NUMBER = '09751067759'
const VIBER_DEEP_LINK = `viber://chat?number=%2B959751067759`

// Season/weather info per destination slug
const DEST_SEASON: Record<string, { icon: string; season: string; desc: string; temp: string }> = {
  ngwesaung:     { icon: '☀️', season: 'Nov — Apr · Dry Season', desc: 'Clear skies, calm sea, perfect for beach', temp: '32°C' },
  'chaung-thar': { icon: '☀️', season: 'Nov — Apr · Dry Season', desc: 'Golden sunsets, warm water, low crowds', temp: '31°C' },
}

// Local tips per destination
const DEST_TIPS: Record<string, string[]> = {
  ngwesaung: [
    'Book bus tickets at least 1 day ahead, especially on weekends.',
    'Bring cash — ATMs are limited at the beach.',
    "Negotiate boat prices for Lover's Island — 3,000–5,000 MMK is fair.",
  ],
  'chaung-thar': [
    'Book bus tickets at least 1 day ahead, especially on weekends.',
    'Bring cash — card machines are rare here.',
    'Best sunsets are from the north end of the beach — walk 10 mins from town.',
  ],
}

const PACKING_LIST = [
  { emoji: '🕶', label: 'Sunglasses' },
  { emoji: '🧴', label: 'Sunscreen' },
  { emoji: '👙', label: 'Swimwear' },
  { emoji: '💵', label: 'Cash (MMK)' },
  { emoji: '🔌', label: 'Power bank' },
  { emoji: '👟', label: 'Flip flops' },
]

export default function ResultCard({ result, onSave, isSaving }: Props) {
  const { lang, t } = useLang()
  const isEn = lang !== 'mm'

  // Always use English for PDF
  const handleDownloadPDF = useCallback(async () => {
    try {
      await generateItineraryPDF(result, 'en')
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('PDF generation failed. Please try again.')
    }
  }, [result])

  // Derive destination slug from name for lookup
  const destSlug = result.destinationName?.toLowerCase().includes('ngwe')
    ? 'ngwesaung'
    : 'chaung-thar'

  const season = DEST_SEASON[destSlug]
  const tips   = DEST_TIPS[destSlug] ?? []

  return (
    <div className="px-[18px] py-6 animate-fade-up flex flex-col gap-[14px]">

      {/* ── Result header ── */}
      <div className="bg-green-pale border border-green/20 rounded-md px-4 py-[14px]">
        <h2 className="text-[18px] font-semibold text-ink tracking-[-0.35px] mb-[3px]">
          {isEn
            ? `Your ${result.days}-Day ${result.destinationName} Trip`
            : `သင့် ${result.days} ရက် ${result.destinationName} ခရီးစဉ်`}
        </h2>
        <p className="text-[12px] text-ink2 font-light">
          {isEn ? result.travelerLabel.en : result.travelerLabel.mm}
          {' · '}
          {isEn ? result.departureLabel.en : result.departureLabel.mm}
        </p>
        <div className="flex flex-wrap gap-[6px] mt-[10px]">
          <span className="text-[10px] font-semibold bg-green/10 text-green rounded-full px-[9px] py-[3px]">🏖 Beach</span>
          <span className="text-[10px] font-semibold bg-green/10 text-green rounded-full px-[9px] py-[3px]">🚌 Bus included</span>
          <span className="text-[10px] font-semibold bg-green/10 text-green rounded-full px-[9px] py-[3px]">🏨 Hotel matched</span>
          <span className="text-[10px] font-semibold bg-green/10 text-green rounded-full px-[9px] py-[3px]">📄 PDF ready</span>
        </div>
      </div>

      {/* ── Weather / best season ── */}
      {season && (
        <div
          className="rounded-md px-4 py-[14px] flex items-center gap-[14px]"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e4080 100%)' }}
        >
          <span className="text-[30px]">{season.icon}</span>
          <div className="flex-1">
            <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-white/60 mb-[2px]">
              {isEn ? 'Best Travel Season' : 'အကောင်းဆုံး ခရီးသွားချိန်'}
            </div>
            <div className="text-[14px] font-semibold text-white">{season.season}</div>
            <div className="text-[11px] text-white/55 mt-[2px]">{season.desc}</div>
          </div>
          <div className="text-[22px] font-bold text-white">{season.temp}</div>
        </div>
      )}

      {/* ── Bus ticket ── */}
      <div className="bg-green rounded-md p-[18px] flex items-center gap-[14px]">
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

      {/* ── Cost summary ── */}
      <div className="bg-surface border border-border rounded-md overflow-hidden shadow-sm">
        <div className="flex justify-between items-center px-4 py-[10px] text-[13px] border-b border-border">
          <span className="text-ink2 font-light">{t('busTickets')}</span>
          <span className="font-semibold text-ink">{formatMMK(result.busTicket.totalPrice)} MMK</span>
        </div>
        <div className="flex justify-between items-center px-4 py-[10px] text-[13px] border-b border-border">
          <span className="text-ink2 font-light">
            {t('hotelEstimate')} ({result.days} {t('nights')})
          </span>
          <span className="font-semibold text-ink">
            {result.cheapestHotelTotal > 0
              ? `${formatMMK(result.cheapestHotelTotal)} MMK`
              : (isEn ? 'No match' : 'ကိုက်ညီမှုမရှိ')}
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-[12px] bg-green-pale">
          <span className="text-sm font-semibold text-green">{t('estimatedTotal')}</span>
          <span className="text-[22px] font-bold text-green tracking-[-0.4px]">
            {formatMMK(result.totalCost)} MMK
          </span>
        </div>
      </div>

      {/* ── Matched hotels ── */}
      <div>
        <h3 className="text-base font-semibold text-ink tracking-[-0.25px] mb-3">{t('matchedHotels')}</h3>
        {result.matchedHotels.length === 0 ? (
          <p className="text-sm text-ink2 bg-surface2 rounded-md p-4">{t('noHotelsFound')}</p>
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
      </div>

      {/* ── Day plans ── */}
      <div>
        <h3 className="text-base font-semibold text-ink tracking-[-0.25px] mb-3">{t('dayByDay')}</h3>
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
      </div>

      {/* ── Local tips ── */}
      {tips.length > 0 && (
        <div className="bg-surface border border-border rounded-md px-4 py-[14px]">
          <div className="text-[13px] font-semibold text-ink mb-[10px] flex items-center gap-[6px]">
            💡 {isEn ? 'Local Tips' : 'ဒေသခံ အကြံပြုချက်'}
          </div>
          <div className="flex flex-col gap-[8px]">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-[8px] items-start">
                <div className="w-[6px] h-[6px] rounded-full bg-green flex-shrink-0 mt-[4px] opacity-70" />
                <span className="text-[12px] text-ink2 leading-[1.5]">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Packing list ── */}
      <div className="bg-surface border border-border rounded-md px-4 py-[14px]">
        <div className="text-[13px] font-semibold text-ink mb-[10px]">
          🎒 {isEn ? 'What to Pack' : 'ထည့်သွင်းရန် ပစ္စည်းများ'}
        </div>
        <div className="grid grid-cols-2 gap-[8px]">
          {PACKING_LIST.map((item) => (
            <div key={item.label} className="flex items-center gap-[8px]">
              <span className="text-[16px]">{item.emoji}</span>
              <span className="text-[12px] text-ink2 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Viber Contact Box ── */}
      <div className="bg-[#F3F0FF] border border-[#7360F2]/25 rounded-md overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-[13px] border-b border-[#7360F2]/15 bg-[#7360F2]/10">
          <div className="w-[38px] h-[38px] rounded-full bg-[#7360F2] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M11.4 0.9C8.5 1.1 5.8 2.3 3.8 4.4C1.6 6.6 0.5 9.6 0.7 12.7C0.8 14.9 1.6 17 3 18.7V22.4C3 22.8 3.3 23.1 3.7 23.1H3.8L7.4 22.1C8.7 22.6 10.1 22.9 11.5 22.9C14.6 22.9 17.5 21.7 19.7 19.5C21.9 17.3 23.1 14.4 23.1 11.3C23.2 5.2 17.9 0.5 11.4 0.9ZM17.1 17.3C15.3 19.1 12.9 20.1 10.3 20C9.2 20 8.1 19.8 7 19.4L6.7 19.3L4.7 19.9V17.8L4.5 17.6C2.1 14.8 2 10.7 4.3 7.8C6.4 5.1 9.8 3.8 13.2 4.3C16.4 4.8 19 7.1 19.8 10.2C20.5 13 19.5 16 17.1 17.3Z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[#3D2D8E] leading-snug">
              {isEn ? 'Need help booking this trip?' : 'ခရီးစဉ် ကြိုတင်မှာကြားရန် အကူအညီလိုပါသလား?'}
            </div>
            <div className="text-[10px] text-[#7360F2] mt-[2px]">
              {isEn ? 'Raizen Travel · Response within 1 hour' : 'Raizen Travel · ၁ နာရီအတွင်း တုံ့ပြန်မည်'}
            </div>
          </div>
        </div>

        <div className="px-4 py-[14px]">
          <p className="text-[12px] text-ink2 font-light mb-[12px] leading-[1.55]">
            {isEn
              ? 'Contact us on Viber for transport, hotel, and trip arrangement support.'
              : 'ပို့ဆောင်ရေး၊ တည်းခိုခန်း နှင့် ခရီးစဉ် စီစဉ်မှုများအတွက် Viber မှ ဆက်သွယ်ပါ။'}
          </p>

          <div className="flex flex-col gap-[6px] mb-[12px]">
            {[VIBER_NUMBER, '+959751067759'].map((num) => (
              <a
                key={num}
                href={`tel:${num}`}
                className="flex items-center gap-2 text-[13px] font-semibold text-[#3D2D8E] active:opacity-70"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7360F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .86h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.79a16 16 0 006.12 6.12l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                {num}
              </a>
            ))}
          </div>

          <a
            href={VIBER_DEEP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#7360F2] text-white text-[13px] font-semibold py-[13px] rounded-md active:opacity-80 transition-opacity"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
              <path d="M11.4 0.9C8.5 1.1 5.8 2.3 3.8 4.4C1.6 6.6 0.5 9.6 0.7 12.7C0.8 14.9 1.6 17 3 18.7V22.4C3 22.8 3.3 23.1 3.7 23.1H3.8L7.4 22.1C8.7 22.6 10.1 22.9 11.5 22.9C14.6 22.9 17.5 21.7 19.7 19.5C21.9 17.3 23.1 14.4 23.1 11.3C23.2 5.2 17.9 0.5 11.4 0.9Z"/>
            </svg>
            {isEn ? 'Contact on Viber' : 'Viber မှ ဆက်သွယ်ရန်'}
          </a>
        </div>
      </div>

      {/* ── Download PDF — full width ── */}
      <button
        onClick={handleDownloadPDF}
        className="w-full flex items-center justify-center gap-2 bg-green text-white text-[14px] font-semibold py-[16px] rounded-md shadow-[0_4px_18px_rgba(185,28,28,.3)] active:opacity-80 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isEn ? 'Download PDF Itinerary' : 'PDF ဒေါင်းလုဒ်လုပ်ရန်'}
      </button>

      <div className="h-4" />
    </div>
  )
}
