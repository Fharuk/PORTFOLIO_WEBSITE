import type { MetadataRoute } from 'next'
import { absolute } from '@/lib/site-url'

// Required for the GitHub Pages build — see the note in app/robots.ts.
export const dynamic = 'force-static'

/**
 * The three readings are deliberately the same content in different light.
 * They are listed as separate entries rather than collapsed, because people do
 * share /chrome and /energy directly — but each page declares itself canonical,
 * so search engines have an unambiguous answer.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-30')
  return [
    { url: absolute('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: absolute('/chrome'), lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: absolute('/energy'), lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
