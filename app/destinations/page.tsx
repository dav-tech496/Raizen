'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Star, Clock, Waves } from 'lucide-react'
import { useLang } from '@/components/theme/LangProvider'

const T = {
  en: {
    page_label: 'Destinations',
    page_title: 'Where do you\nwant to go?',
    page_sub: 'Handpicked destinations across Myanmar — more coming soon.',
    explore: 'Explore',
    plan: 'Plan Trip',
    badge: 'Available Now',
    coming_soon: 'Coming Soon',
    dest: {
      name: 'Ngwe Saung Beach',
      region: 'Ayeyarwady Region',
      tagline: "Myanmar's most pristine beach destination",
      duration: '2–7 nights',
      rating: '4.8',
      highlights: ['20km White Sand Beach', 'Lover Island', 'Luxury Resorts', 'Fresh Seafood', 'Water Sports', 'Stunning Sunsets'],
      desc: "A 20km stretch of untouched white sand beach on the Bay of Bengal. Crystal-clear waters, luxury resorts, and peaceful surroundings make it Myanmar's premier beach escape.",
    },
    soon: [
      { name: 'Bagan', region: 'Mandalay Region', tagline: 'Ancient temples & hot air balloons' },
      { name: 'Inle Lake', region: 'Shan State', tagline: 'Floating villages & serene waters' },
    ],
  },
  mm: {
    page_label: 'ခရီးစဉ်များ',
    page_title: 'ဘယ်ကို\nသွားချင်သလဲ?',
    page_sub: 'မြန်မာနိုင်ငံရှိ အကောင်းဆုံး ခရီးစဉ်များ — နောက်ထပ်မကြာမီ ထပ်တိုးမည်',
    explore: 'လေ့လာရန်',
    plan: 'စီစဉ်ရန်',
    badge: 'ယခုရနိုင်သည်',
    coming_soon: 'မကြာမီ ထပ်တိုး',
    dest: {
      name: 'ငွေဆောင် ကမ်းခြေ',
      region: 'အင်းဝမဒေသ',
      tagline: 'မြန်မာနိုင်ငံ၏ အကောင်းဆုံး ကမ်းခြေ ခရီးစဉ်',
      duration: '၂–၇ ညာ',
      rating: '4.8',
      highlights: ['သဲဖြူ ကမ်းခြေ ၂၀ ကီလို', 'ချစ်သူ ကျွန်း', 'လူဇရီ ဟိုတယ်', 'ပင်လယ်ဆိပ်', 'ရေကစားခြင်း', 'လှပသောနေဝင်ချိန်'],
      desc: 'ဘင်္ဂလားပင်လယ်အော်တွင် ၂၀ ကီလိုမီတာ ဖြူဖြူကြည်ကြည် သဲကမ်းခြေ။ ကင်္ဂါလင်ကြည်သောရေ၊ လူဇရီဟိုတယ်နှင့် ငြိမ်သက်သောပတ်ဝန်းကျင်ဖြင့် မြန်မာ၏ ထိပ်တန်းကမ်းခြေ ခရီးစဉ်ဖြစ်သည်',
    },
    soon: [
      { name: 'ပုဂံ', region: 'မန္တလေးတိုင်း', tagline: 'ရှေးဟောင်းဘုရားကျောင်းများ နှင့် ဘာလွန်' },
      { name: 'အင်းလေး', region: 'ရှမ်းပြည်နယ်', tagline: 'မျောနေသောရွာများ နှင့် ငြိမ်သောရေ' },
    ],
  },
}

export const dynamic = 'force-dynamic'

export default function DestinationsPage() {
  const { lang } = useLang()
  const t = T[lang]

  return (
    <div className="min-h-screen bg-surface text-primary pb-16 md:pb-0">
      {/* Header */}
      <section className="pt-28 pb-12 px-5 sm:px-8 bg-surface-2 border-b border-theme">
        <div className="max-w-7xl mx-auto">
          <div className="section-label mb-5">{t.page_label}</div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-primary leading-tight whitespace-pre-line mb-4">
            {t.page_title}
          </h1>
          <p className="text-secondary text-lg font-body max-w-xl">{t.page_sub}</p>
        </div>
      </section>

      <section className="py-14 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Ngwe Saung — Featured Card */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-xl shadow-black/8 dark:shadow-black/30">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop"
                  alt="Ngwe Saung Beach"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:bg-gradient-to-t lg:from-black/30" />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                    {t.badge}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-7 sm:p-10 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs text-muted font-body">{t.dest.region}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-1">{t.dest.name}</h2>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold font-body">{t.dest.tagline}</p>
                  </div>

                  <p className="text-secondary text-sm leading-relaxed font-body">{t.dest.desc}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-secondary font-body">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-primary">{t.dest.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary font-body">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {t.dest.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary font-body">
                      <Waves className="w-4 h-4 text-blue-400" />
                      Beach
                    </div>
                  </div>

                  {/* Highlights grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {t.dest.highlights.map(h => (
                      <div key={h} className="flex items-center gap-2 text-xs text-secondary font-body">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />{h}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link href="/destinations/ngwesaung"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 font-body">
                    {t.explore} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/planner"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-2 hover:bg-surface-3 text-primary font-semibold rounded-2xl border border-theme transition-all hover:-translate-y-0.5 font-body">
                    {t.plan}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon cards — no photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.soon.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-7 opacity-60 relative">
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 bg-surface-3 text-muted text-xs font-semibold rounded-full font-body border border-theme">
                    {t.coming_soon}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-muted" />
                </div>
                <h3 className="font-display text-xl font-bold text-primary mb-1">{s.name}</h3>
                <p className="text-xs text-muted font-body mb-1">{s.region}</p>
                <p className="text-sm text-secondary font-body">{s.tagline}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
