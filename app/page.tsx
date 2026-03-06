'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, MapPin, Star, Clock } from 'lucide-react'

const TRANSLATIONS = {
  en: {
    nav_destinations: 'Destinations',
    nav_plan: 'Plan Trip',
    nav_signin: 'Sign In',
    hero_headline_1: 'Plan Your',
    hero_headline_2: 'Travel Journey',
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
    step1_title: 'Pick a destination',
    step1_desc: "Choose from Myanmar's best destinations",
    step2_title: 'Set days & budget',
    step2_desc: 'Tell us how long and your budget in MMK',
    step3_title: 'Get your AI itinerary',
    step3_desc: 'Gemini AI crafts your perfect day-by-day plan',
    footer_tagline: 'AI-powered travel planning for Myanmar.',
    free: 'Free to use',
    nocard: 'No credit card needed',
    mmk: 'MMK pricing',
  },
  mm: {
    nav_destinations: 'ခရီးစဉ်များ',
    nav_plan: 'ခရီးစီစဉ်ရန်',
    nav_signin: 'ဝင်ရောက်ရန်',
    hero_headline_1: 'သင့်ခရီးစဉ်ကို',
    hero_headline_2: 'စီစဉ်ပါ',
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
    step1_title: 'ခရီးစဉ်ရွေးပါ',
    step1_desc: 'မြန်မာ၏ အကောင်းဆုံး နေရာများမှ ရွေးချယ်ပါ',
    step2_title: 'ရက်နှင့် ဘတ်ဂျက်',
    step2_desc: 'ကြာချိန်နှင့် ဘတ်ဂျက် MMK ဖြင့် ထည့်သွင်းပါ',
    step3_title: 'AI အစီအစဉ် ရယူပါ',
    step3_desc: 'Gemini AI မှ နေ့ဆင့် အစီအစဉ် ရေးဆွဲပေးသည်',
    footer_tagline: 'မြန်မာနိုင်ငံအတွက် AI ခရီးစဉ်စီစဉ်မှု။',
    free: 'အခမဲ့ အသုံးပြုနိုင်',
    nocard: 'ကတ်မလိုအပ်',
    mmk: 'MMK ဈေးနှုန်း',
  },
}

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'mm'>('en')
  const t = TRANSLATIONS[lang]

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Raizen</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/destinations" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              {t.nav_destinations}
            </Link>
            <Link href="/planner" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              {t.nav_plan}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-full p-1">
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                EN
              </button>
              <button onClick={() => setLang('mm')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'mm' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                မြန်မာ
              </button>
            </div>
            <Link href="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              {t.nav_signin}
            </Link>
            <Link href="/planner" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <Sparkles className="w-4 h-4" />
              {t.nav_plan}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Myanmar Travel Planner
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
              {t.hero_headline_1}<br />
              <span className="text-blue-600">{t.hero_headline_2}</span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 leading-relaxed">{t.hero_sub}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/planner" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-lg hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5">
                <Sparkles className="w-5 h-5" />
                {t.hero_cta}
              </Link>
              <Link href="/destinations" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all text-lg hover:border-blue-200 hover:-translate-y-0.5">
                {t.hero_cta2}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-12 text-sm text-slate-400">
              {[t.free, t.nocard, t.mmk].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED — Ngwe Saung */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-6">{t.featured_label}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden h-[420px] shadow-xl shadow-slate-200">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop" alt="Ngwe Saung Beach" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent" />
              <div className="absolute bottom-6 left-6 flex gap-2">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />4.8
                </div>
                <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700">
                  Ayeyarwady Region
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{t.featured_name}</h2>
              <p className="text-lg text-slate-500 leading-relaxed">{t.featured_desc}</p>
              <div className="grid grid-cols-2 gap-3">
                {['20km Coastline', 'Lover Island', 'Fresh Seafood', 'Water Sports', 'Luxury Resorts', 'Beach Bonfires'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Link href="/destinations/ngwesaung" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                  {t.featured_cta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/planner?destination=Ngwe Saung" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
                  <Sparkles className="w-4 h-4 text-blue-500" />{t.plan_ai}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t.how_title}</h2>
            <p className="text-slate-500">{t.how_sub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <MapPin className="w-6 h-6" />, title: t.step1_title, desc: t.step1_desc },
              { step: '02', icon: <Clock className="w-6 h-6" />, title: t.step2_title, desc: t.step2_desc },
              { step: '03', icon: <Sparkles className="w-6 h-6" />, title: t.step3_title, desc: t.step3_desc },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-4xl font-bold text-slate-100">{item.step}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/planner" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5">
              <Sparkles className="w-5 h-5" />{t.hero_cta}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-lg">Raizen</span>
            <span className="text-slate-400 text-sm ml-2">— {t.footer_tagline}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/destinations" className="hover:text-white transition-colors">{t.nav_destinations}</Link>
            <Link href="/planner" className="hover:text-white transition-colors">{t.nav_plan}</Link>
            <Link href="/login" className="hover:text-white transition-colors">{t.nav_signin}</Link>
          </div>
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Raizen 🇲🇲</p>
        </div>
      </footer>
    </div>
  )
}
