import Link from 'next/link'
import { MapPin, Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-stone-950 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                <MapPin className="w-4 h-4 text-stone-900" />
              </div>
              <span className="text-xl font-bold gradient-text">Raizen</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered travel planning for Ngwe Saung Beach, Myanmar. Real hotels, real pricing, zero guesswork.
            </p>
            <Link href="/planner" className="inline-flex items-center gap-2 px-5 py-2.5 gradient-gold text-stone-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all">
              <Sparkles className="w-4 h-4" /> Plan Your Trip
            </Link>
          </div>
          <div>
            <h4 className="font-semibold text-white/60 mb-5 text-xs uppercase tracking-widest">Explore</h4>
            <ul className="space-y-3 text-sm text-white/30">
              <li><Link href="/destinations/ngwesaung" className="hover:text-amber-400 transition-colors">Ngwe Saung Beach</Link></li>
              <li><Link href="/planner" className="hover:text-amber-400 transition-colors">AI Planner</Link></li>
              <li><Link href="/dashboard" className="hover:text-amber-400 transition-colors">My Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/60 mb-5 text-xs uppercase tracking-widest">Account</h4>
            <ul className="space-y-3 text-sm text-white/30">
              <li><Link href="/login" className="hover:text-amber-400 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-amber-400 transition-colors">Register Free</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} Raizen. Built for Myanmar travelers. 🇲🇲</p>
          <p className="text-white/20 text-sm">Powered by Gemini AI</p>
        </div>
      </div>
    </footer>
  )
}
