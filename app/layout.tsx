import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { LangProvider } from '@/context/LangContext'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Raizen — Myanmar Travel Planner',
  description: 'Plan a complete Myanmar trip with verified hotels and real MMK bus ticket prices — free.',
  metadataBase: new URL('https://raizentourism.vercel.app'),
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Raizen — Myanmar Travel Planner',
    description: 'Real MMK prices. Matched hotels. Day-by-day plans. 100% free.',
    url: 'https://raizentourism.vercel.app',
    siteName: 'Raizen',
    locale: 'en_US',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="bg-bg font-sans text-ink overflow-x-hidden min-h-screen">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
