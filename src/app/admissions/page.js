import AdmissionsClient from './AdmissionsClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/admissions')
}

export default function Page() {
  return <AdmissionsClient />
}
