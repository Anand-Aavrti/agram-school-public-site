import DisclosureClient from './DisclosureClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/disclosure')
}

export default function Page() {
  return <DisclosureClient />
}
