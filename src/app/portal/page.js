import PortalClient from './PortalClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_NAME } from '@/lib/branding'

export async function generateMetadata() {
  return getPageMetadata('/portal', {
    fallbackTitle: `Parent, Student & Staff Portal | ${SCHOOL_NAME}`,
    fallbackDescription: `The ${SCHOOL_NAME} online portal for report cards, circulars, fee receipts and attendance — launching soon, grade by grade.`,
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
      name: `${SCHOOL_NAME} Portal`,
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
