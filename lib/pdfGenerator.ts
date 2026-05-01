/**
 * pdfGenerator.ts
 *
 * Generates a PDF of the itinerary result by:
 *  1. Rendering a hidden, print-optimised clone of ResultCard into the DOM
 *  2. Capturing it with html2canvas (so Myanmar + English fonts render correctly)
 *  3. Embedding the canvas image into a jsPDF document
 *  4. Opening the browser's native Print Preview (so the user can inspect before saving)
 *
 * This avoids all font-embedding problems: the browser already knows how to render
 * Myanmar text via the system / web font stack, and html2canvas captures that render
 * faithfully as pixels.
 *
 * Dependencies (add to package.json if not present):
 *   "html2canvas": "^1.4.1"
 *   "jspdf":       "^2.5.1"
 */

import type { PlanResult } from '@/types'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatMMK(value: number): string {
  return value.toLocaleString('en-US')
}

// ─── build a self-contained HTML string that mirrors ResultCard ──────────────

function buildPrintHTML(result: PlanResult, lang: string): string {
  const isEn = lang !== 'mm'

  const TIER_COLORS: Record<string, string> = {
    'mid-range': 'background:#EDE9FE;color:#5B21B6',
    villa:       'background:#D1FAE5;color:#065F46',
    premium:     'background:#FCE7F3;color:#9D174D',
    luxury:      'background:#FEF3C7;color:#92400E',
    budget:      'background:#F3F4F6;color:#374151',
    boutique:    'background:#D1FAE5;color:#065F46',
  }

  // ── bus card ──
  const busCard = `
    <div style="background:#2D6A4F;border-radius:8px;padding:16px 18px;margin-bottom:14px;display:flex;align-items:center;gap:14px;">
      <div style="width:46px;height:46px;border-radius:13px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">🚌</div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:3px;">${result.busTicket.route}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);">
          ${isEn ? 'Round Trip' : 'အသွားအပြန်'} · ${result.busTicket.pricePerPax > 0 ? result.busTicket.totalPrice / result.busTicket.pricePerPax : 0} ${isEn ? 'pax' : 'ဦး'}
        </div>
        ${result.busTicket.note ? `<div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:4px;">${result.busTicket.note}</div>` : ''}
      </div>
      <div style="text-align:right;">
        <div style="font-size:20px;font-weight:700;color:#fff;">${formatMMK(result.busTicket.totalPrice)}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.6);">MMK</div>
      </div>
    </div>`

  // ── cost summary ──
  const costSummary = `
    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E5E7EB;font-size:13px;">
        <span style="color:#6B7280;">${isEn ? 'Bus Tickets' : 'ဘတ်စ်ကားလက်မှတ်'}</span>
        <span style="font-weight:600;">${formatMMK(result.busTicket.totalPrice)} MMK</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E5E7EB;font-size:13px;">
        <span style="color:#6B7280;">${isEn ? 'Hotel Estimate' : 'ဟိုတယ်ခန်းမှန်းခြေ'} (${result.days} ${isEn ? 'nights' : 'ညများ'})</span>
        <span style="font-weight:600;">
          ${result.cheapestHotelTotal > 0 ? `${formatMMK(result.cheapestHotelTotal)} MMK` : (isEn ? 'No match' : 'ကိုက်ညီမှုမရှိ')}
        </span>
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:10px;margin-top:4px;">
        <span style="font-size:14px;font-weight:600;">${isEn ? 'Estimated Total' : 'မှန်းခြေစုစုပေါင်း'}</span>
        <span style="font-size:22px;font-weight:700;color:#2D6A4F;">${formatMMK(result.totalCost)} MMK</span>
      </div>
    </div>`

  // ── matched hotels ──
  const hotelsHTML = result.matchedHotels.length === 0
    ? `<p style="font-size:13px;color:#6B7280;background:#F9FAFB;border-radius:8px;padding:16px;">${isEn ? 'No hotels found for your budget.' : 'သင့်ဘတ်ဂျက်အတွက် ဟိုတယ်မတွေ့ပါ'}</p>`
    : result.matchedHotels.map(hotel => {
        const tierStyle = TIER_COLORS[hotel.tier] ?? 'background:#F3F4F6;color:#374151'
        const rooms = hotel.matchedRooms.map(room => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F3F4F6;">
            <div>
              <div style="font-size:13px;color:#6B7280;">${room.roomType}</div>
              <div style="font-size:11px;color:#2D6A4F;margin-top:2px;">
                ${formatMMK(room.pricePerNight)} × ${result.days} ${isEn ? 'nights' : 'ညများ'} = ${formatMMK(room.totalForStay)} MMK
              </div>
            </div>
            <div style="font-size:13px;font-weight:600;margin-left:8px;">${formatMMK(room.pricePerNight)}/${isEn ? 'night' : 'ည'}</div>
          </div>`).join('')

        return `
          <div style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:11px;">
            <div style="display:flex;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #E5E7EB;">
              <div>
                <div style="font-size:15px;font-weight:600;margin-bottom:4px;">${hotel.name}</div>
                <span style="font-size:10px;font-weight:500;padding:3px 9px;border-radius:999px;${tierStyle}">${hotel.tier}</span>
              </div>
              <div style="text-align:right;font-size:12px;color:#9CA3AF;">
                ${isEn ? 'from' : 'မှ'}
                <strong style="display:block;font-size:15px;font-weight:600;color:#2D6A4F;">${formatMMK(hotel.minPrice)} MMK</strong>
              </div>
            </div>
            <div style="padding:8px 16px 14px;">${rooms}</div>
          </div>`
      }).join('')

  // ── day plans ──
  const daysHTML = result.dayPlans.map(day => {
    const activities = day.activities.map((act, i) => `
      <div style="display:flex;gap:12px;${i > 0 ? 'margin-top:12px;' : ''}">
        <span style="font-size:11px;color:#9CA3AF;min-width:46px;padding-top:2px;font-weight:500;">${isEn ? act.time_en : act.time_mm}</span>
        <div>
          <div style="font-size:13px;font-weight:500;margin-bottom:2px;">${isEn ? act.name_en : act.name_mm}</div>
          <div style="font-size:12px;color:#9CA3AF;line-height:1.45;">${isEn ? act.detail_en : act.detail_mm}</div>
        </div>
      </div>`).join('')

    return `
      <div style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:11px;">
        <div style="display:flex;justify-content:space-between;padding:13px 16px;border-bottom:1px solid #E5E7EB;background:#F9FAFB;">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#2D6A4F;">
            ${isEn ? `Day ${day.dayNumber}` : `နေ့ ${day.dayNumber}`}
          </span>
          <span style="font-size:14px;font-weight:600;">${isEn ? day.titleEn : day.titleMm}</span>
        </div>
        <div style="padding:14px 16px;">${activities}</div>
      </div>`
  }).join('')

  // ── full document ──
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${isEn ? `${result.days}-Day ${result.destinationName} Trip` : `${result.days} ရက် ${result.destinationName} ခရီးစဉ်`}</title>
  <style>
    /* Load the same Google Font stack the app uses, including Noto Sans Myanmar */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@300;400;600;700&family=Inter:wght@300;400;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', 'Noto Sans Myanmar', sans-serif;
      color: #111827;
      background: #fff;
      padding: 32px 28px;
      max-width: 680px;
      margin: 0 auto;
    }

    @media print {
      body { padding: 20px; }
      @page { margin: 16mm; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="margin-bottom:18px;">
    <h2 style="font-size:19px;font-weight:600;letter-spacing:-0.35px;margin-bottom:4px;">
      ${isEn
        ? `Your ${result.days}-Day ${result.destinationName} Trip`
        : `သင့် ${result.days} ရက် ${result.destinationName} ခရီးစဉ်`}
    </h2>
    <p style="font-size:13px;color:#6B7280;font-weight:300;">
      ${isEn ? result.travelerLabel.en : result.travelerLabel.mm}
      &nbsp;·&nbsp;
      ${isEn ? result.departureLabel.en : result.departureLabel.mm}
    </p>
  </div>

  ${busCard}
  ${costSummary}

  <h3 style="font-size:16px;font-weight:600;letter-spacing:-0.25px;margin-bottom:12px;">
    ${isEn ? 'Matched Hotels' : 'ကိုက်ညီသောဟိုတယ်များ'}
  </h3>
  ${hotelsHTML}

  <h3 style="font-size:16px;font-weight:600;letter-spacing:-0.25px;margin-bottom:12px;margin-top:8px;">
    ${isEn ? 'Day-by-Day Plan' : 'နေ့တစ်နေ့ချင်းအစီအစဉ်'}
  </h3>
  ${daysHTML}
</body>
</html>`
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Generates the itinerary as a print-preview window.
 *
 * Strategy:
 *  - Build a standalone HTML document with Noto Sans Myanmar embedded via Google Fonts.
 *  - Open it in a new browser window.
 *  - Wait for fonts to load, then trigger window.print() automatically.
 *  - The browser's native Print dialog lets the user "Save as PDF" with
 *    perfect text (no pixel-rasterisation, fully selectable, zero font-encoding bugs).
 *
 * This is the most reliable cross-platform approach for Myanmar Unicode in PDFs.
 */
export async function generateItineraryPDF(result: PlanResult, lang: string): Promise<void> {
  const html = buildPrintHTML(result, lang)

  const printWindow = window.open('', '_blank', 'width=780,height=900')
  if (!printWindow) {
    throw new Error('Pop-up blocked. Please allow pop-ups for this site and try again.')
  }

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()

  // Wait for fonts + layout, then auto-trigger print dialog
  printWindow.addEventListener('load', () => {
    // Give Google Fonts an extra moment to finish rendering
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 800)
  })
}
