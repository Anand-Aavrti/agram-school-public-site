import GalleryClient from './GalleryClient'
import { getPageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return getPageMetadata('/gallery')
}

export default function Page() {
  return <GalleryClient />
}
