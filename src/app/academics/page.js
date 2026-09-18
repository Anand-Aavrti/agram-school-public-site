import AcademicsClient from './AcademicsClient'
import { getPageMetadata, breadcrumbSchema, getCollectionAtBuild, isVisible, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

export async function generateMetadata() {
  return getPageMetadata('/academics', {
    fallbackTitle: `Academics — Curriculum, Streams & Faculty | ${SCHOOL_NAME}`,
    fallbackDescription: `A full curriculum from the foundational years through Grade 12 at ${SCHOOL_NAME}, ${SCHOOL_CITY} — Sciences, Commerce, Humanities & vocational streams, taught for understanding, not just examinations.`,
  })
}

// Shown only when the admin hasn't added academic_streams entries yet — mirrors
// AcademicsClient.jsx's FALLBACK_STREAMS so the schema matches visible content.
const FALLBACK_STREAMS = [
  { id: 'f', name: 'Foundational years', description: 'Literacy and numeracy foundations for our youngest learners, taught in small groups.' },
  { id: 's', name: 'Sciences', description: 'Physics, Chemistry, Biology and Mathematics under the national curriculum.' },
  { id: 'c', name: 'Commerce', description: 'Accountancy, Business Studies and Economics for tomorrow’s entrepreneurs.' },
  { id: 'h', name: 'Humanities & vocational', description: 'History, Political Science, Psychology and vocational subjects, mixable across streams.' },
]

export default async function Page() {
  const streams = await getCollectionAtBuild('academic_streams', { orderByField: 'createdAt', orderDir: 'desc' })
  const list = streams.filter(isVisible).length ? streams.filter(isVisible) : FALLBACK_STREAMS

  const schema = [
    breadcrumbSchema([{ name: 'Academics', path: '/academics' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${SITE_URL}/academics#programmes`,
      name: `Academic streams at ${SCHOOL_NAME}`,
      itemListElement: list.map((s, i) => ({
        '@type': 'Course',
        position: i + 1,
        name: s.name,
        description: s.description || undefined,
        provider: { '@id': `${SITE_URL}/#organization` },
      })),
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <AcademicsClient />
    </>
  )
}
