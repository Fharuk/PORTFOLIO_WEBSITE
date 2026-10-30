import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/instrument-sans/standard.css'
import './globals.css'
import { Nav } from '@/components/chrome/nav'
import { SmoothScroll } from '@/components/chrome/smooth-scroll'
import { site } from '@/content/site'

/**
 * Canonical origin.
 *
 * Vercel exposes the project's production hostname at build time, so metadata
 * resolves correctly on every deployment without hard-coding a domain. The
 * localhost fallback keeps `next dev` honest, and NEXT_PUBLIC_SITE_URL lets a
 * custom domain win once one is attached.
 */
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000'

export const metadata: Metadata = {
  title: `${site.fullName} — ${site.role}`,
  description: site.positioning,
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: `${site.fullName} — ${site.role}`,
    description: site.positioning,
    type: 'website',
    siteName: site.fullName,
    locale: 'en_NG',
  },
  twitter: { card: 'summary_large_image' },
  authors: [{ name: site.fullName }],
  creator: site.fullName,
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#04060e',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  )
}
