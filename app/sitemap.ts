import type { MetadataRoute } from 'next'
import { caseStudies } from '@/content/case-studies'
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
  const studies = caseStudies.map((c) => ({
    url: absolute(`/work/${c.slug}`),
    lastModified,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [
    { url: absolute('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: absolute('/chrome'), lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: absolute('/energy'), lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: absolute('/work'), lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: absolute('/cv'), lastModified, changeFrequency: 'yearly', priority: 0.9 },
    ...studies,
  ]
}
