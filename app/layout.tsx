import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { LangProvider } from '@/components/theme/LangProvider'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { MobileNav } from '@/components/layout/MobileNav'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm',
})

export const metadata: Metadata = {
  title: 'Raizen — Myanmar Travel Planner',
  description: 'AI-powered travel planner for Myanmar. Plan your perfect trip with real local pricing.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} antialiased bg-surface text-primary`}>
        <ThemeProvider>
          <LangProvider>
            <AppNavbar />
            {children}
            <MobileNav />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
