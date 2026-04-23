'use client'
import type React from 'react'

/**
 * SkeletonLoader — reusable Tailwind pulse skeleton
 * Used during Supabase data fetching to prevent layout shifts.
 */

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

function Bone({ className = '', style }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface2 rounded-md ${className}`} style={style} />
  )
}

/** Skeleton for a destination card */
export function DestinationCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-md">
      {/* Image placeholder */}
      <Bone className="w-full aspect-[16/9] rounded-none" />
      <div className="p-[18px] flex flex-col gap-3">
        {/* Region + name */}
        <Bone className="h-3 w-1/3" />
        <Bone className="h-5 w-2/3" />
        {/* Description lines */}
        <div className="flex flex-col gap-2">
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-4/5" />
        </div>
        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {[80, 100, 70, 90].map((w, i) => (
            <Bone key={i} className={`h-6 rounded-full`} style={{ width: w }} />
          ))}
        </div>
        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <Bone className="h-11 flex-1 rounded-sm" />
          <Bone className="h-11 w-24 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton for a list row / coming-soon card */
export function RowSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-md p-4 flex items-center gap-[14px] shadow-sm">
      <Bone className="w-12 h-12 rounded-[13px] flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Bone className="h-4 w-1/2" />
        <Bone className="h-3 w-1/3" />
        <Bone className="h-5 w-20 rounded-full" />
      </div>
    </div>
  )
}

/** Full page skeleton for destinations page */
export function DestinationsPageSkeleton() {
  return (
    <div className="px-[18px] pt-6 pb-4 flex flex-col gap-4">
      <Bone className="h-3 w-28" />
      <DestinationCardSkeleton />
      <Bone className="h-3 w-24 mt-4" />
      {[0, 1, 2].map((i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  )
}

export default Bone
