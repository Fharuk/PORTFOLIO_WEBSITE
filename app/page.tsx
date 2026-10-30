import type { Metadata } from 'next'
import { SiteShell } from '@/components/site-shell'
import { FluxHero } from '@/components/hero/flux-hero'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: `${site.fullName} — ${site.role}`,
  description: site.positioning,
}

export default function Home() {
  return <SiteShell variant="flux" hero={<FluxHero />} />
}
