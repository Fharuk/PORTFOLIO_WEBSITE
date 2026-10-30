import type { Metadata } from 'next'
import { SiteShell } from '@/components/site-shell'
import { ChromeHero } from '@/components/hero/chrome-hero'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: `${site.fullName} — Liquid chrome`,
  description: site.positioning,
}

export default function ChromePage() {
  return <SiteShell variant="chrome" hero={<ChromeHero />} />
}
