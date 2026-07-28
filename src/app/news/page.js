import NewsClient from './NewsClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/news')
}

export default function Page() {
  return <NewsClient />
}
