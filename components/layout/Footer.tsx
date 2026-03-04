import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-stone-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-amber-400" />
              <span className="text-xl font-bold gradient-text">Raizen</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Myanmar Travel Brain — AI-powered itinerary planning for the Land of Golden Pagodas.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/destinations" className="hover:text-amber-400 transition-colors">Destinations</Link></li>
              <li><Link href="/planner" className="hover:text-amber-400 transition-colors">AI Planner</Link></li>
              <li><Link href="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/login" className="hover:text-amber-400 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-amber-400 transition-colors">Register Free</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 text-center text-stone-600 text-sm">
          © {new Date().getFullYear()} Raizen. Built for Myanmar travelers. 🇲🇲
        </div>
      </div>
    </footer>
  )
}
