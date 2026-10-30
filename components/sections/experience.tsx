'use client'

import { useState } from 'react'
import { site } from '@/content/site'

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="section">
      <div className="shell">
        <div className="mb-[clamp(2rem,4vw,3rem)] grid gap-6 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <h2 id="experience-heading" className="h2">
            Experience
          </h2>
          <p className="max-w-[52ch] text-[0.975rem] leading-relaxed text-[var(--color-haze)]">
            A cross-sector path through technical support, logistics, teaching
            and project coordination — each one a different kind of constraint.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <dl className="m-0">
              <dt className="text-[0.8125rem] text-[var(--color-haze)]">Education</dt>
              <dd className="m-0 mt-2">
                <p className="text-[1.0625rem] leading-snug text-[var(--color-bone)]">
                  {site.education.degree}
                </p>
                <p className="mt-1 max-w-[34ch] text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
                  {site.education.school}
                </p>
                <p className="tabular mt-1 text-[0.8125rem] text-[var(--color-haze)]">
                  {site.education.date}
                </p>
              </dd>
            </dl>

            <hr className="rule my-8" />

            <dl className="m-0 flex flex-col gap-6">
              {site.leadership.map((l) => (
                <div key={l.title}>
                  <dt className="text-[1rem] text-[var(--color-bone)]">{l.title}</dt>
                  <dd className="m-0 mt-0.5 text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
                    {l.org}
                    <br />
                    {l.summary}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ol className="list-none p-0">
            {site.experience.map((r) => (
              <li
                key={r.title + r.period}
                className="grid gap-1.5 border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)] py-6 first:pt-0 last:border-b sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6"
              >
                <span className="tabular pt-1 text-[0.8125rem] text-[var(--color-haze)]">
                  {r.period}
                </span>
                <div>
                  <p className="text-[1.0625rem] leading-snug text-[var(--color-bone)]">
                    {r.title}
                  </p>
                  <p className="mt-0.5 text-[0.875rem] text-[var(--color-mist)]">{r.org}</p>
                  <p className="mt-2 max-w-[56ch] text-[0.9rem] leading-relaxed text-[var(--color-haze)]">
                    {r.summary}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * Credentials, grouped and collapsed by default.
 *
 * 28 certificates in one flat list is a wall nobody reads. Grouping them by what
 * they are for, and letting each group close, keeps the section scannable while
 * keeping every item available. Built on <details> so it works without JS.
 */
export function Credentials() {
  const [open, setOpen] = useState<string | null>('Project & leadership')
  const groups = Object.entries(site.credentials)
  const total = groups.reduce((n, [, list]) => n + list.length, 0)

  return (
    <section id="credentials" aria-labelledby="credentials-heading" className="section pt-0">
      <div className="shell">
        <div className="mb-[clamp(2rem,4vw,3rem)] grid gap-6 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:items-end">
          <div>
            <h2 id="credentials-heading" className="h2">
              Learning, on record
            </h2>
            <p className="mt-3 text-[0.875rem] text-[var(--color-haze)]">
              {total} certificates and training records, grouped by what they are for.
            </p>
          </div>
        </div>

        <div className="border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)]">
          {groups.map(([group, list]) => {
            const isOpen = open === group
            return (
              <div
                key={group}
                className="border-b border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)]"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : group)}
                    aria-expanded={isOpen}
                    aria-controls={`cred-${group}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[clamp(1.05rem,1.6vw,1.3rem)] text-[var(--color-bone)]">
                      {group}
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="tabular text-[0.8125rem] text-[var(--color-haze)]">
                        {list.length}
                      </span>
                      <span
                        aria-hidden="true"
                        className="grid size-7 place-items-center rounded-full border border-[color-mix(in_oklab,var(--color-bone)_16%,transparent)] transition-transform duration-300 ease-[var(--ease-out-quint)]"
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </span>
                  </button>
                </h3>

                <div
                  id={`cred-${group}`}
                  hidden={!isOpen}
                  className="grid gap-x-12 gap-y-5 pb-7 sm:grid-cols-2"
                >
                  {list.map((c) => (
                    <div key={c.title}>
                      <p className="text-[0.9375rem] leading-snug text-[var(--color-mist)]">
                        {c.title}
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-[var(--color-haze)]">
                        {c.issuer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
