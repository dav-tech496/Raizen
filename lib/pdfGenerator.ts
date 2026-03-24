// lib/pdfGenerator.ts
// Generates a properly formatted A4 PDF using jsPDF.
// Dynamically imported to avoid SSR issues.
// Run: npm install jspdf

import type { PlanResult } from '@/types'
import type { Lang } from '@/types'

export async function generateItineraryPDF(result: PlanResult, lang: Lang): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const isEn = lang !== 'mm'

  // ─── Palette ─────────────────────────────────────────────────
  const GREEN       = [45,  106, 79]  as RGB
  const GREEN_PALE  = [216, 243, 220] as RGB
  const GREEN_LIGHT = [200, 230, 210] as RGB
  const INK         = [28,  28,  26]  as RGB
  const INK2        = [92,  90,  85]  as RGB
  const INK3        = [154, 152, 144] as RGB
  const WHITE       = [255, 255, 255] as RGB
  const BORDER      = [226, 223, 216] as RGB
  const AMBER_PALE  = [254, 243, 199] as RGB
  const AMBER_TXT   = [146, 64,  14]  as RGB
  const SURFACE2    = [239, 237, 232] as RGB

  type RGB = [number, number, number]

  const PAGE_W = 210
  const MARGIN = 16
  const CONTENT = PAGE_W - MARGIN * 2
  let y = 0

  // ─── Helpers ─────────────────────────────────────────────────

  const fmt = (n: number) => n.toLocaleString('en-US')

  function newPage() { doc.addPage(); y = MARGIN }
  function checkBreak(needed: number) { if (y + needed > 280) newPage() }

  function fc(rgb: RGB) { doc.setFillColor(rgb[0], rgb[1], rgb[2]) }
  function tc(rgb: RGB) { doc.setTextColor(rgb[0], rgb[1], rgb[2]) }
  function dc(rgb: RGB) { doc.setDrawColor(rgb[0], rgb[1], rgb[2]) }

  function filledRect(x: number, yp: number, w: number, h: number, fill: RGB, r = 0) {
    fc(fill); dc(fill); doc.setLineWidth(0)
    r > 0 ? doc.roundedRect(x, yp, w, h, r, r, 'F') : doc.rect(x, yp, w, h, 'F')
  }
  function strokeRect(x: number, yp: number, w: number, h: number, stroke: RGB, r = 0, lw = 0.3) {
    dc(stroke); doc.setLineWidth(lw)
    r > 0 ? doc.roundedRect(x, yp, w, h, r, r, 'S') : doc.rect(x, yp, w, h, 'S')
  }
  function hLine(yp: number, col: RGB = BORDER) {
    dc(col); doc.setLineWidth(0.25); doc.line(MARGIN, yp, PAGE_W - MARGIN, yp)
  }
  function txt(s: string, x: number, yp: number, opts?: { align?: 'left'|'center'|'right'; maxWidth?: number }) {
    doc.text(s, x, yp, opts)
  }
  function badge(label: string, x: number, yp: number, bg: RGB, fg: RGB) {
    doc.setFontSize(6.5); tc(fg)
    const w = doc.getTextWidth(label) + 5
    filledRect(x, yp - 3, w, 4.5, bg, 1.2)
    txt(label, x + 2.5, yp)
    return w
  }

  // ─── HEADER ──────────────────────────────────────────────────
  filledRect(0, 0, PAGE_W, 26, GREEN)
  doc.setFontSize(14); doc.setFont('helvetica', 'bold'); tc(WHITE)
  txt('Raizen', MARGIN + 2, 13)
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); tc(GREEN_LIGHT)
  txt('Myanmar Travel Planner', MARGIN + 2, 19)
  doc.setFontSize(7); tc(GREEN_LIGHT)
  txt(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), PAGE_W - MARGIN, 12, { align: 'right' })
  txt('raizentourism.vercel.app', PAGE_W - MARGIN, 18, { align: 'right' })

  y = 34

  // ─── TITLE ───────────────────────────────────────────────────
  const title = isEn
    ? `${result.days}-Day ${result.destinationName} Trip`
    : `${result.days} ရက် ${result.destinationName} ခရီးစဉ်`

  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); tc(INK)
  txt(title, MARGIN, y); y += 6

  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); tc(INK2)
  txt(
    `${isEn ? result.travelerLabel.en : result.travelerLabel.mm}  ·  ${isEn ? result.departureLabel.en : result.departureLabel.mm}`,
    MARGIN, y
  ); y += 8

  hLine(y); y += 7

  // ─── BUS TICKET ──────────────────────────────────────────────
  checkBreak(32)
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(GREEN)
  txt(isEn ? 'BUS TICKET' : 'ဘတ်စ်ကားလက်မှတ်', MARGIN, y); y += 5

  filledRect(MARGIN, y, CONTENT, 22, GREEN, 3)

  doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); tc(WHITE)
  txt('BUS', MARGIN + 5, y + 10)

  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); tc(WHITE)
  txt(result.busTicket.route, MARGIN + 19, y + 8)

  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal')
  tc([200, 230, 210] as RGB)
  const paxCount = result.busTicket.pricePerPax > 0
    ? result.busTicket.totalPrice / result.busTicket.pricePerPax
    : 0
  txt(
    isEn ? `Bus Ticket (Round Trip) · ${paxCount} pax` : `ဘတ်စ်ကား (Round Trip) · ${paxCount} ဦး`,
    MARGIN + 19, y + 14
  )

  if (result.busTicket.note) {
    doc.setFontSize(6.5); tc([170, 210, 185] as RGB)
    txt(result.busTicket.note, MARGIN + 19, y + 19)
  }

  doc.setFontSize(13); doc.setFont('helvetica', 'bold'); tc(WHITE)
  txt(`${fmt(result.busTicket.totalPrice)} MMK`, PAGE_W - MARGIN - 2, y + 9, { align: 'right' })
  doc.setFontSize(7); doc.setFont('helvetica', 'normal')
  tc([200, 230, 210] as RGB)
  txt(`${fmt(result.busTicket.pricePerPax)} × ${paxCount} pax`, PAGE_W - MARGIN - 2, y + 15, { align: 'right' })

  y += 28

  // ─── COST SUMMARY ────────────────────────────────────────────
  checkBreak(38)
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(GREEN)
  txt(isEn ? 'COST SUMMARY' : 'ကုန်ကျမှုအကျဉ်း', MARGIN, y); y += 5

  strokeRect(MARGIN, y, CONTENT, 30, BORDER, 3)

  const costRows = [
    {
      label: isEn ? 'Bus Tickets (round trip)' : 'ဘတ်စ်ကားလက်မှတ်',
      value: `${fmt(result.busTicket.totalPrice)} MMK`,
    },
    {
      label: isEn ? `Hotel (${result.days} nights, cheapest match)` : `ဟိုတယ် (${result.days} ညဦး)`,
      value: result.cheapestHotelTotal > 0
        ? `${fmt(result.cheapestHotelTotal)} MMK`
        : (isEn ? 'No match' : 'ကိုက်ညီမှုမရှိ'),
    },
  ]

  costRows.forEach((row, i) => {
    const ry = y + 7 + i * 9
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(INK2)
    txt(row.label, MARGIN + 4, ry)
    doc.setFont('helvetica', 'bold'); tc(INK)
    txt(row.value, PAGE_W - MARGIN - 4, ry, { align: 'right' })
    if (i < costRows.length - 1) hLine(ry + 4, BORDER)
  })

  const totalY = y + 22
  filledRect(MARGIN, totalY, CONTENT, 9, GREEN_PALE, 2)
  doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); tc(GREEN)
  txt(isEn ? 'Estimated Minimum Total' : 'မှန်းဆကုန်ကျမှု (ထိပ်ဆုံး)', MARGIN + 4, totalY + 6)
  doc.setFontSize(11); tc(GREEN)
  txt(`${fmt(result.totalCost)} MMK`, PAGE_W - MARGIN - 4, totalY + 6, { align: 'right' })

  y += 38

  // ─── HOTELS ──────────────────────────────────────────────────
  checkBreak(18)
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(GREEN)
  txt(isEn ? 'MATCHED HOTELS FOR YOUR BUDGET' : 'ဘတ်ဂျက်နှင့် ကိုက်ညီသောဟိုတယ်များ', MARGIN, y)
  y += 5

  if (result.matchedHotels.length === 0) {
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); tc(INK3)
    txt(isEn ? 'No hotels found within this budget.' : 'ဘတ်ဂျက်နှင့်ကိုက်ညီသောဟိုတယ်မတွေ့ပါ', MARGIN, y)
    y += 8
  } else {
    for (const hotel of result.matchedHotels) {
      const hh = 13 + hotel.matchedRooms.length * 8 + 4
      checkBreak(hh)

      strokeRect(MARGIN, y, CONTENT, hh, BORDER, 3)
      filledRect(MARGIN, y, CONTENT, 13, SURFACE2, 3)
      hLine(y + 13, BORDER)

      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); tc(INK)
      txt(hotel.name, MARGIN + 4, y + 9)

      const badgeX = MARGIN + 4 + doc.getTextWidth(hotel.name) + 4
      badge(hotel.tier, badgeX, y + 9, AMBER_PALE, AMBER_TXT)

      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); tc(INK3)
      txt(isEn ? 'From' : 'မှ', PAGE_W - MARGIN - 4, y + 6, { align: 'right' })
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); tc(GREEN)
      txt(`${fmt(hotel.minPrice)} MMK`, PAGE_W - MARGIN - 4, y + 11, { align: 'right' })

      let ry = y + 17
      hotel.matchedRooms.forEach((room, ri) => {
        doc.setFontSize(8); doc.setFont('helvetica', 'normal'); tc(INK2)
        txt(room.roomType, MARGIN + 4, ry)
        doc.setFont('helvetica', 'bold'); tc(INK)
        txt(`${fmt(room.pricePerNight)}/night`, PAGE_W - MARGIN - 4, ry, { align: 'right' })
        doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); tc(GREEN)
        txt(
          `${fmt(room.pricePerNight)} × ${result.days} nights = ${fmt(room.totalForStay)} MMK`,
          PAGE_W - MARGIN - 4, ry + 4, { align: 'right' }
        )
        if (ri < hotel.matchedRooms.length - 1) hLine(ry + 5.5, BORDER)
        ry += 8
      })

      y += hh + 4
    }
  }

  y += 2

  // ─── DAY PLANS ───────────────────────────────────────────────
  checkBreak(18)
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(GREEN)
  txt(isEn ? 'DAY-BY-DAY PLAN' : 'နေ့တိုင်းအစီအစဉ်', MARGIN, y)
  y += 5

  for (const day of result.dayPlans) {
    const actCount = day.activities.length
    const dh = 12 + actCount * 13 + 4
    checkBreak(dh)

    strokeRect(MARGIN, y, CONTENT, dh, BORDER, 3)
    filledRect(MARGIN, y, CONTENT, 10, GREEN_PALE, 3)
    hLine(y + 10, [180, 220, 190] as RGB)

    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(GREEN)
    txt(isEn ? `Day ${day.dayNumber}` : `နေ့ ${day.dayNumber}`, MARGIN + 4, y + 7)

    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); tc(INK)
    txt(isEn ? day.titleEn : day.titleMm, MARGIN + 22, y + 7)

    let ay = y + 15
    day.activities.forEach((act) => {
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); tc(INK3)
      txt(isEn ? act.time_en : act.time_mm, MARGIN + 4, ay)

      doc.setFont('helvetica', 'bold'); tc(INK)
      txt(isEn ? act.name_en : act.name_mm, MARGIN + 21, ay)

      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); tc(INK3)
      const detail = isEn ? act.detail_en : act.detail_mm
      const lines  = doc.splitTextToSize(detail, CONTENT - 25)
      txt(lines[0] ?? '', MARGIN + 21, ay + 4.5)

      ay += 13
    })

    y += dh + 4
  }

  // ─── FOOTER ──────────────────────────────────────────────────
  checkBreak(14)
  y += 4; hLine(y, BORDER); y += 5
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); tc(INK3)
  txt('Raizen Myanmar  ·  raizentourism.vercel.app  ·  vibeauto3@gmail.com', PAGE_W / 2, y, { align: 'center' })
  y += 4; tc(GREEN_LIGHT)
  txt(isEn ? 'Generated with Raizen — Real MMK Prices, Real Hotels.' : 'Raizen ဖြင့် ဖန်တီးထားသည်', PAGE_W / 2, y, { align: 'center' })

  // ─── Page numbers ─────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); tc(INK3)
    txt(`${i} / ${totalPages}`, PAGE_W - MARGIN, 292, { align: 'right' })
  }

  const filename = `Raizen_${result.destinationName.replace(/\s/g, '_')}_${result.days}Day_Trip.pdf`
  doc.save(filename)
}
