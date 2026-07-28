import DisclosureClient from './DisclosureClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/disclosure', {
    fallbackTitle: 'Mandatory Disclosure — NIOS Compliance | Agram Open School',
    fallbackDescription: 'Affiliation, safety and statutory documents published by Agram Open School, Surat as required by NIOS (National Institute of Open Schooling).',
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
