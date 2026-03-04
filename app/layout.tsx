import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Raizen — Myanmar Travel Brain',
  description: 'AI-powered travel planner for Myanmar. Plan your perfect trip to Bagan, Inle Lake, Ngwe Saung and beyond.',
  keywords: ['Myanmar travel', 'Burma tourism', 'AI travel planner', 'Bagan', 'Inle Lake', 'Ngwe Saung'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-stone-950 text-white antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
