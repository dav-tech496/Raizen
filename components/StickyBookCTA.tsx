'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useLang } from '@/context/LangContext'

interface StickyBookCTAProps {
  /** The element ref to watch — CTA shows after scrolling past this */
  heroRef: React.RefObject<HTMLElement | null>
}

/**
 * StickyBookCTA — mobile-only "Book Now" sticky footer button.
 * Appears after the user scrolls past the Hero section.
 * Hidden on md+ screens (desktop has inline CTAs).
 */
export default function StickyBookCTA({ heroRef }: StickyBookCTAProps) {
  const [visible, setVisible] = useState(false)
  const { lang } = useLang()

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const heroBottom = heroRef.current.getBoundingClientRect().bottom
      setVisible(heroBottom < 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [heroRef])

  return (
    <div
      className={`
        fixed bottom-[70px] left-0 right-0 z-[150] flex justify-center
        px-4 transition-all duration-300 md:hidden no-print
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <Link
        href="/planner"
        className="w-full max-w-[420px] bg-green text-white text-[15px] font-semibold py-[14px] min-h-[50px] rounded-md text-center shadow-lg flex items-center justify-center gap-2 active:opacity-85 transition-opacity"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {lang === 'mm' ? 'ယခုဘွတ်ကင်လုပ်ရန်' : 'Book Now — Free'}
      </Link>
    </div>
  )
}
