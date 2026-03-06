'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, MapPin, Star, Clock } from 'lucide-react'

const TRANSLATIONS = {
  en: {
    nav_destinations: 'Destinations',
    nav_plan: 'Plan Trip',
    nav_signin: 'Sign In',
    hero_line1: 'Plan Your',
    hero_line2: 'Travel Journey',
    hero_sub: "Start planning for free — it's simple",
    hero_cta: 'Start Planning',
    hero_cta2: 'View Destinations',
    featured_label: 'FEATURED DESTINATION',
    featured_name: 'Ngwe Saung Beach',
    featured_desc: "Myanmar's most pristine 20km stretch of beach. Crystal waters, white sand, and untouched natural beauty on the Bay of Bengal.",
    featured_cta: 'Explore Ngwe Saung',
    plan_ai: 'Plan with AI',
    how_title: 'How it works',
    how_sub: 'Your perfect trip in 3 simple steps',
    s1t: 'Pick a destination', s1d: "Choose from Myanmar's best destinations",
    s2t: 'Set days & budget', s2d: 'Tell us how long and your budget in MMK',
    s3t: 'Get your AI itinerary', s3d: 'Gemini AI crafts your perfect day-by-day plan',
    footer: 'AI-powered travel planning for Myanmar.',
    free: 'Free to use', nocard: 'No credit card', mmk: 'MMK pricing',
  },
  mm: {
    nav_destinations: 'ခရီးစဉ်များ',
    nav_plan: 'ခရီးစီစဉ်ရန်',
    nav_signin: 'ဝင်ရောက်ရန်',
    hero_line1: 'သင့်ခရီးစဉ်ကို',
    hero_line2: 'စီစဉ်ပါ',
    hero_sub: 'အခမဲ့ စတင်စီစဉ်ပါ — အလွယ်တကူ',
    hero_cta: 'စတင်စီစဉ်ရန်',
    hero_cta2: 'ခရီးစဉ်များ ကြည့်ရန်',
    featured_label: 'အထူးနေရာ',
    featured_name: 'ငွေဆောင် ကမ်းခြေ',
    featured_desc: 'မြန်မာနိုင်ငံ၏ အသန့်ရှင်းဆုံး ကမ်းခြေ ၂၀ ကီလိုမီတာ။ ဘင်္ဂလားပင်လယ်အော်ရှိ သဘာဝ အလှများ။',
    featured_cta: 'ငွေဆောင် လေ့လာရန်',
    plan_ai: 'AI ဖြင့် စီစဉ်',
    how_title: 'ဘယ်လိုအသုံးပြုမလဲ',
    how_sub: 'ရိုးရှင်းသော အဆင့် ၃ ဆင့်',
    s1t: 'ခရီးစဉ်ရွေးပါ', s1d: 'မြန်မာ၏ အကောင်းဆုံး နေရာများမှ ရွေးချယ်ပါ',
    s2t: 'ရက်နှင့် ဘတ်ဂျက်', s2d: 'ကြာချိန်နှင့် ဘတ်ဂျက် MMK ဖြင့် ထည့်သွင်းပါ',
    s3t: 'AI အစီအစဉ် ရယူပါ', s3d: 'Gemini AI မှ နေ့ဆင့် အစီအစဉ် ရေးဆွဲပေးသည်',
    footer: 'မြန်မာနိုင်ငံအတွက် AI ခရီးစဉ်စီစဉ်မှု။',
    free: 'အခမဲ့', nocard: 'ကတ်မလိုအပ်', mmk: 'MMK ဈေးနှုန်း',
  },
}

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'mm'>('en')
  const t = TRANSLATIONS[lang]

  return (
    <div className="min-h-screen bg-surface text-primary">


      {/* HERO */}
      <section className="pt-16 min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Cream/dark gradient background */}
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-40 bg-blue-200 dark:bg-blue-900/30 -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-30 bg-amber-100 dark:bg-slate-700/30 translate-y-1/4 -translate-x-1/4" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
              <Sparkles className="w-4 h-4" />
              AI-Powered Myanmar Travel Planner
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary leading-tight tracking-tight mb-6">
              {t.hero_line1}<br />
              <span className="text-blue-600 dark:text-blue-400">{t.hero_line2}</span>
            </h1>

            <p className="text-lg sm:text-xl text-secondary mb-10 leading-relaxed max-w-xl">
              {t.hero_sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Link href="/planner"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-base sm:text-lg hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/40 hover:-translate-y-0.5">
                <Sparkles className="w-5 h-5" />{t.hero_cta}
              </Link>

            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-10 text-sm text-muted">
              {[t.free, t.nocard, t.mmk].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED — Ngwe Saung */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-surface-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-blue-500 dark:text-blue-400 uppercase mb-6">{t.featured_label}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-72 sm:h-[420px] shadow-xl shadow-black/10 dark:shadow-black/30">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop"
                alt="Ngwe Saung Beach" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex gap-2">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />4.8
                </div>
                <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700">
                  Ayeyarwady Region
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-5">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">{t.featured_name}</h2>
              <p className="text-base sm:text-lg text-secondary leading-relaxed">{t.featured_desc}</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {['20km Coastline', 'Lover Island', 'Fresh Seafood', 'Water Sports', 'Luxury Resorts', 'Beach Bonfires'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                <Link href="/destinations/ngwesaung"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                  {t.featured_cta}<ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/planner?destination=Ngwe Saung"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-surface-3 text-primary font-semibold rounded-xl border border-card transition-colors text-sm">
                  <Sparkles className="w-4 h-4 text-blue-500" />{t.plan_ai}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">{t.how_title}</h2>
            <p className="text-secondary">{t.how_sub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <MapPin className="w-5 h-5" />, title: t.s1t, desc: t.s1d },
              { step: '02', icon: <Clock className="w-5 h-5" />, title: t.s2t, desc: t.s2d },
              { step: '03', icon: <Sparkles className="w-5 h-5" />, title: t.s3t, desc: t.s3d },
            ].map((item) => (
              <div key={item.step} className="bg-card rounded-2xl p-6 sm:p-8 border border-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-4xl font-bold text-surface-3 dark:text-surface select-none">{item.step}</span>
                </div>
                <h3 className="font-bold text-primary text-lg mb-2">{item.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/planner"
              className="inline-flex items-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/40 hover:-translate-y-0.5">
              <Sparkles className="w-5 h-5" />{t.hero_cta}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-surface-2 border-t border-theme py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-primary">Raizen</span>
            <span className="text-muted text-sm">— {t.footer}</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-secondary">
            <Link href="/destinations" className="hover:text-primary transition-colors">{t.nav_destinations}</Link>
            <Link href="/planner" className="hover:text-primary transition-colors">{t.nav_plan}</Link>
            <Link href="/login" className="hover:text-primary transition-colors">{t.nav_signin}</Link>
          </div>
          <p className="text-muted text-xs">© {new Date().getFullYear()} Raizen 🇲🇲</p>
        </div>
      </footer>
    </div>
  )
}
