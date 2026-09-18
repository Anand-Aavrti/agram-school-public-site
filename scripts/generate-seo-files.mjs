// Runs before `next build` (see package.json "prebuild") to write
// public/sitemap.xml, public/sitemap-news.xml and public/feed.xml from live
// Firestore data. Deliberately standalone (no imports from src/lib) — it's a
// plain Node ESM script invoked via `node --env-file=.env.local`, outside
// Next's own module resolution, so it re-declares the tiny bit of Firebase
// wiring it needs rather than importing a 'use client'/Next-only module.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://demoschool.example'
const SITE_NAME = process.env.NEXT_PUBLIC_SCHOOL_NAME || 'EduPortal Demo School'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const databaseId = process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID
const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app)

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')

const isVisible = (d) => d.active !== false

const getCollection = async (col) => {
  try {
    const snap = await getDocs(collection(db, col))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error(`[generate-seo-files] failed to fetch ${col}:`, err.message)
    return []
  }
}

// Firestore Timestamp (has .toDate()), an ISO/date string, or nothing.
const toDate = (v) => {
  if (!v) return null
  const d = v?.toDate ? v.toDate() : new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

const xmlEscape = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// -----------------------------------------------------------------------
// sitemap.xml — every statically-indexable page, plus every visible news
// article. Self-referencing hreflang (en / x-default) since the site is
// single-language today — an explicit, unambiguous signal rather than
// leaving language inference to crawlers.
// -----------------------------------------------------------------------
const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/academics', changefreq: 'monthly', priority: '0.8' },
  { path: '/admissions', changefreq: 'weekly', priority: '0.9' },
  { path: '/admissions/apply', changefreq: 'monthly', priority: '0.7' },
  { path: '/careers', changefreq: 'weekly', priority: '0.6' },
  { path: '/contact', changefreq: 'yearly', priority: '0.6' },
  { path: '/disclosure', changefreq: 'monthly', priority: '0.5' },
  { path: '/events', changefreq: 'daily', priority: '0.8' },
  { path: '/gallery', changefreq: 'weekly', priority: '0.6' },
  { path: '/news', changefreq: 'daily', priority: '0.8' },
  { path: '/portal', changefreq: 'monthly', priority: '0.5' },
  { path: '/student-life', changefreq: 'monthly', priority: '0.7' },
]

const buildSitemap = (news) => {
  const today = new Date().toISOString().slice(0, 10)
  const staticUrls = STATIC_ROUTES.map((r) => ({ loc: `${SITE_URL}${r.path}`, lastmod: today, changefreq: r.changefreq, priority: r.priority }))
  const newsUrls = news.map((n) => {
    const lastmod = toDate(n.updatedAt) || toDate(n.createdAt) || toDate(n.publishDate)
    return {
      loc: `${SITE_URL}/news/${n.id}`,
      lastmod: (lastmod || new Date()).toISOString().slice(0, 10),
      changefreq: 'monthly',
      priority: '0.6',
    }
  })

  const urls = [...staticUrls, ...newsUrls].map((u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(u.loc)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(u.loc)}" />
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

// -----------------------------------------------------------------------
// sitemap-news.xml — Google News Sitemap protocol only wants articles
// published in the last 2 days; an older article belongs in the regular
// sitemap (above) instead.
// -----------------------------------------------------------------------
const buildNewsSitemap = (news) => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  const recent = news
    .map((n) => ({ ...n, _date: toDate(n.publishDate) || toDate(n.createdAt) }))
    .filter((n) => n._date && n._date >= twoDaysAgo)
    .slice(0, 1000)

  const urls = recent.map((n) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}/news/${n.id}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${n._date.toISOString()}</news:publication_date>
      <news:title>${xmlEscape(n.title)}</news:title>
    </news:news>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`
}

// -----------------------------------------------------------------------
// feed.xml — RSS 2.0, latest 20 articles.
// -----------------------------------------------------------------------
const buildRssFeed = (news) => {
  const sorted = [...news]
    .map((n) => ({ ...n, _date: toDate(n.publishDate) || toDate(n.createdAt) || new Date(0) }))
    .sort((a, b) => b._date - a._date)
    .slice(0, 20)

  const items = sorted.map((n) => `    <item>
      <title>${xmlEscape(n.title)}</title>
      <link>${xmlEscape(`${SITE_URL}/news/${n.id}`)}</link>
      <guid isPermaLink="true">${xmlEscape(`${SITE_URL}/news/${n.id}`)}</guid>
      <pubDate>${n._date.toUTCString()}</pubDate>
      ${n.category ? `<category>${xmlEscape(n.category)}</category>` : ''}
      <description>${xmlEscape(n.summary || n.title)}</description>
    </item>`).join('\n')

  const lastBuildDate = (sorted[0]?._date || new Date()).toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_NAME)} — News</title>
    <link>${SITE_URL}/news</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Announcements, achievements and everyday moments from ${xmlEscape(SITE_NAME)}, Surat.</description>
    <language>en-in</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`
}

const main = async () => {
  const news = (await getCollection('news')).filter(isVisible)
  console.log(`[generate-seo-files] fetched ${news.length} visible news article(s)`)

  await Promise.all([
    writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemap(news)),
    writeFile(path.join(publicDir, 'sitemap-news.xml'), buildNewsSitemap(news)),
    writeFile(path.join(publicDir, 'feed.xml'), buildRssFeed(news)),
  ])

  console.log('[generate-seo-files] wrote sitemap.xml, sitemap-news.xml, feed.xml')
  process.exit(0)
}

main().catch((err) => {
  console.error('[generate-seo-files] fatal:', err)
  process.exit(1)
})
