'use client'

import { useState } from 'react'
import { site } from '@/content/site'

export function Contact() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard can be blocked; the mailto link is the fallback.
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] border border-[color-mix(in_oklab,var(--color-shale)_70%,transparent)] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,7vw,6rem)]">
          {/* one quiet iridescent wash, borrowed from the chrome */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(60% 80% at 12% 10%, rgba(138,180,255,0.16) 0%, transparent 60%), radial-gradient(50% 70% at 88% 90%, rgba(201,163,255,0.13) 0%, transparent 62%), radial-gradient(40% 60% at 70% 30%, rgba(255,207,138,0.08) 0%, transparent 60%)',
            }}
          />

          <div className="relative grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2
                id="contact-heading"
                className="display"
                style={{ fontSize: 'clamp(2.25rem,6.5vw,5.25rem)' }}
              >
                Let&rsquo;s make
                <br />
                something that
                <br />
                moves.
              </h2>

              <p className="mt-6 max-w-[46ch] text-[0.975rem] leading-relaxed text-[var(--color-haze)]">
                Available for freelance and full-time work. If the brief involves
                a frame budget, a shader, or a detail nobody asked for yet, I want
                to hear it.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={copy}
                aria-live="polite"
                className="glass group inline-flex items-center gap-3 rounded-full py-3 pl-5 pr-3 text-[0.9375rem] text-[var(--color-bone)] transition-transform duration-150 ease-[var(--ease-out-quint)] active:scale-[0.97]"
              >
                <span>{copied ? 'Copied to clipboard' : site.email}</span>
                <span
                  aria-hidden="true"
                  className="grid size-7 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-bone)_14%,transparent)]"
                >
                  {copied ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6.4l2.6 2.6L10 3.4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8 4V2.6A1.1 1.1 0 006.9 1.5H2.6A1.1 1.1 0 001.5 2.6v4.3A1.1 1.1 0 002.6 8H4" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  )}
                </span>
              </button>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="link text-[0.9375rem] text-[var(--color-mist)]">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[color-mix(in_oklab,var(--color-shale)_55%,transparent)] py-10">
      <div className="shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.875rem] text-[var(--color-haze)]">
          © {new Date().getFullYear()} {site.fullName}
        </p>
        <p className="text-[0.875rem] text-[var(--color-haze)]">
          Rendered with WebGL. Built with Next.js, Three.js and a shader or two.
        </p>
        <a
          href="#top"
          className="link w-fit text-[0.875rem] text-[var(--color-mist)]"
        >
          Back to top
        </a>
      </div>
    </footer>
  )
}
