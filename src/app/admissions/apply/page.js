import ApplyClient from './ApplyClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/admissions/apply')
}

export default function Page() {
  return <ApplyClient />
}
