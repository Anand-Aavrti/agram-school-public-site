import NewsClient from './NewsClient'
import { getPageMetadata, breadcrumbSchema, getCollectionAtBuild, isVisible, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/news', {
    fallbackTitle: 'News & Announcements | Agram Open School',
    fallbackDescription: 'Announcements, achievements and everyday moments from Agram Open School, Surat.',
  })
}

export default async function Page() {
  const news = (await getCollectionAtBuild('news', { orderByField: 'createdAt', orderDir: 'desc' }))
    .filter(isVisible)
    .slice(0, 30)

  const schema = [
    breadcrumbSchema([{ name: 'News', path: '/news' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/news#webpage`,
      url: `${SITE_URL}/news`,
      name: 'News from Agram Open School',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      ...(news.length ? {
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: news.map((n, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/news/${n.id}`,
            name: n.title,
          })),
        },
      } : {}),
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <NewsClient />
    </>
  )
}
