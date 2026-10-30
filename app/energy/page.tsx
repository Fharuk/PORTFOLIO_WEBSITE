import type { Metadata } from 'next'
import { SiteShell } from '@/components/site-shell'
import { EnergyHero } from '@/components/hero/energy-hero'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: `${site.fullName} — Energy`,
  description: site.positioning,
}

export default function EnergyPage() {
  return <SiteShell variant="energy" hero={<EnergyHero />} />
}
