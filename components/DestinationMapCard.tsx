'use client'

// components/DestinationMapCard.tsx
// Shared compact map card — used by both DestinationDetailClient and ResultCard.

import { useLang } from '@/context/LangContext'
import { DESTINATION_CONFIG } from '@/app/destinations/[slug]/config'

interface Props {
  /** destination slug, e.g. 'ngwesaung' or 'chaung-thar' */
  slug: string
}

export default function DestinationMapCard({ slug }: Props) {
  const { lang } = useLang()
  const config = DESTINATION_CONFIG[slug]

  if (!config) return null

  const embedSrc = config.mapQuery.includes('Ngwe')
    ? 'https://www.openstreetmap.org/export/embed.html?bbox=94.9,16.8,95.2,17.1&layer=mapnik&marker=16.942,95.062'
    : 'https://www.openstreetmap.org/export/embed.html?bbox=94.4,17.8,94.7,18.0&layer=mapnik&marker=17.869,94.564'

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Map thumbnail — lightweight OSM iframe, clipped to a fixed height */}
      <div className="relative h-[110px] w-full overflow-hidden pointer-events-none">
        <iframe
          src={embedSrc}
          title="Location map"
          className="absolute inset-0 w-full h-full border-0 scale-[1.02]"
          loading="lazy"
          aria-hidden="true"
        />
        {/* slight top fade so it blends into the card */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/30 to-transparent pointer-events-none" />
      </div>

      {/* Bottom row: label + CTA */}
      <div className="flex items-center justify-between px-4 py-[11px] border-t border-border">
        <div className="flex items-center gap-[8px] min-w-0">
          {/* Map pin icon */}
          <span className="flex-shrink-0 w-[28px] h-[28px] rounded-full bg-green-pale flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-ink leading-tight truncate">
              {config.locationLabel}
            </p>
            <p className="text-[10px] text-ink3 leading-tight mt-[1px]">
              {lang === 'mm' ? 'မြေပုံတွင်ကြည့်ရန်' : 'View on map'}
            </p>
          </div>
        </div>

        <a
          href={config.mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Get directions to ${config.locationLabel}`}
          className="flex-shrink-0 flex items-center gap-[5px] bg-green text-white text-[11px] font-semibold px-[12px] py-[7px] rounded-lg active:opacity-80 transition-opacity shadow-sm"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          {lang === 'mm' ? 'လမ်းညွှန်' : 'Directions'}
        </a>
      </div>
    </div>
  )
}
