'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Menu, X, LayoutDashboard } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => { listener.subscription.unsubscribe(); window.removeEventListener('scroll', handleScroll) }
  }, [])

  const links = [
    { href: '/destinations', label: 'Destinations' },
    { href: '/planner', label: 'Planner' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-stone-950/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <MapPin className="w-6 h-6 text-amber-400" />
          <span className="gradient-text">Raizen</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-amber-400 ${pathname === link.href ? 'text-amber-400' : 'text-stone-300'}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
              <LayoutDashboard className="w-4 h-4" />Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-stone-300 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm transition-colors">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-stone-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-stone-950/95 backdrop-blur-md border-b border-white/5 px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2 text-stone-300 hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {user ? (
              <Link href="/dashboard" className="block py-2 text-amber-400 font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-stone-300" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="block py-2 text-amber-400 font-medium" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
