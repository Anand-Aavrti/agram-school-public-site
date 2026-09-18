import ContactClient from './ContactClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

export async function generateMetadata() {
  return getPageMetadata('/contact', {
    fallbackTitle: `Contact Us — ${SCHOOL_NAME}, ${SCHOOL_CITY}`,
    fallbackDescription: `Questions about admissions, fees or a campus visit? Call, write or visit ${SCHOOL_NAME} in ${SCHOOL_CITY} — we respond within one working day.`,
  })
}

export default function Page() {
  const schema = [
    breadcrumbSchema([{ name: 'Contact', path: '/contact' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${SITE_URL}/contact#webpage`,
      url: `${SITE_URL}/contact`,
      name: `Contact ${SCHOOL_NAME}`,
      mainEntity: { '@id': `${SITE_URL}/#organization` },
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <ContactClient />
    </>
  )
}
