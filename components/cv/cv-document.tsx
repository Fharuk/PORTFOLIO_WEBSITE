import Link from 'next/link'
import {
  cvCredentialCount,
  cvCredentialGroups,
  cvNote,
  cvProfile,
  cvProjects,
  cvSiteLabel,
  cvVerifiedCount,
  credentialIssuer,
  credentialYear,
} from '@/content/cv'
import { caseStudies } from '@/content/case-studies'
import { site } from '@/content/site'
import { p } from '@/lib/site-url'

/**
 * The CV, as a page.
 *
 * Server-rendered and deliberately quiet: no shader, no scroll choreography,
 * no glass. A CV is a document, and the only motion here is the underline on a
 * link. It prints to A4 — `.cv-*` rules in globals.css collapse the two-column
 * screen layout into one column and hand the page to the print stylesheet.
 *
 * The PDF at /cv/akinmade-faruq-adeoye-cv.pdf is generated from the same
 * content module by scripts/make-cv.mjs, so the two cannot disagree.
 */

const PDF = '/cv/akinmade-faruq-adeoye-cv.pdf'

/**
 * A research record's case study, found by the record it links to rather than
 * by a second hand-written table of slugs that could drift out of sync.
 */
const studyFor = (recordHref: string) =>
  caseStudies.find((study) => study.links.some((link) => link.href === recordHref))?.slug

function Rule() {
  return <hr className="rule my-6" />
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="tabular mb-5 text-[0.75rem] uppercase tracking-[0.16em] text-[var(--color-haze)]"
      style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
    >
      {children}
    </h2>
  )
}

/** A dated row: title on the left, period hard right, detail beneath. */
function Entry({
  title,
  period,
  meta,
  body,
  href,
  metaAccent = false,
}: {
  title: string
  period?: string
  meta?: string
  body?: string
  href?: string
  metaAccent?: boolean
}) {
  return (
    <li className="cv-entry border-t border-[color-mix(in_oklab,var(--color-shale)_55%,transparent)] py-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[1rem] leading-snug text-[var(--color-bone)]">
          {href ? (
            <Link href={href} className="link">
              {title}
            </Link>
          ) : (
            title
          )}
        </p>
        {period && (
          <span className="tabular shrink-0 text-[0.8125rem] text-[var(--color-haze)]">
            {period}
          </span>
        )}
      </div>
      {meta && (
        <p
          className={
            metaAccent
              ? 'mt-1 text-[0.875rem] text-[var(--color-mist)]'
              : 'mt-1 text-[0.875rem] text-[var(--color-haze)]'
          }
        >
          {meta}
        </p>
      )}
      {body && (
        <p className="mt-1.5 max-w-[62ch] text-[0.9rem] leading-relaxed text-[var(--color-haze)]">
          {body}
        </p>
      )}
    </li>
  )
}

