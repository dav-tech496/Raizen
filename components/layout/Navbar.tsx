'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Menu, X, LayoutDashboard, LogOut, Sparkles } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => { subscription.unsubscribe(); window.removeEventListener('scroll', handleScroll) }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/destinations/ngwesaung', label: 'Ngwe Saung' },
    { href: '/planner', label: 'AI Planner' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-stone-950/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
            <MapPin className="w-4 h-4 text-stone-900" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Raizen</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-amber-400 ${
                pathname === link.href ? 'text-amber-400' : 'text-white/60'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-red-400 text-sm transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/planner"
                className="flex items-center gap-2 px-5 py-2.5 gradient-gold text-stone-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all">
                <Sparkles className="w-4 h-4" />
                Plan Trip
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-stone-950/98 backdrop-blur-xl border-b border-white/5 px-6 py-5 space-y-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className="block text-white/70 hover:text-amber-400 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 space-y-3">
            {user ? (
              <>
                <Link href="/dashboard" className="block text-amber-400 font-semibold" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="block text-red-400 text-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-white/60" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="block text-amber-400 font-semibold" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
