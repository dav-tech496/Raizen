'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/context/LangContext'
import type { Destination } from '@/types'

interface Props { destination: Destination }

const TAGS = {
  en: ['20km Coastline', 'Water Sports', 'Fresh Seafood', 'Luxury Resorts'],
  mm: ['ကမ်းနံဘေး ၂၀ ကီလိုမီတာ', 'ရေကစားနည်းများ', 'ပင်လယ်စာ', 'ဆည်းဆာ Resort'],
}

export default function FeaturedCard({ destination }: Props) {
  const { lang, t } = useLang()
  const tags = TAGS[lang]
  const imgSrc =
    destination.image_url ??
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85&auto=format&fit=crop'

  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-border shadow-md mt-[18px]">
      {/* Image */}
      <div className="relative h-[210px]">
        <Image
          src={imgSrc}
          alt={destination.name}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <span className="text-xs font-medium bg-black/55 backdrop-blur-[8px] text-white rounded-full px-[11px] py-[5px] border border-white/15">
            {t('availableNow')}
          </span>
          <span className="text-xs font-semibold bg-amber text-white rounded-full px-[11px] py-[5px]">
            ★ 4.8
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-[18px]">
        <div className="text-[11px] font-medium tracking-[0.07em] uppercase text-ink3 mb-1">
          {destination.region ?? (lang === 'mm' ? 'အင်းဝဒေသ' : 'Ayeyarwady Region')}
        </div>
        <div className="text-[19px] font-semibold text-ink tracking-[-0.35px] mb-2">
          {destination.name}
        </div>
        <p className="text-[13px] text-ink2 leading-[1.6] font-light mb-[14px]">
          {destination.description ??
            (lang === 'mm'
              ? 'မြန်မာနိုင်ငံ၏ အသန့်ရှင်းဆုံးသော ကမ်းနံဘေးသဲသွားများ ၂၀ ကီလိုမီတာ'
              : "Myanmar's most pristine 20km stretch of white sand coastline.")}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-[6px] mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-[10px] py-1 rounded-full bg-surface2 text-ink2 border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            href="/planner"
            className="flex-1 bg-green text-white text-[13px] font-semibold py-3 rounded-sm text-center transition-transform active:scale-[0.97]"
          >
            {lang === 'mm' ? 'ဤခရီးစဉ်စီစဉ်ရန်' : 'Plan This Trip'}
          </Link>
          <Link
            href={`/destinations/${destination.slug}`}
            className="px-4 py-3 rounded-sm text-[13px] font-medium text-ink2 border border-border2 transition-colors active:bg-surface2"
          >
            {lang === 'mm' ? 'ကြည့်ရန်' : 'Explore'}
          </Link>
        </div>
      </div>
    </div>
  )
}
