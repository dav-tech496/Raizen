'use client'

interface Props {
  message: string
}

export default function LoadingOverlay({ message }: Props) {
  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-bg/90 backdrop-blur-[6px]">
      {/* Spinner */}
      <div className="relative w-14 h-14 mb-6">
        <div className="absolute inset-0 rounded-full border-[3px] border-green/20" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-green animate-spin" />
        <div className="absolute inset-[10px] rounded-full bg-green-pale flex items-center justify-center">
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="#2D6A4F" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {/* Message */}
      <p className="text-[15px] font-medium text-ink tracking-[-0.2px] text-center px-8 animate-fade-in">
        {message}
      </p>
      <p className="text-[12px] text-ink3 mt-2 font-light">Raizen</p>
    </div>
  )
}
