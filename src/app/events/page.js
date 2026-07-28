import EventsClient from './EventsClient'
import { getPageMetadata, breadcrumbSchema, getCollectionAtBuild, isVisible, ORG_CONTACT, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/events', {
    fallbackTitle: 'School Events & Calendar | Agram Open School',
    fallbackDescription: 'Sports days, exhibitions and celebrations at Agram Open School, Surat — the full upcoming events calendar.',
  })
}

export default async function Page() {
  const today = new Date().toISOString().slice(0, 10)
  const events = (await getCollectionAtBuild('events', { orderByField: 'date', orderDir: 'asc' }))
    .filter(isVisible)
    .filter(e => !e.date || e.date >= today)
    .slice(0, 20)

  const schema = [
    breadcrumbSchema([{ name: 'Events', path: '/events' }]),
    ...events.map(e => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: e.title,
      description: e.description || e.title,
      startDate: e.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: e.venue || 'Agram Open School',
        address: {
          '@type': 'PostalAddress',
          addressLocality: ORG_CONTACT.addressLocality,
          addressRegion: ORG_CONTACT.addressRegion,
          addressCountry: ORG_CONTACT.addressCountry,
        },
      },
      organizer: { '@id': `${SITE_URL}/#organization` },
    })),
  ]

  return (
    <>
      <JsonLd data={schema} />
      <EventsClient />
    </>
  )
}
