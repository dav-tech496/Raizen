import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { AppNavbar } from '@/components/layout/AppNavbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Raizen — Myanmar Travel Planner',
  description: 'AI-powered travel planner for Myanmar. Plan your perfect trip to Ngwe Saung, Bagan, Inle Lake and beyond.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-surface text-primary`}>
        <ThemeProvider>
          <AppNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
