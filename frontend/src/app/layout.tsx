import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jelajah Nusantara AI - Perencana Rute Wisata Personalisasi',
  description: 'Platform web cerdas yang merevolusi cara wisatawan merencanakan perjalanan mereka di Indonesia menggunakan AI dan Natural Language Processing.',
  keywords: 'wisata indonesia, AI travel planner, rute wisata, itinerary, perjalanan',
  authors: [{ name: 'Jelajah Nusantara AI Team' }],
  openGraph: {
    title: 'Jelajah Nusantara AI',
    description: 'Perencana Rute Wisata Personalisasi dengan AI',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          {children}
        </div>
      </body>
    </html>
  )
}
