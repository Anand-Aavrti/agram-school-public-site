import ContactClient from './ContactClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/contact', {
    fallbackTitle: 'Contact Us — Agram Open School, Surat',
    fallbackDescription: 'Questions about admissions, fees or a campus visit? Call, write or visit Agram Open School in Surat — we respond within one working day.',
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
      name: 'Contact Agram Open School',
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
