'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/context/LangContext'
import type { Destination } from '@/types'

interface Props {
  destination: Destination
}

export default function FeaturedCard({ destination }: Props) {
  const { lang } = useLang()

  const imgSrc =
    destination.image_url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85&auto=format&fit=crop'

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-md mt-[14px] flex flex-col">
      <div className="relative aspect-[16/9]">
        <Image
          src={imgSrc}
          alt={destination.name}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
          priority
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-[14px] left-4">
          <div className="text-[11px] text-white/65 uppercase tracking-[0.05em] mb-[3px]">
            {destination.region ?? (lang === 'mm' ? 'အင်းဝဒေသ' : 'Ayeyarwady Region')}
          </div>
          <div className="text-xl font-semibold text-white tracking-[-0.3px]">
            {destination.name}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold bg-amber text-white rounded-full px-[11px] py-[5px]">
            ★ 4.8
          </span>
        </div>
      </div>

      <div className="p-[18px] flex flex-col flex-1">
        {/* line-clamp-3 ensures uniform card height regardless of description length */}
        <p className="text-[13px] text-ink2 leading-[1.6] font-light mb-[14px] line-clamp-3">
          {destination.description ??
            (lang === 'mm'
              ? 'ပင်လယ်ကွေ့တွင် မထိတွေ့ရသောသဲဖြူ ကမ်းနံဘေး ၂၀ ကီလိုမီတာ'
              : 'A 20km stretch of untouched white sand on the Bay of Bengal.')}
        </p>

        <div className="flex flex-wrap gap-[6px] mb-4">
          {(lang === 'mm'
            ? ['ကမ်းနံဘေး', 'ညဦး ၂–၇', 'ရေကစားနည်း', 'ပင်လယ်စာ']
            : ['Beach', '2–7 nights', 'Water Sports', 'Seafood']
          ).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-[10px] py-1 rounded-full bg-surface2 text-ink2 border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            href="/planner"
            className="flex-1 bg-green text-white text-[13px] font-semibold py-3 min-h-[44px] rounded-sm text-center transition-opacity active:opacity-80 flex items-center justify-center"
          >
            {lang === 'mm' ? 'ဤခရီးစဉ်စီစဉ်ရန်' : 'Plan This Trip'}
          </Link>
          <Link
            href={`/destinations/${destination.slug}`}
            className="px-4 py-3 min-h-[44px] rounded-sm text-[13px] font-medium text-ink2 border border-border2 transition-colors active:bg-surface2 flex items-center"
          >
            {lang === 'mm' ? 'အသေးစိတ်' : 'Full Details'}
          </Link>
        </div>
      </div>
    </div>
  )
}
