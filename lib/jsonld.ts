import { site } from '@/content/site'
import { absolute, siteOrigin } from '@/lib/site-url'

/**
 * schema.org description of the person and the page.
 *
 * Why this exists: the site is one long HTML page, which is legible to a human
 * and almost opaque to a crawler that wants to answer "who is this, what are
 * his credentials, what has he published". Search engines and answer engines
 * (Google, Bing, and the AI ones that quote rather than link) read JSON-LD to
 * decide that — and to decide whether a number is attributable to a real
 * record. Everything here is derived from `content/site.ts`, so it cannot drift
 * from the visible copy.
 *
 * Two deliberate omissions:
 *   - No givenName/familyName split. The order of "Akinmade Faruq Adeoye" is
 *     the subject's, and guessing which part is the surname would be a
 *     confident error.
 *   - No degree from a school he has not finished. The in-progress degrees are
 *     marked as such in `alumniOf` via the credential's own wording.
 */

const link = (label: string) =>
  site.contact.links.find((l) => l.label === label)?.href

const linkedin = link('LinkedIn')
const github = link('GitHub')

const personId = `${siteOrigin}/#person`

/** "Google / Coursera · 7 courses · Oct 2026" → "Google / Coursera" */
const issuerOf = (issuer: string) => issuer.split(' · ')[0]

const credentials = Object.values(site.credentials)
  .flat()
  .map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.title,
    credentialCategory: 'certificate',
    recognizedBy: { '@type': 'Organization', name: issuerOf(c.issuer) },
    ...(c.verify ? { url: c.verify } : {}),
  }))

const alumniOf = site.education.map((e) => ({
  '@type': 'CollegeOrUniversity',
  name: e.school,
}))

const knowsAbout = [
  'Power systems',
  'Control systems',
  'Signal processing',
  'Embedded systems',
  'Applied machine learning',
  'Physics-informed machine learning',
  'Primavera P6 project planning',
  'Energy transition',
  'Technical support',
]

const person = {
  '@type': 'Person',
  '@id': personId,
  name: site.fullName,
  // A nickname, nothing more. schema.org has no "nickname" term, and
  // alternateName is the neutral one; it must never be read as a title.
  alternateName: site.nickname,
  jobTitle: site.role,
  description: site.positioning,
  url: siteOrigin,
  image: absolute('/portrait.jpg'),
  email: `mailto:${site.contact.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
  alumniOf,
  knowsAbout,
  hasCredential: credentials,
  ...(linkedin || github
    ? { sameAs: [linkedin, github].filter((v): v is string => Boolean(v)) }
    : {}),
}

const website = {
  '@type': 'WebSite',
  '@id': `${siteOrigin}/#website`,
  url: siteOrigin,
  name: `${site.fullName} — ${site.role}`,
  inLanguage: 'en',
  publisher: { '@id': personId },
}

/**
 * The conference paper, described as an article rather than a project so that
 * a citation engine can attribute it. There is no DOI in the record we were
 * given, so none is claimed.
 */
const article = {
  '@type': 'ScholarlyArticle',
  '@id': `${siteOrigin}/#credit-risk-paper`,
  headline:
    'Explainable Machine Learning for Credit Risk Assessment Under Macroeconomic Stress: A Nigerian Economic Context Framework',
  author: { '@id': personId },
  datePublished: '2026',
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: '10th International Conference on ICICPE',
  },
}

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [person, website, article],
}
