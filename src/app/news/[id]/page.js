import NewsArticleClient from './NewsArticleClient'
import { getPageMetadata } from '@/lib/seo'

// Static export can't know real article IDs ahead of time — export one shell
// page and let the client read the real id from the URL via useParams().
export function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

// No per-article SEO management exists in admin, so this falls back to the
// /news page-level entry (or site-wide defaults) — same as every other page.
export async function generateMetadata() {
  return getPageMetadata('/news')
}

export default function NewsArticlePage() {
  return <NewsArticleClient />
}
