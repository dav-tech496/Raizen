'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, MapPin, Star, Clock, Mail, Globe, Phone, Zap, Shield, Users } from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'

const T = {
  en: {
    hero_eyebrow: 'AI-Powered Travel Planning',
    hero_line1: 'Explore Myanmar',
    hero_line2: 'Your Way.',
    hero_sub: 'Build a complete day-by-day itinerary with real hotels and local MMK pricing — in seconds.',
    hero_cta: 'Plan My Trip',
    hero_cta2: 'View Destinations',
    stats: [
      { value: '5+', label: 'Destinations' },
      { value: 'AI', label: 'Powered' },
      { value: 'MMK', label: 'Local Pricing' },
      { value: 'Free', label: 'To Use' },
    ],
    featured_label: 'Featured Destination',
    featured_name: 'Ngwe Saung Beach',
    featured_region: 'Ayeyarwady Region',
    featured_desc: "Myanmar's most pristine 20km stretch of untouched coastline. Crystal-clear waters, white sand beaches, and luxury resorts on the Bay of Bengal.",
    featured_cta: 'Explore Now',
    plan_ai: 'Plan with AI',
    why_label: 'Why Raizen',
    why_title: 'Travel smarter,\nnot harder.',
    why_sub: 'Everything you need to plan the perfect Myanmar trip.',
    features: [
      { icon: 'zap',    title: 'Instant AI Plans',     desc: 'Gemini AI builds your full itinerary in seconds with real local knowledge.' },
      { icon: 'shield', title: 'Real Local Pricing',   desc: 'Every cost shown in Myanmar Kyat. No surprises, no currency guesswork.' },
      { icon: 'users',  title: 'For Every Traveler',   desc: 'Solo, couple, family — customize days, budget, and style to fit you.' },
    ],
    how_label: 'How It Works',
    how_title: '3 steps to your\nperfect trip.',
    s1n: '01', s1t: 'Choose destination',   s1d: 'Pick from Myanmar\'s top spots',
    s2n: '02', s2t: 'Set days & budget',    s2d: 'Tell us how long and how much',
    s3n: '03', s3t: 'Get your itinerary',   s3d: 'AI builds your day-by-day plan',
    cta_title: 'Ready to explore\nMyanmar?',
    cta_sub: 'Start planning your trip for free. No account needed.',
    cta_btn: 'Start Planning Free',
    footer_tagline: 'AI-powered Myanmar travel planning.',
    footer_nav: 'Navigate',
    footer_contact: 'Contact',
    footer_rights: 'All rights reserved.',
    f_home: 'Home', f_dest: 'Destinations', f_plan: 'Plan Trip',
    highlights: ['20km Coastline', 'Lover Island', 'Fresh Seafood', 'Water Sports', 'Luxury Resorts', 'Beach Bonfires'],
  },
  mm: {
    hero_eyebrow: 'AI ဖြင့် ခရီးစဉ်စီစဉ်မှု',
    hero_line1: 'မြန်မာကို လေ့လာပါ',
    hero_line2: 'သင့်နည်းဖြင့်။',
    hero_sub: 'တစ်နာရီအတွင်း ဟိုတယ်နှင့် MMK ဈေးနှုန်းများဖြင့် ပြည့်စုံသော ခရီးစဉ်စီစဉ်မှု ရယူပါ။',
    hero_cta: 'ခရီးစဉ် စီစဉ်ရန်',
    hero_cta2: 'ခရီးစဉ်များ ကြည့်ရန်',
    stats: [
      { value: '5+', label: 'ခရီးစဉ်' },
      { value: 'AI', label: 'AI ဖြင့်' },
      { value: 'MMK', label: 'ဒေသဈေး' },
      { value: 'အခမဲ့', label: 'အသုံးပြုရန်' },
    ],
    featured_label: 'အထူးခရီးစဉ်',
    featured_name: 'ငွေဆောင် ကမ်းခြေ',
    featured_region: 'အင်းဝမဒေသ',
    featured_desc: 'မြန်မာနိုင်ငံ၏ အသန့်ရှင်းဆုံး ကမ်းခြေ ၂၀ ကီလိုမီတာ။ ကင်္ဂါလင်ကြည်သောရေ၊ ဖြူသောသဲ နှင့် ဘင်္ဂလားပင်လယ်အော်ရှိ လူဇရီ ဟိုတယ်များ။',
    featured_cta: 'လေ့လာရန်',
    plan_ai: 'AI ဖြင့် စီစဉ်',
    why_label: 'ဘာကြောင့် Raizen',
    why_title: 'ပိုသတိရှိစွာ ခရီးသွားပါ။',
    why_sub: 'မြန်မာ ခရီးစဉ် ကောင်းကောင်းစီစဉ်ရန် လိုအပ်သည်အားလုံး',
    features: [
      { icon: 'zap',    title: 'AI ချက်ချင်းစီစဉ်',  desc: 'Gemini AI မှ တစ်နာရီအတွင်း ပြည့်စုံသောစီစဉ်မှု ရေးဆွဲပေးသည်' },
      { icon: 'shield', title: 'ဒေသဈေးနှုန်း',       desc: 'ကုန်ကျစရိတ်အားလုံး မြန်မာကျပ်ငွေဖြင့်ပြသည်' },
      { icon: 'users',  title: 'ခရီးသွားတိုင်းအတွက်', desc: 'တစ်ယောက်တည်း၊ စုံတွဲ၊ မိသားစု — သင့်ဘတ်ဂျက်နှင့် ကိုက်ညီအောင်' },
    ],
    how_label: 'ဘယ်လိုအသုံးပြုမလဲ',
    how_title: 'အဆင့် ၃ ဆင့်ဖြင့်\nကောင်းသောခရီးစဉ်',
    s1n: '၀၁', s1t: 'ခရီးစဉ်ရွေးပါ',     s1d: 'မြန်မာ၏ ထိပ်တန်းနေရာများမှ ရွေးပါ',
    s2n: '၀၂', s2t: 'ရက်နှင့် ဘတ်ဂျက်', s2d: 'ကြာချိန်နှင့် ဘတ်ဂျက် ထည့်သွင်းပါ',
    s3n: '၀၃', s3t: 'စီစဉ်မှု ရယူပါ',    s3d: 'AI မှ နေ့ဆင့် အစီအစဉ် ရေးဆွဲပေးသည်',
    cta_title: 'မြန်မာကို\nစတင်လေ့လာမည်လား?',
    cta_sub: 'အခမဲ့ ခရီးစဉ်စီစဉ်ရန် စတင်ပါ။ အကောင့်မလိုအပ်ပါ',
    cta_btn: 'အခမဲ့ စတင်ရန်',
    footer_tagline: 'မြန်မာ AI ခရီးစဉ်စီစဉ်မှု',
    footer_nav: 'လမ်းညွှန်',
    footer_contact: 'ဆက်သွယ်ရန်',
    footer_rights: 'မူပိုင်ခွင့် ရှိသည်',
    f_home: 'မူလ', f_dest: 'ခရီးစဉ်', f_plan: 'စီစဉ်ရန်',
    highlights: ['ကမ်းခြေ ၂၀ ကီလို', 'ချစ်သူ ကျွန်း', 'ပင်လယ်ဆိပ်', 'ရေကစား', 'လူဇရီ ဟိုတယ်', 'မီးပုံပွဲ'],
  },
}

