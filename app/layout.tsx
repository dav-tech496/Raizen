import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Raizen — Ngwe Saung Beach Planner',
  description: 'AI-powered travel planner for Ngwe Saung Beach, Myanmar. Get a personalized itinerary with real hotel pricing in MMK.',
  keywords: ['Ngwe Saung', 'Myanmar beach', 'Burma travel', 'AI travel planner', 'Ngwesaung resort'],
  openGraph: {
    title: 'Raizen — Ngwe Saung Beach Planner',
    description: 'Plan your perfect Ngwe Saung trip with AI. Real hotels, real prices.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-stone-950 text-white antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
