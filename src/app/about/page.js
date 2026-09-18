import AboutClient from './AboutClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

export async function generateMetadata() {
  return getPageMetadata('/about', {
    fallbackTitle: `About Us — ${SCHOOL_NAME}, ${SCHOOL_CITY}`,
    fallbackDescription: `Founded in 1995, ${SCHOOL_NAME} is a co-educational school offering a full curriculum from the primary years through Grade 12. Our story, vision, mission, values and campus infrastructure.`,
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
      name: `About ${SCHOOL_NAME}`,
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
