import { SiteShell } from '@/components/site-shell'
import { FluxHero } from '@/components/hero/flux-hero'
import { pageMetadata, siteTitle } from '@/lib/metadata'

export const metadata = pageMetadata({ path: '/', title: siteTitle })

export default function Home() {
  return <SiteShell variant="flux" hero={<FluxHero />} />
}
