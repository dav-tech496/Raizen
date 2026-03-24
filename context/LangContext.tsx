'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Lang } from '@/types'

// ─── Translation dictionary ───────────────────────────────────────

const translations = {
  en: {
    // Nav
    home: 'Home',
    destinations: 'Destinations',
    planTrip: 'Plan Trip',
    language: 'Language',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    // Hero
    heroChip: 'Local prices · No account needed',
    heroH1Line1: 'Explore Myanmar',
    heroH1Line2: 'Your Way.',
    heroSub: 'Plan a complete trip with verified hotels and real bus ticket prices — for free.',
    planMyTrip: 'Plan My Trip →',
    destinationsBtn: 'Destinations',
    mmkPricingTitle: 'MMK Pricing',
    mmkPricingDesc: 'All prices in Myanmar Kyat. No currency guesswork.',
    freeTitle: '100% Free',
    freeDesc: 'No account, no payment, no hidden fees. Ever.',
    // Sections
    featuredDestination: 'Featured Destination',
    readyToBook: 'Ready to book now',
    whyRaizen: 'Why Raizen',
    travelSmarter: 'Travel smarter, not harder.',
    travelSmarterSub: 'Everything you need to plan the perfect Myanmar trip.',
    howItWorks: 'How It Works',
    threeSteps: '3 steps to your perfect trip.',
    availableNow: 'Available Now',
    comingSoon: 'Coming Soon',
    // Why cards
    bestTimeTitle: 'Best Time to Visit',
    bestTimeDesc: 'Know exactly when to go. Best seasons, weather windows, and peak vs. off-peak timing.',
    realPricingTitle: 'Real Local Pricing',
    realPricingDesc: 'Every cost in Myanmar Kyat. Hotels, bus tickets — all verified, no surprises.',
    everyTravelerTitle: 'For Every Traveler',
    everyTravelerDesc: 'Solo, couple, or family — customize days and budget to fit your style.',
    // Steps
    step1Title: 'Choose your destination',
    step1Desc: "Pick from Myanmar's top spots — beaches, temples, and lakes.",
    step2Title: 'Set your days & budget',
    step2Desc: 'Tell us how long and your daily spend in MMK.',
    step3Title: 'Get your full itinerary',
    step3Desc: 'Matched hotels, bus ticket prices, and a day-by-day plan — all with real MMK costs.',
    // CTA
    ctaTitle: 'Ready to explore Myanmar?',
    ctaSub: 'Start planning for free. No account needed.',
    startPlanningFree: 'Start Planning Free',
    // Detail page
    whereTheBay: 'Where the Bay Meets Untouched Paradise',
    bestTimeToVisit: 'Best time to visit',
    bestTimePeriod: 'November — April (Dry Season)',
    seeBeauty: 'See the Beauty Up Close',
    verifiedHotels: 'Verified Hotels & MMK Pricing',
    allPricesNote: 'All prices in Myanmar Kyat per night.',
    from: 'From',
    planNgweSaung: 'Plan My Ngwe Saung Trip',
    backBtn: '← Back',
    region: 'Ayeyarwady Region, Myanmar',
    // Planner
    tripPlanner: 'Trip Planner',
    planYourTrip: 'Plan Your Myanmar Trip',
    plannerSub: "Tell us your preferences and we'll show matched hotels and bus ticket prices.",
    destination: 'Destination',
    numberOfDays: 'Number of Days',
    dailyBudget: 'Daily Budget per Person (MMK)',
    budgetTier: 'Budget tier',
    travelingAs: 'Traveling As',
    solo: 'Solo',
    couple: 'Couple',
    family: 'Family',
    departureDay: 'Departure Day',
    weekday: 'Weekday',
    weekend: 'Weekend',
    holiday: 'Holiday',
    travelStyle: 'Travel Style',
    travelStyleSoon: 'Personalized styles — coming soon',
    soon: 'Soon',
    showMyPlan: 'Show My Trip Plan',
    day: 'day',
    days: 'days',
    // Result
    busTicketSection: 'Bus Ticket',
    busRoundTrip: 'Bus Ticket (Round Trip)',
    matchedHotels: 'Matched Hotels for Your Budget',
    dayByDay: 'Day-by-Day Plan',
    saveAsPdf: 'Download PDF',
    saveItinerary: 'Save Itinerary',
    estimatedTotal: 'Estimated Minimum Total',
    busTickets: 'Bus Tickets',
    hotelEstimate: 'Hotel (cheapest match)',
    noHotelsFound: 'No hotels found within this budget. Try increasing your daily budget.',
    night: 'night',
    nights: 'nights',
    pax: 'pax',
    // Footer
    footerTagline: 'Made for Myanmar travelers and foreigners. 🇲🇲',
    navigate: 'Navigate',
    contact: 'Contact',
    allSystemsOp: 'All systems operational',
    // Auth
    loginTitle: 'Welcome back',
    loginSub: 'Sign in to your Raizen account',
    registerTitle: 'Create your account',
    registerSub: "Join Raizen — it's completely free",
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginBtn: 'Sign In',
    registerBtn: 'Create Account',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUpLink: 'Sign up',
    signInLink: 'Sign in',
    loggingIn: 'Signing in…',
    registering: 'Creating account…',
    // Dashboard
    myItineraries: 'My Saved Itineraries',
    noSavedYet: "You haven't saved any itineraries yet.",
    planFirstTrip: 'Plan your first trip →',
    // Loading
    checkingHotels: 'Checking hotels for your budget…',
    checkingBus: 'Checking bus ticket prices…',
    buildingPlan: 'Building your day-by-day plan…',
    finalizing: 'Finalizing your trip…',
  },

  mm: {
    home: 'ပင်မစာမျက်နှာ',
    destinations: 'နေရာများ',
    planTrip: 'ခရီးစဉ်စီစဉ်ရန်',
    language: 'ဘာသာစကား',
    login: 'ဝင်ရောက်ရန်',
    register: 'စာရင်းသွင်းရန်',
    dashboard: 'ဒက်ရှ်ဘုတ်',
    logout: 'ထွက်ရန်',
    heroChip: 'ဒေသဆိုင်ရာ စျေးနှုန်းများ · အကောင့်မလိုဘဲ',
    heroH1Line1: 'Explore Myanmar',
    heroH1Line2: 'သင့်နည်းဖြင့်',
    heroSub: 'အတည်ပြုထားသော ဟိုတယ်များနှင့် တကယ့်ဘတ်စ်ကားလက်မှတ်စျေးနှုန်းများဖြင့် ခရီးစဉ်တစ်ခုလုံး စီစဉ်ပါ — အခမဲ့ဖြင့်',
    planMyTrip: 'ခရီးစဉ်စီစဉ်ရန် →',
    destinationsBtn: 'နေရာများ',
    mmkPricingTitle: 'MMK စျေးနှုန်း',
    mmkPricingDesc: 'မြန်မာကျပ်ဖြင့် စျေးနှုန်းအားလုံး။ ငွေကြေးပြောင်းလဲရန် မလိုဘဲ',
    freeTitle: '၁၀၀% အခမဲ့',
    freeDesc: 'အကောင့်မလို၊ ငွေမပေးရ၊ ဝှက်ကြေးမရှိ',
    featuredDestination: 'အထူးနေရာ',
    readyToBook: 'ယခုပဲ ကြိုတင်ဘွတ်ကင်လုပ်နိုင်သည်',
    whyRaizen: 'ဘာကြောင့် Raizen',
    travelSmarter: 'ပိုမိုသွက်လက်စွာ ခရီးသွားပါ',
    travelSmarterSub: 'မြန်မာနိုင်ငံ ခရီးစဉ်ကို ပြည့်စုံစွာ စီစဉ်ရန် လိုအပ်သောအရာ အားလုံး',
    howItWorks: 'မည်သို့ အလုပ်လုပ်သနည်း',
    threeSteps: 'ပြည့်စုံသောခရီးစဉ်အတွက် အဆင့် ၃ ဆင့်',
    availableNow: 'ယခုရနိုင်သည်',
    comingSoon: 'မကြာမီ လာမည်',
    bestTimeTitle: 'သွားလည်ရန် အကောင်းဆုံးအချိန်',
    bestTimeDesc: 'သွားချိန်ကို တိတိကျကျ သိပါ။ ရာသီ၊ မိုးလေဝသ နှင့် အချိန်ကိုက်ညှိမှုများ',
    realPricingTitle: 'တကယ့်ဒေသဆိုင်ရာ စျေးနှုန်း',
    realPricingDesc: 'ကုန်ကျစရိတ်အားလုံး မြန်မာကျပ်ဖြင့်။ ဟိုတယ်များ၊ ဘတ်စ်ကားလက်မှတ် — အားလုံးအတည်ပြုပြီး',
    everyTravelerTitle: 'ခရီးသည်တိုင်းအတွက်',
    everyTravelerDesc: 'တစ်ဦးတည်း၊ စုံတွဲ၊ မိသားစု — ရက်များနှင့် ဘတ်ဂျက်ကို သင့်ကျ သတ်မှတ်ပါ',
    step1Title: 'သင့်ဦးတည်ရာ ရွေးပါ',
    step1Desc: 'မြန်မာ၏ နှစ်သိမ့်ဖွယ်နေရာများမှ ရွေးချယ်ပါ — ကမ်းနံဘေး၊ ဘုရားကျောင်းများ',
    step2Title: 'ရက်နှင့် ဘတ်ဂျက် သတ်မှတ်ပါ',
    step2Desc: 'ကြာချိန်နှင့် MMK ဖြင့် နေ့စဉ်သုံးစွဲမှုကို ဖော်ပြပါ',
    step3Title: 'ခရီးစဉ်အစီအစဉ်တစ်ခုလုံး ရယူပါ',
    step3Desc: 'ကိုက်ညီသောဟိုတယ်များ၊ ဘတ်စ်ကားလက်မှတ်စျေးနှုန်းနှင့် နေ့တိုင်းအစီအစဉ်',
    ctaTitle: 'မြန်မာနိုင်ငံကို ရှာဖွေရန် အသင့်ဖြစ်ပြီလား?',
    ctaSub: 'အခမဲ့ စီစဉ်ပါ။ အကောင့်မလိုဘဲ',
    startPlanningFree: 'အခမဲ့ စီစဉ်ရန် စတင်ပါ',
    whereTheBay: 'ပင်လယ်ကွေ့နှင့် မထိတွေ့ရသောကမ္ဘာ',
    bestTimeToVisit: 'သွားလည်ရန် အကောင်းဆုံးအချိန်',
    bestTimePeriod: 'နိုဝင်ဘာ — ဧပြီ (ခြောက်သွေ့ရာသီ)',
    seeBeauty: 'လှပမှုကို နီးနီးကပ်ကပ် ကြည့်ပါ',
    verifiedHotels: 'အတည်ပြုထားသောဟိုတယ်များ & MMK စျေးနှုန်း',
    allPricesNote: 'ညဦးတိုင်း မြန်မာကျပ်ဖြင့် စျေးနှုန်းအားလုံး',
    from: 'မှ',
    planNgweSaung: 'ငွေဆောင်ခရီးစဉ် စီစဉ်ရန်',
    backBtn: '← နောက်သို့',
    region: 'အင်းဝဒေသ၊ မြန်မာနိုင်ငံ',
    tripPlanner: 'ခရီးစဉ်စီစဉ်သူ',
    planYourTrip: 'သင့်မြန်မာနိုင်ငံ ခရီးစဉ်စီစဉ်ပါ',
    plannerSub: 'သင့်နှစ်သက်မှုများကို ဖော်ပြပါ၊ ကိုက်ညီသောဟိုတယ်များနှင့် ဘတ်စ်ကားလက်မှတ်စျေးနှုန်းများ ပြသမည်',
    destination: 'ဦးတည်ရာ',
    numberOfDays: 'ခရီးစဉ်ရက်အရေအတွက်',
    dailyBudget: 'တစ်ဦးချင်း နေ့စဉ်ဘတ်ဂျက် (MMK)',
    budgetTier: 'ဘတ်ဂျက်အဆင့်',
    travelingAs: 'ခရီးသွားနည်း',
    solo: 'တစ်ဦးတည်း',
    couple: 'စုံတွဲ',
    family: 'မိသားစု',
    departureDay: 'ထွက်ခွာသောနေ့',
    weekday: 'နေ့ရက်',
    weekend: 'စနေ/တနင်္ဂနွေ',
    holiday: 'ရုံးပိတ်ရက်',
    travelStyle: 'ခရီးသွားပုံစံ',
    travelStyleSoon: 'ပုဂ္ဂိုလ်ပိုင် ပုံစံများ — မကြာမီ လာမည်',
    soon: 'မကြာမီ',
    showMyPlan: 'ခရီးစဉ်အစီအစဉ် ကြည့်ရန်',
    day: 'ရက်',
    days: 'ရက်',
    busTicketSection: 'ဘတ်စ်ကားလက်မှတ်',
    busRoundTrip: 'ဘတ်စ်ကား (Round Trip)',
    matchedHotels: 'သင့်ဘတ်ဂျက်နှင့် ကိုက်ညီသောဟိုတယ်များ',
    dayByDay: 'နေ့တိုင်းအစီအစဉ်',
    saveAsPdf: 'PDF ဒေါင်းလုပ်',
    saveItinerary: 'ခရီးစဉ်သိမ်းဆည်းရန်',
    estimatedTotal: 'မှန်းဆကုန်ကျမှု (ထိပ်ဆုံး)',
    busTickets: 'ဘတ်စ်ကားလက်မှတ်',
    hotelEstimate: 'ဟိုတယ် (အသက်သာဆုံး)',
    noHotelsFound: 'ဘတ်ဂျက်နှင့်ကိုက်ညီသောဟိုတယ်မတွေ့ပါ။ ဘတ်ဂျက်တိုးချဲ့ကြည့်ပါ',
    night: 'ညဦး',
    nights: 'ညဦး',
    pax: 'ဦး',
    footerTagline: 'မြန်မာနိုင်ငံ ခရီးသည်များနှင့် နိုင်ငံခြားသားများအတွက် 🇲🇲',
    navigate: 'သွားရောက်ရန်',
    contact: 'ဆက်သွယ်ရန်',
    allSystemsOp: 'စနစ်အားလုံး ကောင်းမွန်',
    loginTitle: 'ပြန်လာကြိုဆိုပါသည်',
    loginSub: 'Raizen အကောင့်သို့ ဝင်ရောက်ပါ',
    registerTitle: 'အကောင့်ဖန်တီးရန်',
    registerSub: 'Raizen သို့ ဝင်ရောက်ပါ — လုံးဝအခမဲ့',
    fullName: 'အမည်အပြည့်အစုံ',
    email: 'အီးမေးလ်',
    password: 'စကားဝှက်',
    confirmPassword: 'စကားဝှက် အတည်ပြုရန်',
    loginBtn: 'ဝင်ရောက်ရန်',
    registerBtn: 'အကောင့်ဖန်တီးရန်',
    noAccount: 'အကောင့်မရှိဘူးလား?',
    haveAccount: 'အကောင့်ရှိပြီးသားလား?',
    signUpLink: 'စာရင်းသွင်းရန်',
    signInLink: 'ဝင်ရောက်ရန်',
    loggingIn: 'ဝင်ရောက်နေသည်…',
    registering: 'အကောင့်ဖန်တီးနေသည်…',
    myItineraries: 'သိမ်းဆည်းထားသော ခရီးစဉ်များ',
    noSavedYet: 'ခရီးစဉ်တစ်ခုမျှ မသိမ်းဆည်းရသေးပါ',
    planFirstTrip: 'ပထမဆုံးခရီးစဉ် စီစဉ်ရန် →',
    checkingHotels: 'ဟိုတယ်များကို စစ်ဆေးနေသည်…',
    checkingBus: 'ဘတ်စ်ကားစျေးနှုန်းများ စစ်ဆေးနေသည်…',
    buildingPlan: 'ခရီးစဉ်အစီအစဉ် တည်ဆောက်နေသည်…',
    finalizing: 'ဆုံးဖြတ်ချက်ချနေသည်…',
  },
} as const

export type TranslationKey = keyof typeof translations.en

// ─── Context ─────────────────────────────────────────────────────

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('raizen_lang') as Lang | null
    if (stored === 'en' || stored === 'mm') setLangState(stored)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('raizen_lang', l)
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key] as string,
    [lang]
  )

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
