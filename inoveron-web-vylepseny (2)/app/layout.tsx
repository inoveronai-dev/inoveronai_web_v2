import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://inoveron.com'),
  title: 'Inoveron AI | AI automatizácie a systémy na mieru',
  description:
    'Navrhujeme a nasadzujeme AI automatizácie, asistentov a interné systémy prispôsobené procesom vašej firmy.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Inoveron AI | AI automatizácie a systémy na mieru',
    description: 'Menej manuálnej práce, rýchlejšie procesy a viac kapacity pre rast.',
    url: 'https://inoveron.com',
    siteName: 'Inoveron AI',
    locale: 'sk_SK',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Inoveron AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inoveron AI | AI automatizácie a systémy na mieru',
    description: 'Menej manuálnej práce, rýchlejšie procesy a viac kapacity pre rast.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Inoveron AI',
    url: 'https://inoveron.com',
    logo: 'https://inoveron.com/logo.png',
    image: 'https://inoveron.com/logo.png',
    description:
      'Navrhujeme a nasadzujeme AI automatizácie, asistentov a interné systémy prispôsobené procesom vašej firmy.',
    email: 'inoveron.ai@gmail.com',
    telephone: '+421918326477',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SK',
    },
  }

  return (
    <html
      lang="sk"
      className={`dark bg-background ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
