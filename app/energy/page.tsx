import { SiteShell } from '@/components/site-shell'
import { EnergyHero } from '@/components/hero/energy-hero'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  path: '/energy',
  title: `${site.fullName} — Energy`,
})

export default function EnergyPage() {
  return <SiteShell variant="energy" hero={<EnergyHero />} />
}
