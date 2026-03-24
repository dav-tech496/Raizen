'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/context/LangContext'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'

export default function RegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useLang()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="max-w-[480px] mx-auto px-[18px] pt-20 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-semibold text-ink mb-2">Check your email</h2>
        <p className="text-sm text-ink2 font-light mb-6">
          We sent a confirmation link to <strong>{email}</strong>
        </p>
        <Link href="/login" className="text-green font-medium text-sm">{t('signInLink')}</Link>
      </div>
    )
  }

  const fields = [
    { label: t('fullName'),        value: fullName,  set: setFullName,  type: 'text' },
    { label: t('email'),           value: email,     set: setEmail,     type: 'email' },
    { label: t('password'),        value: password,  set: setPassword,  type: 'password' },
    { label: t('confirmPassword'), value: confirm,   set: setConfirm,   type: 'password' },
  ]

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="max-w-[480px] mx-auto px-[18px] pb-[90px] pt-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-[-0.5px] mb-2">{t('registerTitle')}</h1>
        <p className="text-sm text-ink2 font-light mb-8">{t('registerSub')}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map(({ label, value, set, type }) => (
            <div key={label}>
              <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
                {label}
              </label>
              <input
                type={type} required value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full px-4 py-[14px] text-sm text-ink bg-surface border-[1.5px] border-border2 rounded-md outline-none focus:border-green focus:shadow-[0_0_0_3px_rgba(45,106,79,.12)] transition-[border-color,box-shadow]"
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-green text-white text-[15px] font-semibold py-4 rounded-md shadow-[0_4px_18px_rgba(45,106,79,.32)] disabled:opacity-70 transition-opacity"
          >
            {loading ? t('registering') : t('registerBtn')}
          </button>
        </form>

        <p className="text-sm text-ink2 text-center mt-6">
          {t('haveAccount')}{' '}
          <Link href="/login" className="text-green font-medium">{t('signInLink')}</Link>
        </p>
      </main>

      <BottomNav />
    </>
  )
}
