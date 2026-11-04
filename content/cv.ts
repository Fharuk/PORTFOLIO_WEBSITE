import { projects, site, type Credential } from '@/content/site'

/**
 * The CV, composed rather than duplicated.
 *
 * Every fact here is drawn from content/site.ts — this file only decides
 * *which* facts a two-page document carries and in what order. Nothing is
 * restated in prose that could drift away from the site, and nothing is
 * asserted here that the site does not already say.
 *
 * The one deliberate omission: the CV shows six of the twenty-nine builds.
 * A two-page document that lists thirty software demos reads as a list, not
 * as a person. The full catalogue — and a case study for every record — lives
 * on the site, which is what /cv points at.
 */

/** Projects worth a line when there are only six lines to spend. */
export const cvProjectSlugs = [
  'power-predictive-maintenance',
  'automatic-power-stabilizer',
  'energy-grid-agent',
  'breast-cancer-classifier',
  'lagos-route-optimisation',
  'olfactory-signal-modelling',
] as const

export const cvProjects = cvProjectSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is (typeof projects)[number] => Boolean(p))

/**
 * Two sentences of positioning, in the first person, taken from the same
 * material as the hero and About section. Written once here because a CV
 * summary is its own genre: it has to survive being read in nine seconds.
 */
export const cvProfile =
  'Electrical and electronics engineer working across power systems, applied machine learning and project planning. I have built physics-informed and deep-learning models for industrial fault diagnosis and predictive maintenance, planned offshore-wind and pipeline scopes in Primavera P6, and supported IT systems professionally since 2020 — while completing an MSc in Financial Engineering at WorldQuant University. The through-line is engineering under constraint: a model is finished when it survives a schedule, a budget and a real limitation.'

/** Where the whole record lives. One address, not three. */
export const cvSite = 'faruk-portfolio-eight.vercel.app'

export const cvSiteLabel = cvSite.replace(/^https?:\/\//, '')

/**
 * The year an achievement was issued, pulled from the issuer string.
 *
 * The strings in site.ts are hand-written ("Google / Coursera · 7 courses ·
 * Oct 2026"), so this takes the last `Mon YYYY` in the string rather than
 * trusting a position. If nothing matches, the credential simply carries no
 * year — better than guessing one.
 */
export function credentialYear(credential: Credential): string | undefined {
  const matches = credential.issuer.match(/[A-Z][a-z]{2} \d{4}/g)
  return matches?.at(-1)
}

/**
 * The issuer line with the issue date removed, every other qualifier kept.
 *
 * `Google / Coursera · 7 courses · Oct 2026` → `Google / Coursera · 7 courses`
 * `Seal-Sea Concept · Feb 2024 · training certificate, not PMI PMP`
 *   → `Seal-Sea Concept · training certificate, not PMI PMP`
 *
 * Dropping to just the first segment would be tidier and would quietly lose
 * the qualifiers that stop a reader misreading what a certificate is.
 */
export function credentialIssuer(credential: Credential): string {
  return credential.issuer
    .split('·')
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !/^[A-Z][a-z]{2} \d{4}$/.test(part))
    .join(' · ')
}

export const cvCredentialGroups = Object.entries(site.credentials).map(
  ([group, credentials]) => ({
    group,
    credentials: credentials as Credential[],
    verified: (credentials as Credential[]).filter((c) => Boolean(c.verify)).length,
  }),
)

export const cvCredentialCount = cvCredentialGroups.reduce(
  (total, g) => total + g.credentials.length,
  0,
)

export const cvVerifiedCount = cvCredentialGroups.reduce(
  (total, g) => total + g.verified,
  0,
)

/**
 * The DOI for a research record, from its Zenodo record number.
 *
 * Zenodo mints `10.5281/zenodo.<record id>`, so this is a derivation rather
 * than a guess — and it beats printing a URL on paper, because a DOI is the
 * identifier a citation is checked against.
 */
export function doiFor(record: { href: string }): string | undefined {
  const id = record.href.match(/zenodo\.org\/records\/(\d+)/)?.[1]
  return id ? `10.5281/zenodo.${id}` : undefined
}

/** The caveat that keeps every number on the page honest. */
export const cvNote =
  'Project figures are simulation, prototype or dataset-level results as reported in the project materials — not field performance. The Primavera P6 models are planning exercises, not executed projects or approved contract values. Research records are not peer-reviewed publications.'
