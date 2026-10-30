'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { site } from '@/content/site'
import { LiquidName } from './liquid-name'

const ChromeScene = dynamic(
  () => import('./chrome-scene').then((m) => m.ChromeScene),
  { ssr: false, loading: () => null },
)

/**
 * Variant B — liquid chrome, three-dimensional.
 *
 * The distorted chrome form sits behind the liquid-metal wordmark, so the
 * letters reflect through a hole in the same material that surrounds them.
 * The three headline lines from the other variants collapse into a single
 * subline here: chrome is the argument, and type should not compete with it.
 */
export function ChromeHero() {
  const [mounted, setMounted] = useState(false)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    const coarse = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    if (!coarse.matches) setLive(true)
    else setLive(false)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24 pb-[clamp(2rem,5vh,3.5rem)]"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[var(--color-void)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(50% 50% at 68% 42%, rgba(120,140,190,0.20) 0%, transparent 62%)',
            'radial-gradient(44% 44% at 26% 68%, rgba(190,160,130,0.12) 0%, transparent 60%)',
          ].join(','),
        }}
      />

      {/* 3D chrome, mounted only where a real pointer exists */}
      {live && (
        <div aria-hidden="true" className="absolute inset-0 opacity-90">
          <ChromeScene />
        </div>
      )}

      {/* fallback chrome form for touch / no-WebGL */}
      {!live && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute right-[6%] top-[22%] size-[46vw] max-w-[520px] rounded-full opacity-70 blur-[1px]"
            style={{
              background:
                'radial-gradient(circle at 34% 28%, #f6f7fb 0%, #b9c1d2 18%, #4a5266 42%, #1a1e2a 62%, #0a0d16 80%)',
            }}
          />
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="shell relative z-10 w-full pt-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span
            className="text-[clamp(1.05rem,1.6vw,1.35rem)] text-[var(--color-bone)]"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
          >
            {site.fullName}
          </span>
          <span className="text-[0.9375rem] text-[var(--color-haze)]">{site.role}</span>
        </div>
      </div>

      <div className="shell relative z-10 w-full">
        <div
          className="relative mx-auto w-full"
          style={{
            height: 'clamp(6rem, 22vw, 20rem)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(16px)',
            transition:
              'opacity 900ms var(--ease-out-quint), transform 1200ms var(--ease-out-quint)',
          }}
        >
          <LiquidName text={site.name} fit={0.94} className="absolute inset-0" />
        </div>
      </div>

      <div className="shell relative z-10 w-full">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="lede max-w-[40ch]">{site.hero.sub}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
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

          <p className="max-w-[22ch] text-[0.875rem] leading-relaxed text-[var(--color-haze)] md:text-right">
            {site.discipline}
          </p>
        </div>
      </div>
    </section>
  )
}
