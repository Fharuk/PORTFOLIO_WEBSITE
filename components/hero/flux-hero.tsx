'use client'

import { useEffect, useState } from 'react'
import { site } from '@/content/site'
import { fluxFragment } from '@/lib/shaders/flux-field'
import { ShaderSurface } from './shader-surface'

/**
 * Variant A — flux.
 * Field lines of a dipole, with the name set in type rather than in metal:
 * this reading is about the engineering, not the material.
 */
export function FluxHero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const lines = [site.hero.lead, site.hero.mid, site.hero.tail]

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-[clamp(2rem,5vh,3.5rem)] pt-28"
    >
      {/* Always-painted field; the shader layers on top of it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(52% 46% at 30% 30%, var(--field-a) 0%, transparent 62%)',
            'radial-gradient(44% 40% at 74% 62%, var(--field-b) 0%, transparent 60%)',
            'linear-gradient(180deg, #05070f 0%, #070b18 60%, #04060e 100%)',
          ].join(','),
        }}
      />
      <div className="absolute inset-0 opacity-90">
        <ShaderSurface fragment={fluxFragment} className="block h-full w-full" />
      </div>

      {/* legibility floor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,6,14,0.55) 0%, rgba(4,6,14,0.10) 34%, rgba(4,6,14,0.72) 82%, var(--color-void) 100%)',
        }}
      />

      <div className="shell relative z-10 w-full">
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(14px)',
            transition:
              'opacity 900ms var(--ease-out-quint), transform 1200ms var(--ease-out-quint)',
          }}
        >
          <div className="mb-[clamp(1.5rem,4vh,3rem)] flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className="text-[clamp(1.05rem,1.6vw,1.35rem)] text-[var(--color-bone)]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              {site.fullName}
            </span>
            <span className="text-[0.9375rem] text-[var(--color-haze)]">{site.role}</span>
          </div>

          <h1 className="display max-w-[16ch]">
            {lines.map((l, i) => (
              <span key={l} className="block reveal-line">
                <span style={{ animationDelay: `${140 + i * 110}ms` }}>{l}</span>
              </span>
            ))}
          </h1>

          <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-end">
            <p className="lede max-w-[42ch]">{site.hero.sub}</p>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <a
                href="#work"
                className="glass group inline-flex items-center gap-2.5 rounded-full py-3 pl-5 pr-4 text-[0.9375rem] font-medium text-[var(--color-bone)] transition-transform duration-150 ease-[var(--ease-out-quint)] active:scale-[0.97]"
              >
                See the work
                <span
                  aria-hidden="true"
                  className="grid size-6 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-bone)_14%,transparent)] transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:translate-y-0.5"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <a href="#contact" className="inline-flex items-center rounded-full px-4 py-3 text-[0.9375rem] text-[var(--color-mist)] transition-colors duration-200 hover:text-[var(--color-bone)]">
                <span className="link">Get in touch</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
