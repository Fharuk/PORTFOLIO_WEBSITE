'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/content/site'
import { LiquidName } from './liquid-name'
import { ShaderField } from './shader-field'

/**
 * One orchestrated page-load moment, then nothing unprompted.
 * Everything else on this page animates because the person did something.
 */
export function Hero() {
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-[clamp(2rem,6vh,4rem)]"
    >
      <ShaderField />

      <div className="shell relative z-10 w-full">
        {/* The word itself, poured. */}
        <div
          className="relative mx-auto w-full"
          style={{
            height: 'clamp(7rem, 26vw, 23rem)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(18px)',
            transition:
              'opacity 900ms var(--ease-out-quint), transform 1200ms var(--ease-out-quint)',
          }}
        >
          <LiquidName text={site.name} fit={0.92} className="absolute inset-0" />
        </div>

        <div
          className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:items-start md:gap-16"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(12px)',
            transition:
              'opacity 900ms var(--ease-out-quint) 320ms, transform 1100ms var(--ease-out-quint) 320ms',
          }}
        >
          <div className="flex flex-col gap-3">
            <p className="text-[var(--color-bone)]">
              <span className="block text-[1.0625rem] font-medium">{site.role}</span>
              <span className="block text-[0.9375rem] text-[var(--color-haze)]">
                {site.location}
              </span>
            </p>
            <div className="h-px w-16 bg-[color-mix(in_oklab,var(--color-bone)_24%,transparent)]" />
            <p className="max-w-[26ch] text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
              Real-time graphics, interface engineering, and the frame budget in
              between.
            </p>
          </div>

          <div className="flex flex-col items-start gap-8">
            <p className="lede">{site.positioning}</p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#flight"
                className="glass group inline-flex items-center gap-2.5 rounded-full py-3 pl-5 pr-4 text-[0.9375rem] font-medium text-[var(--color-bone)] transition-transform duration-150 ease-[var(--ease-out-quint)] active:scale-[0.97]"
              >
                Scroll into the work
                <span
                  aria-hidden="true"
                  className="grid size-6 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-bone)_14%,transparent)] transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-y-0.5"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v10M2 7l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center rounded-full px-4 py-3 text-[0.9375rem] text-[var(--color-mist)] transition-colors duration-200 hover:text-[var(--color-bone)]"
              >
                <span className="link">Get in touch</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
