import type { Metadata } from 'next'
import Link from 'next/link'
import { caseStudies } from '@/content/case-studies'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'

/**
 * The index of every case study.
 *
 * It exists because the individual pages are worth nothing without a way to
 * reach them, and because a CV that says "a case study for every project"
 * needs a single address to point at. Grouped the way the work actually
 * divides, not the way the content file happens to be ordered.
 */

export const metadata: Metadata = pageMetadata({
  path: '/work',
  title: `Work — ${caseStudies.length} records · ${site.fullName}`,
})

const planning = caseStudies.filter((s) => s.kind === 'planning-model')
const builds = caseStudies.filter((s) => s.kind === 'project')

const groups = [
  { key: 'engineering', label: 'Engineering' },
  { key: 'ai', label: 'AI & data' },
  { key: 'software', label: 'Software & IT' },
  { key: 'research', label: 'Research' },
] as const

const byEyebrow = (label: string) => builds.filter((s) => s.eyebrow === label)

function Row({ slug, title, metric }: { slug: string; title: string; metric: string }) {
  return (
    <li className="border-t border-[color-mix(in_oklab,var(--color-shale)_55%,transparent)] py-4 first:border-t-0 first:pt-0">
      <Link
        href={`/work/${slug}`}
        className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
      >
        <span className="text-[1rem] leading-snug text-[var(--color-bone)] transition-colors group-hover:text-[var(--color-bone)]">
          {title}
        </span>
        <span className="tabular shrink-0 text-[0.8125rem] text-[var(--color-haze)]">{metric}</span>
      </Link>
    </li>
  )
}

export default function WorkIndex() {
  return (
    <main id="main" tabIndex={-1} className="outline-none" data-variant="flux">
      <article className="section pt-[clamp(4.5rem,10vw,7rem)]">
        <div className="shell">
          <p className="tabular text-[0.8125rem] uppercase tracking-[0.16em] text-[var(--color-haze)]">
            Work · {caseStudies.length} studies
          </p>
          <h1
            className="mt-4 max-w-[26ch] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] tracking-[-0.035em] text-[var(--color-bone)]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 340 }}
          >
            Every record, and what it does not claim.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-relaxed text-[var(--color-mist)]">
            {caseStudies.length} records: {planning.length} Primavera P6 planning models,{' '}
            {site.research.length} research papers and {builds.length - site.research.length}{' '}
            engineering, machine-learning and software builds. Eight carry a full written study;
            the rest are written down exactly as far as their materials go.
          </p>

          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <section aria-labelledby="work-planning">
              <h2
                id="work-planning"
                className="tabular mb-5 text-[0.75rem] uppercase tracking-[0.16em] text-[var(--color-haze)]"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
              >
                Planning models · Primavera P6
              </h2>
              <ul className="list-none p-0">
                {planning.map((study) => (
                  <Row key={study.slug} slug={study.slug} title={study.title} metric={study.metric} />
                ))}
              </ul>
            </section>

            {groups.map((group) => {
              const items = byEyebrow(group.label)
              if (!items.length) return null
              return (
                <section key={group.key} aria-labelledby={`work-${group.key}`}>
                  <h2
                    id={`work-${group.key}`}
                    className="tabular mb-5 text-[0.75rem] uppercase tracking-[0.16em] text-[var(--color-haze)]"
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
                  >
                    {group.label}
                  </h2>
                  <ul className="list-none p-0">
                    {items.map((study) => (
                      <Row
                        key={study.slug}
                        slug={study.slug}
                        title={study.title}
                        metric={study.metric}
                      />
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>

          <p className="mt-14 max-w-[62ch] text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
            Metrics are project- and dataset-level results reported in the project materials.
            Simulation and prototype results are not claims of field performance, and the P6 models
            are planning exercises rather than executed projects.
          </p>

          <p className="mt-6 text-[0.9375rem]">
            <Link href="/cv" className="link text-[var(--color-bone)]">
              Curriculum vitae
            </Link>{' '}
            <span className="text-[var(--color-haze)]">— the whole record on three pages.</span>
          </p>
        </div>
      </article>
    </main>
  )
}
