import HomeClient from './HomeClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/')
}

export default function Page() {
  return <HomeClient />
}
