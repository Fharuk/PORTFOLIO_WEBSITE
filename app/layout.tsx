import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/instrument-sans/standard.css'
import './globals.css'
import { Nav } from '@/components/chrome/nav'
import { SmoothScroll } from '@/components/chrome/smooth-scroll'
import { site } from '@/content/site'
import { siteTitle, siteDescription } from '@/lib/metadata'
import { siteOrigin } from '@/lib/site-url'

/**
 * Origin only — never a path.
 *
 * On GitHub Pages the site is served from /<repo>/, and a metadataBase that
 * carried that path would make root-relative URLs resolve one directory too
 * high. Base-path-aware paths are produced by p() in lib/site-url instead.
 *
 * Resolved as: NEXT_PUBLIC_SITE_URL (set per host) → Vercel's build-time
 * production host → localhost for dev.
 */
const github = site.contact.links.find((l) => l.label === 'GitHub')?.href

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: siteTitle,
  description: siteDescription,
  applicationName: site.fullName,
  authors: [{ name: site.fullName, ...(github ? { url: github } : {}) }],
  creator: site.fullName,
  publisher: site.fullName,
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
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
