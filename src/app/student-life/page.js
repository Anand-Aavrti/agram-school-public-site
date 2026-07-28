import StudentLifeClient from './StudentLifeClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/student-life')
}

export default function Page() {
  return <StudentLifeClient />
}
