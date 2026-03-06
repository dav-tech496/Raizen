'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, MapPin, Star, Clock, Mail, Globe, Phone } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

const T = {
  en: {
    hero_cta: 'Start Planning',
    hero_cta2: 'View Destinations',
    hero_line1: 'Plan Your',
    hero_line2: 'Travel Journey',
    hero_sub: "Start planning for free — it's simple",
    hero_badge: 'AI-Powered Myanmar Travel Planner',
    featured_label: 'FEATURED DESTINATION',
    featured_name: 'Ngwe Saung Beach',
    featured_region: 'Ayeyarwady Region',
    featured_desc: "Myanmar's most pristine 20km stretch of beach. Crystal waters, white sand, and untouched natural beauty on the Bay of Bengal.",
    featured_cta: 'Explore Ngwe Saung',
    plan_ai: 'Plan with AI',
    how_title: 'How it works',
    how_sub: 'Your perfect trip in 3 simple steps',
    s1t: 'Pick a destination',   s1d: "Choose from Myanmar's best destinations",
    s2t: 'Set days & budget',    s2d: 'Tell us how long and your budget in MMK',
    s3t: 'Get your AI itinerary', s3d: 'Gemini AI crafts your perfect day-by-day plan',
    free: 'Free to use',
    nocard: 'No credit card',
    mmk: 'MMK pricing',
    footer_tagline: 'AI-powered travel planning for Myanmar.',
    footer_nav: 'Navigation',
    footer_contact: 'Contact',
    footer_rights: 'All rights reserved.',
    f_home: 'Home',
    f_dest: 'Destinations',
    f_plan: 'Plan Trip',
    highlights: ['20km Coastline', 'Lover Island', 'Fresh Seafood', 'Water Sports', 'Luxury Resorts', 'Beach Bonfires'],
  },
  mm: {
    hero_cta: 'စတင်စီစဉ်ရန်',
    hero_cta2: 'ခရီးစဉ်များ ကြည့်ရန်',
    hero_line1: 'သင့်ခရီးစဉ်ကို',
    hero_line2: 'စီစဉ်ပါ',
    hero_sub: 'အခမဲ့ စတင်စီစဉ်ပါ — အလွယ်တကူ',
    hero_badge: 'မြန်မာနိုင်ငံ AI ခရီးစဉ်စီစဉ်သူ',
    featured_label: 'အထူးခရီးစဉ်',
    featured_name: 'ငွေဆောင် ကမ်းခြေ',
    featured_region: 'အင်းဝမဒေသ',
    featured_desc: 'မြန်မာနိုင်ငံ၏ အသန့်ရှင်းဆုံး ကမ်းခြေ ၂၀ ကီလိုမီတာ။ ကင်္ဂါလင်ကြည်သောရေ၊ ဖြူသောသဲ နှင့် ဘင်္ဂလားပင်လယ်အော်ရှိ သဘာဝ အလှများ။',
    featured_cta: 'ငွေဆောင် လေ့လာရန်',
    plan_ai: 'AI ဖြင့် စီစဉ်',
    how_title: 'ဘယ်လိုအသုံးပြုမလဲ',
    how_sub: 'ရိုးရှင်းသော အဆင့် ၃ ဆင့်',
    s1t: 'ခရီးစဉ်ရွေးပါ',      s1d: 'မြန်မာ၏ အကောင်းဆုံး နေရာများမှ ရွေးချယ်ပါ',
    s2t: 'ရက်နှင့် ဘတ်ဂျက်',  s2d: 'ကြာချိန်နှင့် ဘတ်ဂျက် MMK ဖြင့် ထည့်သွင်းပါ',
    s3t: 'AI အစီအစဉ် ရယူပါ',  s3d: 'Gemini AI မှ နေ့ဆင့် အစီအစဉ် ရေးဆွဲပေးသည်',
    free: 'အခမဲ့ အသုံးပြုနိုင်',
    nocard: 'ကတ်မလိုအပ်',
    mmk: 'MMK ဈေးနှုန်း',
    footer_tagline: 'မြန်မာနိုင်ငံအတွက် AI ခရီးစဉ်စီစဉ်မှု။',
    footer_nav: 'လမ်းညွှန်',
    footer_contact: 'ဆက်သွယ်ရန်',
    footer_rights: 'မူပိုင်ခွင့် ရှိသည်။',
    f_home: 'မူလစာမျက်နှာ',
    f_dest: 'ခရီးစဉ်များ',
    f_plan: 'ခရီးစီစဉ်ရန်',
    highlights: ['ကမ်းခြေ ၂၀ ကီလို', 'ချစ်သူ ကျွန်း', 'ပင်လယ်ဆိပ်', 'ရေကစားခြင်း', 'လူဇရီ ရစောတ်', 'မီးပုံပွဲ'],
  },
}

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'mm'>('en')
  const t = T[lang]

  return (
    <div className="min-h-screen bg-surface text-primary">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-primary">Raizen</span>
          </Link>

          {/* Right side — language toggle + theme toggle only */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <div className="flex items-center bg-surface-2 border border-theme rounded-full p-0.5">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('mm')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === 'mm' ? 'bg-blue-600 text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
              >
                မြန်မာ
              </button>
            </div>

            {/* Dark/light toggle */}
            <ThemeToggle />

            {/* Plan Trip CTA */}
            <Link
              href="/planner"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Plan Trip' : 'ခရီးစီစဉ်'}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-16 min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-40 bg-blue-200 dark:bg-blue-900/30 -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-30 bg-amber-100 dark:bg-slate-700/30 translate-y-1/4 -translate-x-1/4" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
              <Sparkles className="w-4 h-4" />
              {t.hero_badge}
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary leading-tight tracking-tight mb-6">
              {t.hero_line1}<br />
              <span className="text-blue-600 dark:text-blue-400">{t.hero_line2}</span>
            </h1>

            <p className="text-lg sm:text-xl text-secondary mb-10 leading-relaxed max-w-xl">
              {t.hero_sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/planner"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-base hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/40 hover:-translate-y-0.5">
                <Sparkles className="w-5 h-5" />{t.hero_cta}
              </Link>
              <Link href="/destinations"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-card hover:bg-surface-2 text-primary font-semibold rounded-xl border border-card transition-all text-base hover:-translate-y-0.5">
                {t.hero_cta2}<ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-10 text-sm text-muted">
              {[t.free, t.nocard, t.mmk].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED — Ngwe Saung ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-surface-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-blue-500 dark:text-blue-400 uppercase mb-6">
            {t.featured_label}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-72 sm:h-[420px] shadow-xl shadow-black/10 dark:shadow-black/30">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop"
                alt="Ngwe Saung Beach"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />4.8
                </div>
                <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700">
                  {t.featured_region}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">
                {t.featured_name}
              </h2>
              <p className="text-base sm:text-lg text-secondary leading-relaxed">
                {t.featured_desc}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {t.highlights.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
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

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">{t.how_title}</h2>
            <p className="text-secondary">{t.how_sub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <MapPin className="w-5 h-5" />, title: t.s1t, desc: t.s1d },
              { step: '02', icon: <Clock className="w-5 h-5" />,  title: t.s2t, desc: t.s2d },
              { step: '03', icon: <Sparkles className="w-5 h-5" />, title: t.s3t, desc: t.s3d },
            ].map(item => (
              <div key={item.step} className="bg-card rounded-2xl p-6 sm:p-8 border border-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-4xl font-bold text-surface-3 dark:text-surface-2 select-none">{item.step}</span>
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

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white">
        {/* Top section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <MapPin className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-xl font-bold">Raizen</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t.footer_tagline}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-2xl">🇲🇲</span>
              <span className="text-slate-500 text-xs">Made for Myanmar travelers</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {t.footer_nav}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t.f_home, href: '/' },
                { label: t.f_dest, href: '/destinations' },
                { label: t.f_plan, href: '/planner' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {t.footer_contact}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>hello@raizenmyanmar.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>raizentourism.vercel.app</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+95 9 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} Raizen Myanmar. {t.footer_rights}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-slate-500 text-xs">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
