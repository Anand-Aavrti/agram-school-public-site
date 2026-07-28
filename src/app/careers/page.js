import CareersClient from './CareersClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/careers')
}

export default function Page() {
  return <CareersClient />
}
