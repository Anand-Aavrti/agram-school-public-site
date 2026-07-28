import PortalClient from './PortalClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/portal')
}

export default function Page() {
  return <PortalClient />
}
