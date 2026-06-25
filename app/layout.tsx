import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thoughtofview.com'),
  title: {
    default: 'Thought of View — AI-Powered Perspectives on Anything',
    template: '%s | Thought of View',
  },
  description: 'AI-powered hot takes, balanced analysis & contrarian views on any topic. Five angles. Free to start.',
  keywords: ['AI opinions', 'hot takes', 'AI perspectives', 'debate', 'contrarian views', 'critical thinking', 'AI analysis'],
  authors: [{ name: 'Thought of View' }],
  creator: 'Thought of View',
  publisher: 'Thought of View',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.thoughtofview.com',
    siteName: 'Thought of View',
    title: 'Thought of View — AI-Powered Perspectives on Anything',
    description: 'AI-powered hot takes, balanced analysis & contrarian views on any topic. Five angles. Free to start.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Thought of View — AI Opinion Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thought of View — AI-Powered Perspectives on Anything',
    description: 'AI-powered hot takes, balanced analysis & contrarian views on any topic. Five angles. Free to start.',
    images: ['/og-image.png'],
    creator: '@thoughtofview',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
