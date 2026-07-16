'use client'
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'

// Firestore requires a composite index for where() + orderBy() on different
// fields. Rather than depend on indexes existing for a brand-new site, we
// fetch collections sorted by a single field (auto-indexed) and filter
// visibility client-side instead.
export const getCollection = async (col, { orderByField = null, orderDir = 'desc' } = {}) => {
  try {
    const ref = collection(db, col)
    const q = orderByField ? query(ref, orderBy(orderByField, orderDir)) : ref
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error(`Error fetching ${col}:`, err)
    return []
  }
}

export const getDocument = async (col, id) => {
  try {
    const snap = await getDoc(doc(db, col, id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (err) {
    console.error(`Error fetching ${col}/${id}:`, err)
    return null
  }
}

// Per PUBLIC_WEBSITE_SCHEMA.md: a missing `active` field means visible —
// only an explicit `active === false` hides a document.
export const isVisible = (doc) => doc.active !== false

let settingsPromise = null
export const getSiteSettings = () => {
  if (!settingsPromise) settingsPromise = getDocument('site_settings', 'homepage')
  return settingsPromise
}
