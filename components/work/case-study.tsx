import Link from 'next/link'
import { caseStudies, metricNote, type CaseStudy } from '@/content/case-studies'
import { site } from '@/content/site'
import { absolute } from '@/lib/site-url'

/**
 * One case study.
 *
 * Server-rendered on purpose: these pages are the ones a search engine, a
 * recruiter or a citation engine lands on directly, so there is no client
 * JavaScript in the reading path at all — no filter state, no motion, nothing
 * that has to hydrate before the text exists.
 *
 * Layout follows the record rather than a template: the numbered sections
 * appear only where the record has something to say, and the metric is always
 * stated as the record states it.
 */
export function CaseStudyView({ study }: { study: CaseStudy }) {
  const index = caseStudies.findIndex((c) => c.slug === study.slug)
  const prev = index > 0 ? caseStudies[index - 1] : undefined
  const next = index < caseStudies.length - 1 ? caseStudies[index + 1] : undefined
  const detail = study.detail

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: study.title,
    description: study.summary,
    url: absolute(`/work/${study.slug}`),
    author: { '@type': 'Person', name: site.fullName, url: absolute('/') },
    keywords: [study.eyebrow, 'electrical engineering', 'Nigeria'].join(', '),
    ...(study.links.length ? { sameAs: study.links.map((l) => l.href) } : {}),
    ...(study.published
      ? {
          identifier: `https://doi.org/${study.published.doi}`,
          editor: study.published.editors?.map((name) => ({
            '@type': 'Person',
            name: name.split(', ').reverse().join(' '),
          })),
        }
      : {}),
  }

  return (
    <div data-variant="flux">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main" tabIndex={-1} className="outline-none">
        <article className="section pt-[clamp(5rem,12vw,8rem)]">
          <div className="shell">
            <Link
              href="/work"
              className="link inline-flex items-center gap-2 text-[0.875rem] text-[var(--color-haze)] transition-colors duration-150 hover:text-[var(--color-bone)]"
            >
              <span aria-hidden="true">←</span> All work
            </Link>

            <header className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:items-end">
              <div>
                <p className="tabular text-[0.8125rem] uppercase tracking-[0.16em] text-[var(--color-haze)]">
                  {study.eyebrow}
                </p>
                <h1
                  className="mt-4 max-w-[24ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] tracking-[-0.035em] text-[var(--color-bone)]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 340 }}
                >
                  {study.title}
                </h1>
                <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-[var(--color-mist)]">
                  {study.summary}
                </p>

                {/* The publication record, verbatim: the full title it was
                    published under, its DOI, and the editor Zenodo names. The
                    h1 above is the short name a card can hold; this is the one
                    a citation has to match. */}
                {study.published && (
                  <div
                    className="mt-8 max-w-[62ch] border-l-2 pl-4"
                    style={{ borderColor: 'color-mix(in oklab, var(--accent-2) 55%, transparent)' }}
                  >
                    <p className="tabular text-[0.75rem] uppercase tracking-[0.14em] text-[var(--color-haze)]">
                      Published record
                    </p>
                    <p className="mt-2 text-[0.9375rem] leading-snug text-[var(--color-bone)]">
                      {study.published.title}
                    </p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--color-haze)]">
                      {study.published.venue} · DOI{' '}
                      <a
                        href={`https://doi.org/${study.published.doi}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link text-[var(--color-mist)]"
                      >
                        {study.published.doi}
                      </a>
                      {study.published.editors?.length
                        ? ` · edited by ${study.published.editors
                            .map((name) => name.split(', ').reverse().join(' '))
                            .join(', ')}`
                        : ''}
                    </p>
                  </div>
                )}
              </div>

              <div className="md:justify-self-end md:text-right">
                <p className="text-[0.8125rem] text-[var(--color-haze)]">
                  {study.kind === 'planning-model' ? 'Modelled budget' : 'Headline figure'}
                </p>
                <p className="metric mt-1 text-[clamp(1.35rem,2.4vw,1.85rem)]">
                  {study.metric}
                </p>
              </div>
            </header>

            {detail && (
              <div className="mt-[clamp(3rem,6vw,4.5rem)] flex flex-col gap-10">
                <Section n="01" title="The constraint">
                  {detail.context}
                </Section>
                <Section n="02" title="How it was built">{detail.approach}</Section>
                <Section n="03" title="What the record reports">
                  {detail.result}
                </Section>
                {detail.limits && (
                  <Section n="04" title="What it does not claim">
                    {detail.limits}
                  </Section>
                )}
              </div>
            )}

            {detail?.figures && (
              <div className="mt-[clamp(3rem,6vw,4rem)]">
                <h2 className="h3">The numbers</h2>
                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--color-bone)_12%,transparent)] sm:grid-cols-3 lg:grid-cols-5">
                  {detail.figures.map((f) => (
                    <div
                      key={f.label}
                      className="bg-[color-mix(in_oklab,var(--color-slate)_45%,transparent)] p-5"
                    >
                      <dt className="text-[0.75rem] uppercase tracking-[0.12em] text-[var(--color-haze)]">
                        {f.label}
                      </dt>
                      <dd className="tabular m-0 mt-2 text-[1.35rem] text-[var(--color-bone)]">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-[clamp(3rem,6vw,4rem)] grid gap-8 border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)] pt-8 md:grid-cols-2">
              <div>
                <h2 className="text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-haze)]">
                  {study.links.some((l) => l.label === 'Live demo')
                    ? 'Live system, code and record'
                    : study.links.length
                      ? 'The primary record'
                      : 'About these figures'}
                </h2>
                {study.links.length ? (
                  <ul className="m-0 mt-3 list-none p-0">
                    {study.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="link text-[0.9375rem] text-[var(--color-mist)] transition-colors duration-150 hover:text-[var(--color-bone)]"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 max-w-[46ch] text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
                    No public artefact is attached to this record.
                  </p>
                )}
              </div>

              <div className="md:justify-self-end md:max-w-[46ch] md:text-right">
                <p className="text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
                  {metricNote}
                </p>
                <a
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(study.title)}`}
                  className="link mt-3 inline-block text-[0.875rem] text-[var(--color-mist)]"
                >
                  Ask about this work
                </a>
              </div>
            </div>

            <nav
              aria-label="More case studies"
              className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-4 border-t border-[color-mix(in_oklab,var(--color-shale)_60%,transparent)] pt-8 sm:grid-cols-2"
            >
              {prev ? (
                <Link href={`/work/${prev.slug}`} className="group">
                  <span className="text-[0.75rem] uppercase tracking-[0.12em] text-[var(--color-haze)]">
                    Previous
                  </span>
                  <span className="mt-1 block text-[1.0625rem] text-[var(--color-mist)] transition-colors duration-150 group-hover:text-[var(--color-bone)]">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/work/${next.slug}`} className="group sm:text-right">
                  <span className="text-[0.75rem] uppercase tracking-[0.12em] text-[var(--color-haze)]">
                    Next
                  </span>
                  <span className="mt-1 block text-[1.0625rem] text-[var(--color-mist)] transition-colors duration-150 group-hover:text-[var(--color-bone)]">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          </div>
        </article>
      </main>
    </div>
  )
}

function Section({
  n,
  title,
  children,
}: {
  n: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-2 md:grid-cols-[minmax(0,0.24fr)_minmax(0,0.76fr)] md:gap-x-14 md:gap-y-0">
      <h2 className="flex items-baseline gap-3 text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-haze)]">
        <span className="tabular opacity-60">{n}</span>
        {title}
      </h2>
      <p className="max-w-[62ch] text-[1.0625rem] leading-relaxed text-[var(--color-mist)]">
        {children}
      </p>
    </section>
  )
}
