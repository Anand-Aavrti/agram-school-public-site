import AboutClient from './AboutClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/about', {
    fallbackTitle: 'About Us — Agram Open School, Surat',
    fallbackDescription: 'Founded in 2015 by Agram Charitable Trust, Agram Open School is an NIOS-accredited open school in Surat. Our story, vision, mission, S.P.A.R.K. values and campus infrastructure.',
  })
}

export default function Page() {
  const schema = [
    breadcrumbSchema([{ name: 'About', path: '/about' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${SITE_URL}/about#webpage`,
      url: `${SITE_URL}/about`,
      name: 'About Agram Open School',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
    },
  ]
  return (
    <>
      <JsonLd data={schema} />
      <AboutClient />
    </>
  )
}
