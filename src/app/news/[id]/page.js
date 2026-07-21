import NewsArticleClient from './NewsArticleClient'

// Static export can't know real article IDs ahead of time — export one shell
// page and let the client read the real id from the URL via useParams().
export function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function NewsArticlePage() {
  return <NewsArticleClient />
}
