'use client'

import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function EmptyState({
  title = 'No trips found',
  description = "We couldn't find any destinations. Check back soon — more are being added!",
  ctaLabel = 'Plan a Trip',
  ctaHref = '/planner',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-pale flex items-center justify-center mb-5">
        <svg
          width="36" height="36" viewBox="0 0 24 24"
          fill="none" stroke="#B91C1C" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="10" r="3" />
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" />
        </svg>
      </div>
      <h3 className="text-[18px] font-semibold text-ink tracking-[-0.3px] mb-2">{title}</h3>
      <p className="text-[13px] text-ink2 leading-[1.6] font-light max-w-[260px] mb-6">{description}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 bg-green text-white text-[13px] font-semibold px-6 py-3 min-h-[44px] rounded-sm transition-opacity active:opacity-80"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
