import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/instrument-sans/standard.css'
import './globals.css'
import { Nav } from '@/components/chrome/nav'
import { SmoothScroll } from '@/components/chrome/smooth-scroll'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: `${site.fullName} — ${site.role}`,
  description: site.positioning,
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: `${site.fullName} — ${site.role}`,
    description: site.positioning,
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  authors: [{ name: site.fullName }],
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
