import { SiteShell } from '@/components/site-shell'
import { ChromeHero } from '@/components/hero/chrome-hero'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  path: '/chrome',
  title: `${site.fullName} — Liquid chrome`,
})

export default function ChromePage() {
  return <SiteShell variant="chrome" hero={<ChromeHero />} />
}
