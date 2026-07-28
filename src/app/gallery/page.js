import GalleryClient from './GalleryClient'
import { getPageMetadata, breadcrumbSchema, getCollectionAtBuild, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/gallery', {
    fallbackTitle: 'Photo & Video Gallery — Campus Life | Agram Open School',
    fallbackDescription: 'Photos and videos from Agram Open School, Surat — campus life, classrooms, sports days and school events.',
  })
}

// Mirrors GalleryClient.jsx's FALLBACK_PHOTOS — used for schema only until
// the admin adds gallery_albums/gallery_photos entries.
const FALLBACK_PHOTOS = [
  { url: '/banner1.jpeg', caption: 'Our campus' },
  { url: '/science.jpeg', caption: 'Science in action' },
  { url: '/banner3.jpeg', caption: 'Morning assembly' },
  { url: '/commerce.jpeg', caption: 'Commerce classroom' },
  { url: '/banner2.jpeg', caption: 'School spirit' },
]

export default async function Page() {
  const photos = (await getCollectionAtBuild('gallery_photos', { orderByField: 'createdAt', orderDir: 'asc' }))
  const list = (photos.length ? photos : FALLBACK_PHOTOS).slice(0, 12)

  const schema = [
    breadcrumbSchema([{ name: 'Gallery', path: '/gallery' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      '@id': `${SITE_URL}/gallery#gallery`,
      url: `${SITE_URL}/gallery`,
      name: 'Campus life at Agram Open School',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      associatedMedia: list.map(p => ({
        '@type': 'ImageObject',
        contentUrl: p.url.startsWith('http') ? p.url : `${SITE_URL}${p.url}`,
        caption: p.caption || undefined,
      })),
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <GalleryClient />
    </>
  )
}
