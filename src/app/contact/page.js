import ContactClient from './ContactClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/contact')
}

export default function Page() {
  return <ContactClient />
}
