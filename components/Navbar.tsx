'use client'

interface NavbarProps {
  onMenuOpen: () => void
}

export default function Navbar({ onMenuOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-[200] h-[58px] flex items-center justify-between px-[18px] bg-bg/93 backdrop-blur-[14px] border-b border-border no-print">
      {/* Logo */}
      <a href="/" className="flex items-center gap-[9px]">
        <div className="w-8 h-8 rounded-[10px] bg-green flex items-center justify-center flex-shrink-0">
          <svg
            width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-[17px] font-semibold tracking-[-0.4px] text-ink">Raizen</span>
      </a>

      {/* Hamburger — 3 equal lines */}
      <button
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        className="w-10 h-10 rounded-[10px] bg-surface2 border border-border flex flex-col items-center justify-center gap-[5px] transition-colors active:bg-border"
      >
        <span className="block w-[18px] h-[1.8px] bg-ink rounded-sm" />
        <span className="block w-[18px] h-[1.8px] bg-ink rounded-sm" />
        <span className="block w-[18px] h-[1.8px] bg-ink rounded-sm" />
      </button>
    </header>
  )
}
