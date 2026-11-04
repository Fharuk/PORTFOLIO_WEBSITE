import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Vercel's first-party measurement, mounted only where it exists.
 *
 * Both scripts are served by Vercel itself from `/_vercel/insights/*`. On the
 * GitHub Pages build those paths are 404s, so rendering the components there
 * would spend two requests to fetch nothing and log an error on every visit.
 * The gate is the build environment: Vercel sets `VERCEL` during the build,
 * Pages does not.
 *
 * `mode="production"` keeps preview deployments out of the numbers — a branch
 * alias getting traffic is not the site being read, and mixing the two makes
 * both meaningless.
 *
 * Speed Insights is the half that says *why*: it reports Core Web Vitals from
 * real visits, which is the only honest answer to "is this fast?" on hardware
 * that is not a developer's laptop.
 *
 * Honest note on the cost: the guard saves the network requests, not the
 * bytes. The layout imports this module on every build, so both packages
 * (~7 kB gzipped) are in the shared client chunk on Pages too, where they will
 * never run. Tried and rejected: a dynamic `import()` behind the same guard,
 * which Next still resolves into the page's script list at build time, so it
 * bought nothing but indirection. That 7 kB is inside the budget below, and
 * the comment is here so nobody re-runs the experiment.
 */
export function Telemetry() {
  if (!process.env.VERCEL) return null

  return (
    <>
      <Analytics mode="production" />
      <SpeedInsights />
    </>
  )
}
