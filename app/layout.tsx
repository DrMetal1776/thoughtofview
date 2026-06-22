import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thoughtofview.com'),
  title: {
    default: 'Thought of View — AI-Powered Perspectives on Anything',
    template: '%s | Thought of View',
  },
  description: 'Get instant AI-generated hot takes, balanced analysis, and contrarian views on any topic.',
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
    description: 'Get instant AI-generated hot takes, balanced analysis, and contrarian views on any topic.',
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
    description: 'Get instant AI-generated hot takes, balanced analysis, and contrarian views on any topic.',
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
  verification: {
    google: '',  // Add your Google Search Console verification code here
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
