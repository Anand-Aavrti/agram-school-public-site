import DisclosureClient from './DisclosureClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

export async function generateMetadata() {
  return getPageMetadata('/disclosure', {
    fallbackTitle: `Mandatory Disclosure — Board Compliance | ${SCHOOL_NAME}`,
    fallbackDescription: `Affiliation, safety and statutory documents published by ${SCHOOL_NAME}, ${SCHOOL_CITY} as required by the affiliating board.`,
  })
}

export default function Page() {
  const schema = [
    breadcrumbSchema([{ name: 'Mandatory disclosure', path: '/disclosure' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/disclosure#webpage`,
      url: `${SITE_URL}/disclosure`,
      name: 'Mandatory Disclosure',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <DisclosureClient />
    </>
  )
}
