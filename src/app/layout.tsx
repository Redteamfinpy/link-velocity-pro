import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Link Velocity Pro - The Fastest URL Shortener with Analytics',
  description: 'Transform long URLs into powerful, trackable short links with detailed analytics. Lightning-fast URL shortening with insights into your audience behavior.',
  keywords: 'url shortener, link shortener, url analytics, link tracking, url management',
  authors: [{ name: 'Link Velocity Pro' }],
  creator: 'Link Velocity Pro',
  publisher: 'Link Velocity Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://link-velocity-pro.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Link Velocity Pro - The Fastest URL Shortener with Analytics',
    description: 'Transform long URLs into powerful, trackable short links with detailed analytics.',
    url: 'https://link-velocity-pro.vercel.app',
    siteName: 'Link Velocity Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Link Velocity Pro - URL Shortener with Analytics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Velocity Pro - The Fastest URL Shortener with Analytics',
    description: 'Transform long URLs into powerful, trackable short links with detailed analytics.',
    images: ['/og-image.png'],
    creator: '@LinkVelocityPro',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  )
}
