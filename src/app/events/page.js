import EventsClient from './EventsClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/events')
}

export default function Page() {
  return <EventsClient />
}
