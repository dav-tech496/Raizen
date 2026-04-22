'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/context/LangContext'
import Navbar from '@/components/Navbar'
import Drawer from '@/components/Drawer'
import BottomNav from '@/components/BottomNav'

export default function LoginForm() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useLang()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <>
      <Navbar onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />

      <main className="w-full max-w-screen-sm mx-auto px-4 pb-[90px] pt-8 overflow-x-hidden">
        <h1 className="text-[26px] font-semibold text-ink tracking-[-0.5px] mb-2">{t('loginTitle')}</h1>
        <p className="text-sm text-ink2 font-light mb-8">{t('loginSub')}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
              {t('email')}
            </label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-[14px] min-h-[44px] text-sm text-ink bg-surface border-[1.5px] border-border2 rounded-md outline-none focus:border-green focus:shadow-[0_0_0_3px_rgba(185,28,28,.12)] transition-[border-color,box-shadow]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-ink2 mb-[9px]">
              {t('password')}
            </label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-[14px] min-h-[44px] text-sm text-ink bg-surface border-[1.5px] border-border2 rounded-md outline-none focus:border-green focus:shadow-[0_0_0_3px_rgba(185,28,28,.12)] transition-[border-color,box-shadow]"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-green text-white text-[15px] font-semibold py-4 min-h-[44px] rounded-md shadow-[0_4px_18px_rgba(185,28,28,.28)] disabled:opacity-70 transition-opacity active:scale-[0.98]"
          >
            {loading ? t('loggingIn') : t('loginBtn')}
          </button>
        </form>

        <p className="text-sm text-ink2 text-center mt-6">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-green font-medium">{t('signUpLink')}</Link>
        </p>
      </main>

      <BottomNav />
    </>
  )
}
