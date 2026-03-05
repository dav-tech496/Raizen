'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Wrong email or password. Please try again.'
        : error.message)
      setLoading(false)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
            <MapPin className="w-5 h-5 text-stone-900" />
          </div>
          <span className="text-xl font-bold gradient-text">Raizen</span>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
        <p className="text-white/50">Sign in to access your saved itineraries</p>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/60 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="input-field pr-12" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 gradient-gold text-stone-900 font-bold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-white/40 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 glass-card rounded-2xl p-4 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <p className="text-white/40 text-sm">Save unlimited itineraries and access them from any device.</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <Suspense fallback={<div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
