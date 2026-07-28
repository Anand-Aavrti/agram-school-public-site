import AcademicsClient from './AcademicsClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/academics')
}

export default function Page() {
  return <AcademicsClient />
}
