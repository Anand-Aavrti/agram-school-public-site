import AboutClient from './AboutClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/about')
}

export default function Page() {
  return <AboutClient />
}
