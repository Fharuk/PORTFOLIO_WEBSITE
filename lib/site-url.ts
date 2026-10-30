/**
 * One place that knows where the site is served from.
 *
 * The same build ships to two hosts with different shapes:
 *
 *   Vercel        https://<project>.vercel.app/            (no base path)
 *   GitHub Pages  https://<user>.github.io/<repo>/         (base path)
 *
 * Anything that emits an absolute or root-relative URL — canonical tags, the
 * OpenGraph image, sitemap entries — has to go through here, because
 * `next/image` and hand-written paths do not pick up `basePath` on their own.
 */
const trimTrailing = (v: string) => v.replace(/\/+$/, '')

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL
  ? trimTrailing(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000'

/** Root-relative path with the base path applied. Safe to hand to metadata. */
export const p = (path: string) => `${basePath}${path}`

/** Fully qualified URL, for sitemaps and anywhere a host must be named. */
export const absolute = (path: string) => `${siteOrigin}${p(path)}`
