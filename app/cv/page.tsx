import type { Metadata } from 'next'
import { CvDocument } from '@/components/cv/cv-document'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'
import { absolute } from '@/lib/site-url'

export const metadata: Metadata = {
  ...pageMetadata({
    path: '/cv',
    title: `Curriculum vitae — ${site.fullName}`,
  }),
  other: {
    // Signals that the PDF beside this page is the printable form of it.
    'citation_pdf_url': absolute('/cv/akinmade-faruq-adeoye-cv.pdf'),
  },
}

export default function CvPage() {
  return <CvDocument />
}
