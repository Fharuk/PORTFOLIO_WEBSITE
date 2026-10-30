import type { ReactNode } from 'react'
import { Statement } from '@/components/sections/statement'
import { Flight } from '@/components/work/flight'
import { Work } from '@/components/sections/work'
import { Planning, Research } from '@/components/sections/delivery'
import { About } from '@/components/sections/about'
import { Experience, Credentials } from '@/components/sections/experience'
import { Contact, Footer } from '@/components/sections/contact'

export type VariantKey = 'flux' | 'chrome' | 'energy'

/**
 * Every variant renders the same page. Only the hero — and the accent tokens
 * hung off data-variant — differ. Building it this way means a fix to the work
 * catalogue lands in all three at once.
 */
export function SiteShell({
  variant,
  hero,
}: {
  variant: VariantKey
  hero: ReactNode
}) {
  return (
    <div data-variant={variant}>
      {/* tabIndex -1 so the skip link can actually move focus here, not just
          scroll. outline-none only suppresses the ring on this wrapper. */}
      <main id="main" tabIndex={-1} className="outline-none">
        {hero}
        <Statement />
        <Flight />
        <Work />
        <Planning />
        <Research />
        <About />
        <Experience />
        <Credentials />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}
