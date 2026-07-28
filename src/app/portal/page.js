import PortalClient from './PortalClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/portal', {
    fallbackTitle: 'Parent, Student & Staff Portal | Agram Open School',
    fallbackDescription: 'The Agram Open School online portal for report cards, circulars, fee receipts and attendance — launching soon, grade by grade.',
  })
}

export default function Page() {
  const schema = [
    breadcrumbSchema([{ name: 'Portal', path: '/portal' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/portal#webpage`,
      url: `${SITE_URL}/portal`,
      name: 'Agram Open School Portal',
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <PortalClient />
    </>
  )
}
