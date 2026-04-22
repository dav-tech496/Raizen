'use client'

import { useState } from 'react'

/**
 * Myanmar phone number regex patterns:
 * - MPT:     09 + 7-8 digits (09 2xxxxxxx, 09 4xxxxxxx, 09 5xxxxxxx, 09 6xxxxxxx, 09 7xxxxxxx, 09 8xxxxxxx, 09 9xxxxxxxx)
 * - Ooredoo: 09 + 7-8 digits (09 7xxxxxxx, 09 96xxxxxxx, 09 97xxxxxxx)
 * - Atom:    09 + 8 digits   (09 420xxxxxxx, 09 780xxxxxxx, 09 250xxxxxxx)
 * - Mytel:   09 + 9 digits   (09 6xxxxxxxx)
 * General pattern covers all: starts with 09, followed by 7–9 digits
 */
const MYANMAR_PHONE_REGEX = /^09\d{7,9}$/

interface Props {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
  placeholder?: string
}

export default function MyanmarPhoneInput({
  value,
  onChange,
  label = 'Phone Number',
  required = false,
  placeholder = '09xxxxxxxxx',
}: Props) {
  const [touched, setTouched] = useState(false)

  const isValid = MYANMAR_PHONE_REGEX.test(value.replace(/\s/g, ''))
  const showError = touched && value.length > 0 && !isValid
  const showSuccess = touched && value.length > 0 && isValid

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits and strip non-numeric except leading 0
    const raw = e.target.value.replace(/[^\d]/g, '')
    onChange(raw)
  }

  return (
    <div className="flex flex-col gap-[6px]">
      {label && (
        <label className="text-xs font-semibold tracking-[0.06em] uppercase text-ink2">
          {label}{required && <span className="text-green ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          required={required}
          maxLength={11}
          className={`
            w-full px-4 py-3 min-h-[44px] rounded-md border text-[15px] text-ink font-light
            bg-surface outline-none transition-all
            placeholder:text-ink3
            ${showError
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : showSuccess
              ? 'border-green focus:ring-2 focus:ring-green/20'
              : 'border-border focus:border-green focus:ring-2 focus:ring-green/15'
            }
          `}
        />
        {/* Status icon */}
        {touched && value.length > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Error / hint */}
      <div className="min-h-[18px]">
        {showError ? (
          <p className="text-[11px] text-red-500 font-medium">
            Please enter a valid Myanmar number (e.g. 09xxxxxxxxx)
          </p>
        ) : (
          <p className="text-[11px] text-ink3 font-light">
            MPT · Ooredoo · Atom · Mytel — starts with 09
          </p>
        )}
      </div>
    </div>
  )
}

/** Standalone validator — import this for server-side / form validation */
export function isValidMyanmarPhone(phone: string): boolean {
  return MYANMAR_PHONE_REGEX.test(phone.replace(/\s/g, ''))
}