export default function HomePage() {
  const { lang } = useLang()
  const t = T[lang]

  return (
    <div className="min-h-screen bg-surface text-primary font-body pb-16 md:pb-0">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
        {/* Bold geometric background */}
        <div className="absolute inset-0 bg-surface" />
        {/* Large blue accent shape */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-blue-600/8 dark:bg-blue-600/12 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-blue-400/6 dark:bg-blue-400/8 blur-3xl" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(var(--brand) 1px, transparent 1px), linear-gradient(90deg, var(--brand) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 w-full">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 dark:bg-blue-600/20 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8 animate-fade-in font-body">
            <Sparkles className="w-3.5 h-3.5" />
            {t.hero_eyebrow}
          </div>

          {/* Massive headline */}
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] font-800 leading-[0.95] tracking-tight mb-8 animate-fade-up opacity-0-init">
            <span className="text-primary block">{t.hero_line1}</span>
            <span className="text-blue-600 dark:text-blue-400 block">{t.hero_line2}</span>
          </h1>

          <p className="text-lg sm:text-xl text-secondary max-w-xl mb-10 leading-relaxed animate-fade-up opacity-0-init anim-delay-1 font-body">
            {t.hero_sub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0-init anim-delay-2">
            <Link href="/planner"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 font-body">
              <Sparkles className="w-5 h-5" />
              {t.hero_cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/destinations"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card hover:bg-surface-2 text-primary font-semibold rounded-2xl border border-card transition-all duration-200 text-base hover:-translate-y-0.5 font-body">
              {t.hero_cta2}
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 sm:gap-8 mt-16 pt-8 border-t border-theme max-w-lg animate-fade-up opacity-0-init anim-delay-3">
            {t.stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-display font-bold text-blue-600 dark:text-blue-400">{s.value}</div>
                <div className="text-xs text-muted mt-0.5 font-body">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DESTINATION ── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 bg-surface-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-border max-w-[60px] border-theme" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted font-body">{t.featured_label}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Image — takes 3 cols */}
            <div className="lg:col-span-3 relative rounded-3xl overflow-hidden h-72 sm:h-[480px] shadow-2xl shadow-black/15 dark:shadow-black/40 group">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop"
                alt="Ngwe Saung Beach"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              {/* Overlay badges */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-white/70 text-xs font-body mb-1">{t.featured_region}</p>
                  <h3 className="text-white text-2xl font-display font-bold">{t.featured_name}</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold text-sm font-body">4.8</span>
                </div>
              </div>
            </div>

            {/* Content — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary leading-tight">
                {t.featured_name}
              </h2>
              <p className="text-secondary leading-relaxed font-body">{t.featured_desc}</p>

              <div className="grid grid-cols-2 gap-2.5">
                {t.highlights.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary font-body">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-2">
                <Link href="/destinations/ngwesaung"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 font-body">
                  {t.featured_cta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/planner?destination=Ngwe+Saung"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card hover:bg-surface-3 text-primary font-semibold rounded-2xl border border-card transition-all hover:-translate-y-0.5 text-sm font-body">
                  <Sparkles className="w-4 h-4 text-blue-500" />{t.plan_ai}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY RAIZEN ── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="section-label mb-5">{t.why_label}</div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary leading-tight whitespace-pre-line">
              {t.why_title}
            </h2>
            <p className="text-secondary mt-4 text-lg font-body">{t.why_sub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.features.map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center mb-5 group-hover:bg-blue-600/20 transition-colors">
                  {f.icon === 'zap'    && <Zap    className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  {f.icon === 'shield' && <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  {f.icon === 'users'  && <Users  className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                </div>
                <h3 className="font-display text-lg font-bold text-primary mb-2">{f.title}</h3>
                <p className="text-secondary text-sm leading-relaxed font-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 bg-surface-2">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <div className="section-label mb-5">{t.how_label}</div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-primary leading-tight whitespace-pre-line">
              {t.how_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: t.s1n, t: t.s1t, d: t.s1d, icon: <MapPin className="w-6 h-6" /> },
              { n: t.s2n, t: t.s2t, d: t.s2d, icon: <Clock className="w-6 h-6" /> },
              { n: t.s3n, t: t.s3t, d: t.s3d, icon: <Sparkles className="w-6 h-6" /> },
            ].map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-10 left-full w-full h-px bg-border z-0 -translate-x-6" />
                )}
                <div className="glass-card rounded-2xl p-7 relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                    <span className="text-5xl font-display font-bold text-surface-3 dark:text-surface-3 select-none leading-none">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary mb-2">{step.t}</h3>
                  <p className="text-secondary text-sm font-body">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-5 sm:px-8 bg-blue-600 dark:bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight whitespace-pre-line mb-4">
            {t.cta_title}
          </h2>
          <p className="text-blue-100 text-lg mb-8 font-body">{t.cta_sub}</p>
          <Link href="/planner"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 text-lg font-body">
            <Sparkles className="w-5 h-5" />
            {t.cta_btn}
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <Image src="/raizen-logo.png" alt="Raizen" width={120} height={40} className="h-10 w-auto" />
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-body">{t.footer_tagline}</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">🇲🇲</span>
                <span className="text-slate-500 text-xs font-body">Made for Myanmar travelers</span>
              </div>
            </div>

            {/* Nav */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 font-body">{t.footer_nav}</h4>
              <ul className="space-y-3">
                {[{ l: t.f_home, h: '/' }, { l: t.f_dest, h: '/destinations' }, { l: t.f_plan, h: '/planner' }].map(x => (
                  <li key={x.h}>
                    <Link href={x.h} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group font-body">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {x.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 font-body">{t.footer_contact}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-400 font-body">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />vibeauto3@gmail.com
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400 font-body">
                  <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />raizentourism.vercel.app
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400 font-body">
                  <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />09751067759
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-xs font-body">© {new Date().getFullYear()} Raizen Myanmar. {t.footer_rights}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-slate-500 text-xs font-body">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
