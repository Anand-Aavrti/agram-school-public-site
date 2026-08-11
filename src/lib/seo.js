// Server-only SEO data fetcher — deliberately NOT the client-marked
// firestore.js (which has 'use client' at the top and is meant for
// in-browser fetches). generateMetadata() runs at build time under
// `output: 'export'`, so this needs its own plain Firestore calls against
// the same `db` client instance.
import { doc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'

export const SITE_URL = 'https://agramopenschool.com'
export const SITE_NAME = 'Agram Open School'

let globalSeoPromise = null
export const getGlobalSeo = () => {
  if (!globalSeoPromise) {
    globalSeoPromise = getDoc(doc(db, 'site_settings', 'global_seo'))
      .then((snap) => (snap.exists() ? snap.data() : {}))
      .catch(() => ({}))
  }
  return globalSeoPromise
}

let pagesSeoPromise = null
const getAllPagesSeo = () => {
  if (!pagesSeoPromise) {
    pagesSeoPromise = getDocs(collection(db, 'pages_seo'))
      .then((snap) => snap.docs.map((d) => d.data()))
      .catch(() => [])
  }
  return pagesSeoPromise
}

// Admin's per-page SEO entries are free-typed by a human (no fixed page-key
// scheme), so match tolerantly: trim, drop a trailing slash.
const normalizePath = (p) => {
  const trimmed = (p || '').trim()
  if (trimmed === '' || trimmed === '/') return '/'
  return trimmed.replace(/\/+$/, '')
}

// Falls back all the way to these if neither Firestore source has data yet
// (e.g. the admin hasn't filled in SEO settings) — a page's generateMetadata
// returning an explicit `undefined` title/description can suppress the
// parent layout's value entirely, so this must never be undefined.
export const SITE_DEFAULT_TITLE = 'Agram Open School — Swayam Tejasvi Bhava'
export const SITE_DEFAULT_DESCRIPTION = 'Agram Open School, Surat — An NIOS-accredited open school committed to flexible, learner-centric education and holistic development. Admissions open for 2026-27.'

// Returns a Next.js Metadata object for the given route path, merging the
// matching pages_seo entry (if an admin created one) over the site-wide
// global_seo defaults, over a page-specific fallback (so every route still
// gets a distinct, keyword-rich title/description instead of every
// unconfigured page repeating SITE_DEFAULT_TITLE), over the hardcoded site
// defaults as the last resort.
export const getPageMetadata = async (routePath, { ogType = 'website', fallbackTitle, fallbackDescription } = {}) => {
  const [global, pages] = await Promise.all([getGlobalSeo(), getAllPagesSeo()])
  const target = normalizePath(routePath)
  const entry = pages.find((p) => normalizePath(p.path) === target)

  const title = entry?.title || global.defaultTitle || fallbackTitle || SITE_DEFAULT_TITLE
  const description = entry?.description || global.defaultDescription || fallbackDescription || SITE_DEFAULT_DESCRIPTION
  const ogImage = entry?.ogImage || global.ogImage

  return {
    title,
    description,
    alternates: { canonical: target },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: title || global.siteName,
      description,
      url: target,
      siteName: global.siteName || SITE_NAME,
      type: ogType,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD)
// ---------------------------------------------------------------------------

// Phone/address are still placeholders — Footer.jsx and ContactClient.jsx
// carry the same placeholders. Swap all three together once the school
// confirms its real phone/address.
export const ORG_CONTACT = {
  phone: '+91-98765-43210',
  email: 'agram.surat@gmail.com',
  streetAddress: 'Surat',
  addressLocality: 'Surat',
  addressRegion: 'Gujarat',
  addressCountry: 'IN',
}

export const SOCIAL_LINKS = [
  'https://www.facebook.com/agramskilldevelopmentcentre/',
  'https://www.instagram.com/agram_surat/',
  'https://www.youtube.com/@agram.surat123',
]

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'Agram Open School, Surat',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: SITE_DEFAULT_DESCRIPTION,
  foundingDate: '2015',
  parentOrganization: { '@type': 'Organization', name: 'Agram Charitable Trust' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: ORG_CONTACT.streetAddress,
    addressLocality: ORG_CONTACT.addressLocality,
    addressRegion: ORG_CONTACT.addressRegion,
    addressCountry: ORG_CONTACT.addressCountry,
  },
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: ORG_CONTACT.phone,
    email: ORG_CONTACT.email,
    contactType: 'admissions',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi', 'gu'],
  }],
  // Front-office hours, per ContactClient.jsx's "Call us" line.
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '16:00',
  }],
  ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS } : {}),
})

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
})

// items: [{ name, path }] with `path` relative ('/about', '/news/123', ...).
// Home is always injected as the first crumb.
export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
  })),
})

// JSON.stringify output can legally contain "</script>" if a Firestore-sourced
// string (an article title, FAQ answer, etc.) contains it — that would close
// the script tag early and break out into the surrounding HTML. Escape it.
export const jsonLdString = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

// ---------------------------------------------------------------------------
// Build-time Firestore reads for structured data (server components only —
// same build-time-fetch pattern as getGlobalSeo/getAllPagesSeo above; NOT the
// 'use client' firestore.js, which is for in-browser reads).
// ---------------------------------------------------------------------------

// Per PUBLIC_WEBSITE_SCHEMA.md: a missing `active` field means visible — only
// an explicit `active === false` hides a document.
export const isVisible = (d) => d.active !== false

export const getCollectionAtBuild = async (col, { orderByField, orderDir = 'desc' } = {}) => {
  try {
    const ref = collection(db, col)
    const q = orderByField ? query(ref, orderBy(orderByField, orderDir)) : ref
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error(`Error fetching ${col}:`, err)
    return []
  }
}

export const getDocAtBuild = async (col, id) => {
  try {
    const snap = await getDoc(doc(db, col, id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (err) {
    console.error(`Error fetching ${col}/${id}:`, err)
    return null
  }
}
