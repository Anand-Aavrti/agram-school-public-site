import NewsArticleClient from './NewsArticleClient'
import {
  getPageMetadata, getCollectionAtBuild, getDocAtBuild, isVisible,
  breadcrumbSchema, SITE_URL, SITE_NAME,
} from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_NAME, SCHOOL_CITY } from '@/lib/branding'

// Known article ids are fetched at build time so each gets its own fully
// static, SEO-complete page (real title, OG image, canonical, NewsArticle
// JSON-LD). 'placeholder' stays in the list too — it's what firebase.json
// rewrites any not-yet-built /news/** id to, so that shell still needs to
// exist and fetch the article client-side via useParams().
export async function generateStaticParams() {
  const news = await getCollectionAtBuild('news')
  return [{ id: 'placeholder' }, ...news.filter(isVisible).map((n) => ({ id: n.id }))]
}

export async function generateMetadata({ params }) {
  const { id } = await params

  if (id === 'placeholder') {
    return getPageMetadata('/news', {
      fallbackTitle: `News | ${SCHOOL_NAME}`,
      fallbackDescription: `Announcements, achievements and everyday moments from ${SCHOOL_NAME}, ${SCHOOL_CITY}.`,
    })
  }

  const article = await getDocAtBuild('news', id)
  if (!article || !isVisible(article)) {
    return getPageMetadata('/news', { fallbackTitle: `Story not found | ${SCHOOL_NAME}` })
  }

  const base = await getPageMetadata(`/news/${id}`, {
    ogType: 'article',
    fallbackTitle: `${article.title} | ${SCHOOL_NAME}`,
    fallbackDescription: article.summary,
  })

  if (!article.imageUrl) return base
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [{ url: article.imageUrl }] },
    twitter: { ...base.twitter, card: 'summary_large_image', images: [article.imageUrl] },
  }
}

export default async function NewsArticlePage({ params }) {
  const { id } = await params

  if (id === 'placeholder') {
    return <NewsArticleClient />
  }

  const doc = await getDocAtBuild('news', id)
  const article = doc && isVisible(doc) ? doc : null

  const more = article
    ? (await getCollectionAtBuild('news', { orderByField: 'createdAt', orderDir: 'desc' }))
      .filter(isVisible).filter((n) => n.id !== id).slice(0, 3)
    : []

  const schema = [
    breadcrumbSchema(article
      ? [{ name: 'News', path: '/news' }, { name: article.title, path: `/news/${id}` }]
      : [{ name: 'News', path: '/news' }]),
    ...(article ? [{
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      '@id': `${SITE_URL}/news/${id}#article`,
      headline: article.title,
      description: article.summary || undefined,
      image: article.imageUrl ? [article.imageUrl] : undefined,
      datePublished: article.publishDate || undefined,
      dateModified: article.publishDate || undefined,
      articleSection: article.category || 'News',
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/news/${id}` },
    }] : []),
  ]

  return (
    <>
      <JsonLd data={schema} />
      <NewsArticleClient initialArticle={article} initialMore={more} />
    </>
  )
}
