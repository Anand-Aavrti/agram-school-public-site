import CareersClient from './CareersClient'
import { getPageMetadata, breadcrumbSchema, getCollectionAtBuild, isVisible, ORG_CONTACT, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

export async function generateMetadata() {
  return getPageMetadata('/careers', {
    fallbackTitle: `Careers — Teaching & Staff Openings | ${SCHOOL_NAME}`,
    fallbackDescription: `Teach at ${SCHOOL_NAME}, ${SCHOOL_CITY}. We hire for patience and subject mastery, with small classes, structured mentoring and growth from within. See open positions and apply.`,
  })
}

const toISODate = (v) => {
  if (!v) return undefined
  const d = v?.toDate ? v.toDate() : new Date(v)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export default async function Page() {
  const today = new Date().toISOString().slice(0, 10)
  const jobs = (await getCollectionAtBuild('jobs', { orderByField: 'createdAt', orderDir: 'desc' }))
    .filter(isVisible)
    .filter(j => !j.lastDate || j.lastDate >= today)

  const schema = [
    breadcrumbSchema([{ name: 'Careers', path: '/careers' }]),
    ...jobs.map(j => ({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: j.title,
      description: j.description || j.title,
      datePosted: toISODate(j.createdAt) || today,
      ...(j.lastDate ? { validThrough: toISODate(j.lastDate) } : {}),
      employmentType: j.type ? j.type.toUpperCase().replace(/[\s-]+/g, '_') : 'FULL_TIME',
      hiringOrganization: { '@id': `${SITE_URL}/#organization` },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: ORG_CONTACT.addressLocality,
          addressRegion: ORG_CONTACT.addressRegion,
          addressCountry: ORG_CONTACT.addressCountry,
        },
      },
    })),
  ]

  return (
    <>
      <JsonLd data={schema} />
      <CareersClient />
    </>
  )
}
