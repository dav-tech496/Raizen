'use client'

interface Props { message: string }

export default function LoadingOverlay({ message }: Props) {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-[14px] bg-bg/92 backdrop-blur-[6px]">
      <div className="w-[38px] h-[38px] rounded-full border-[3px] border-border2 border-t-green animate-spin" />
      <p className="text-sm text-ink2">{message}</p>
    </div>
  )
}
