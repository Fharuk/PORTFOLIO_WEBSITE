import type { Metadata } from 'next'
import { site } from '@/content/site'
import { p } from '@/lib/site-url'

const description = site.positioning

/**
 * Metadata for one variant route.
 *
 * This exists because Next replaces a parent's `openGraph` object wholesale
 * rather than deep-merging it: if a page declared only its own `openGraph.title`
 * it would silently lose the OpenGraph image inherited from the layout. Building
 * the whole block in one place keeps the image on every route.
 */
export function pageMetadata({ path, title }: { path: string; title: string }): Metadata {
  const ogImage = {
    url: p('/og.png'),
    width: 1200,
    height: 630,
    alt: `${site.fullName} — ${site.role}`,
  }

  return {
    title,
    description,
    alternates: { canonical: p(path) },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: site.fullName,
      locale: 'en_NG',
      url: p(path),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [p('/og.png')],
    },
  }
}

export const siteTitle = `${site.fullName} — ${site.role}`
export const siteDescription = description
