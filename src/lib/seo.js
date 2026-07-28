// Server-only SEO data fetcher — deliberately NOT the client-marked
// firestore.js (which has 'use client' at the top and is meant for
// in-browser fetches). generateMetadata() runs at build time under
// `output: 'export'`, so this needs its own plain Firestore calls against
// the same `db` client instance.
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

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
// global_seo defaults, over the hardcoded site defaults.
export const getPageMetadata = async (routePath) => {
  const [global, pages] = await Promise.all([getGlobalSeo(), getAllPagesSeo()])
  const target = normalizePath(routePath)
  const entry = pages.find((p) => normalizePath(p.path) === target)

  const title = entry?.title || global.defaultTitle || SITE_DEFAULT_TITLE
  const description = entry?.description || global.defaultDescription || SITE_DEFAULT_DESCRIPTION
  const ogImage = entry?.ogImage || global.ogImage

  return {
    title,
    description,
    openGraph: {
      title: title || global.siteName,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}
