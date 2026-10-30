import type { MetadataRoute } from 'next'
import { absolute } from '@/lib/site-url'

// Required for the GitHub Pages build: `output: 'export'` refuses to collect a
// metadata route without an explicit static marker and fails the build.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absolute('/sitemap.xml'),
    host: absolute('/'),
  }
}
