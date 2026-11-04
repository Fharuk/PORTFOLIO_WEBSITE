import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyView } from '@/components/work/case-study'
import { caseStudySlugs, getCaseStudy } from '@/content/case-studies'
import { site } from '@/content/site'
import { p } from '@/lib/site-url'

/**
 * One page per case study, prerendered.
 *
 * `dynamicParams = false` is what makes this safe under `output: 'export'`:
 * every slug must exist at build time, so an unknown one is a build-time 404
 * rather than a runtime surprise on a host with no server.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}

  const title = `${study.title} — ${site.fullName}`
  const description = study.summary
  const url = p(`/work/${study.slug}`)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: site.fullName,
      locale: 'en_NG',
      url,
      images: [
        {
          url: p('/og.png'),
          width: 1200,
          height: 630,
          alt: study.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [p('/og.png')],
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()
  return <CaseStudyView study={study} />
}