export function CvDocument() {
  const links = site.contact.links

  return (
    <main id="main" tabIndex={-1} className="outline-none" data-variant="flux">
      <article className="section cv pt-[clamp(4.5rem,10vw,7rem)]">
        <div className="shell cv-grid">
          {/* ------------------------------------------------ rail */}
          <header className="cv-rail">
            <p className="tabular text-[0.75rem] uppercase tracking-[0.18em] text-[var(--color-haze)] cv-hide-print">
              Curriculum vitae
            </p>
            <h1
              className="mt-3 text-[clamp(2rem,4vw,2.75rem)] leading-[1.02] tracking-[-0.035em] text-[var(--color-bone)]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 340 }}
            >
              {site.fullName}
            </h1>
            <p className="mt-3 text-[0.9375rem] text-[var(--color-mist)]">{site.role}</p>
            <p className="mt-1 text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
              {site.studying}
              <br />
              {site.discipline}
            </p>

            <div className="mt-6 flex flex-col gap-1.5 text-[0.875rem]">
              <a className="link w-fit text-[var(--color-mist)]" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
              <a className="link w-fit text-[var(--color-mist)]" href={site.contact.phoneHref}>
                {site.contact.phone}
              </a>
              <p className="tabular text-[var(--color-haze)]">
                {site.location} · {site.timezone}
              </p>
              {/* The earlier portfolio is a real but stale address — 28
                  certificates and a "graduate" who graduated. A CV is the last
                  place to send a reader there. */}
              {links
                .filter((l) => l.label !== 'Earlier portfolio')
                .map((l) => (
                  <a
                    key={l.label}
                    className="link w-fit text-[var(--color-mist)]"
                    href={l.href}
                    rel="me noopener"
                    target="_blank"
                  >
                    {l.label}
                  </a>
                ))}
            </div>

            {site.available && (
              <p className="mt-6 inline-flex w-fit items-center gap-2 text-[0.8125rem] text-[var(--color-mist)]">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7de2a8] opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[#7de2a8]" />
                </span>
                Available for new roles
              </p>
            )}

            <div className="cv-hide-print mt-6 flex flex-wrap items-center gap-3">
              <a
                href={p(PDF)}
                className="glass inline-flex items-center gap-2 rounded-full py-2.5 pl-5 pr-4 text-[0.875rem] text-[var(--color-bone)] transition-transform duration-150 ease-[var(--ease-out-quint)] active:scale-[0.98]"
                download
              >
                Download PDF
                <span aria-hidden="true">↓</span>
              </a>
              <span className="text-[0.75rem] text-[var(--color-haze)]">A4 · 3 pages</span>
            </div>
          </header>

          {/* ------------------------------------------------ document */}
          <div className="cv-body">
            <section aria-labelledby="cv-profile">
              <SectionHeading id="cv-profile">Profile</SectionHeading>
              <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-[var(--color-mist)]">
                {cvProfile}
              </p>
            </section>

            <Rule />

            <section aria-labelledby="cv-planning">
              <SectionHeading id="cv-planning">Planning models · Primavera P6</SectionHeading>
              <ul className="list-none p-0">
                {site.p6.map((model) => (
                  <Entry
                    key={model.slug}
                    title={model.title}
                    period={model.budget}
                    meta={model.stats.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(' · ')}
                    body={model.summary}
                    href={`/work/${model.slug}`}
                  />
                ))}
              </ul>
              <p className="mt-4 max-w-[62ch] text-[0.8125rem] leading-relaxed text-[var(--color-haze)]">
                {site.p6Note}
              </p>
            </section>

            <Rule />

            <section aria-labelledby="cv-research">
              <SectionHeading id="cv-research">Research record</SectionHeading>
              <ul className="list-none p-0">
                {site.research.map((record) => (
                  <Entry
                    key={record.title}
                    title={record.title}
                    meta={record.method}
                    body={record.finding}
                    href={studyFor(record.href) ? `/work/${studyFor(record.href)}` : undefined}
                  />
                ))}
              </ul>
              <p className="mt-4 max-w-[62ch] text-[0.8125rem] leading-relaxed text-[var(--color-haze)]">
                {site.researchNote}
              </p>
            </section>

            <Rule />

            <section aria-labelledby="cv-builds">
              <SectionHeading id="cv-builds">Selected builds</SectionHeading>
              <ul className="list-none p-0">
                {cvProjects.map((project) => (
                  <Entry
                    key={project.slug}
                    title={project.title}
                    period={project.metric}
                    body={project.desc}
                    href={`/work/${project.slug}`}
                  />
                ))}
              </ul>
              <p className="mt-4 text-[0.8125rem] text-[var(--color-haze)]">
                Six of twenty-six.{' '}
                <Link href="/work" className="link text-[var(--color-mist)]">
                  Every build, with a case study
                </Link>
                .
              </p>
            </section>

            <Rule />

            <section aria-labelledby="cv-experience">
              <SectionHeading id="cv-experience">Experience</SectionHeading>
              <ul className="list-none p-0">
                {site.experience.map((role) => (
                  <Entry
                    key={role.title + role.period}
                    title={role.title}
                    period={role.period}
                    meta={role.org}
                    metaAccent
                    body={role.summary}
                  />
                ))}
              </ul>
            </section>

            <Rule />

            <section aria-labelledby="cv-education">
              <SectionHeading id="cv-education">Education</SectionHeading>
              <ul className="list-none p-0">
                {site.education.map((entry) => (
                  <Entry
                    key={entry.degree}
                    title={entry.degree}
                    period={entry.date}
                    meta={entry.school}
                  />
                ))}
              </ul>
            </section>

            <Rule />

            <section aria-labelledby="cv-leadership">
              <SectionHeading id="cv-leadership">Leadership &amp; service</SectionHeading>
              <ul className="list-none p-0">
                {site.leadership.map((entry) => (
                  <Entry
                    key={entry.title}
                    title={entry.title}
                    meta={entry.org}
                    metaAccent
                    body={entry.summary}
                  />
                ))}
              </ul>
            </section>

            <Rule />

            <section aria-labelledby="cv-certifications">
              <SectionHeading id="cv-certifications">
                Certifications · {cvCredentialCount} records
              </SectionHeading>
              <div className="flex flex-col gap-5">
                {cvCredentialGroups.map((group) => (
                  <div key={group.group}>
                    <h3
                      className="tabular text-[0.75rem] uppercase tracking-[0.12em] text-[var(--color-haze)]"
                      style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
                    >
                      {group.group}
                    </h3>
                    <ul className="mt-2 list-none p-0">
                      {group.credentials.map((credential) => (
                        <li
                          key={credential.title}
                          className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1 text-[0.875rem] leading-snug"
                        >
                          <span className="text-[var(--color-mist)]">{credential.title}</span>
                          <span className="text-[var(--color-haze)]">
                            {credentialIssuer(credential)}
                            {credentialYear(credential) ? ` · ${credentialYear(credential)}` : ''}
                          </span>
                          {credential.verify && (
                            <a
                              href={credential.verify}
                              target="_blank"
                              rel="noopener"
                              className="cv-verify tabular text-[0.75rem] text-[var(--color-haze)] underline decoration-[color-mix(in_oklab,var(--color-haze)_45%,transparent)] underline-offset-2 transition-colors hover:text-[var(--color-bone)]"
                              aria-label={`Verify ${credential.title}`}
                            >
                              verify ↗
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-5 max-w-[62ch] text-[0.8125rem] leading-relaxed text-[var(--color-haze)]">
                {cvVerifiedCount} of the {cvCredentialCount} carry a public verification link from
                the issuer. The rest were issued without one and are listed as they were issued.
              </p>
            </section>

            <Rule />

            <section aria-labelledby="cv-note">
              <SectionHeading id="cv-note">Note on the figures</SectionHeading>
              <p className="max-w-[68ch] text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
                {cvNote}
              </p>
              <p className="mt-4 max-w-[68ch] text-[0.875rem] leading-relaxed text-[var(--color-mist)]">
                Full record, verification links and a case study for every project:{' '}
                <span className="text-[var(--color-bone)]">{cvSiteLabel}</span>
              </p>
            </section>

            <p
              className="mt-10 max-w-[30ch] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-bone)]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 340 }}
            >
              {site.principle}
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
