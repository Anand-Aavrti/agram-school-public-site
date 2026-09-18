import ApplyClient from './ApplyClient'
import { getPageMetadata, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

export async function generateMetadata() {
  return getPageMetadata('/admissions/apply', {
    fallbackTitle: `Apply Online — Admissions 2026–27 | ${SCHOOL_NAME}`,
    fallbackDescription: `Start your child’s application to ${SCHOOL_NAME}, ${SCHOOL_CITY} online — under ten minutes, no documents needed yet. Our admissions team calls back within one working day.`,
  })
}

export default function Page() {
  const schema = breadcrumbSchema([
    { name: 'Admissions', path: '/admissions' },
    { name: 'Apply', path: '/admissions/apply' },
  ])

  return (
    <>
      <JsonLd data={schema} />
      <ApplyClient />
    </>
  )
}
