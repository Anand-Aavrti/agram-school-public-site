// School identity for the public site.
//
// Precedence at runtime: Firestore `site_settings/homepage.schoolName`
// (editable in the admin CMS) wins wherever a component reads it. These
// values are the build-time fallback and are used for static SEO metadata,
// which is generated before any Firestore read happens.
//
// Override per deployment in .env.local (see .env.example).
export const SCHOOL_NAME = process.env.NEXT_PUBLIC_SCHOOL_NAME || 'EduPortal Demo School'
export const SCHOOL_SHORT_NAME = process.env.NEXT_PUBLIC_SCHOOL_SHORT_NAME || SCHOOL_NAME
export const SCHOOL_CITY = process.env.NEXT_PUBLIC_SCHOOL_CITY || 'Surat'
export const TRUST_NAME =
  process.env.NEXT_PUBLIC_TRUST_NAME || `${SCHOOL_NAME} Education Trust`


// Postal address, used on the contact page, in the footer and in the
// Organization structured data. MAP_QUERY is what gets sent to Google Maps.
export const ADDRESS_LINE1 = process.env.NEXT_PUBLIC_ADDRESS_LINE1 || 'A-301, Aagam Shopping World'
export const ADDRESS_LINE2 = process.env.NEXT_PUBLIC_ADDRESS_LINE2 || 'Vesu, Surat, Gujarat 395007'
export const POSTAL_CODE   = process.env.NEXT_PUBLIC_POSTAL_CODE   || '395007'
export const ADDRESS_FULL  = `${ADDRESS_LINE1}, ${ADDRESS_LINE2}`
export const MAP_QUERY     = process.env.NEXT_PUBLIC_MAP_QUERY || ADDRESS_FULL

// Precise map pin. Set ONE of these, highest precedence first:
//   NEXT_PUBLIC_MAP_EMBED_URL  full src= from Google Maps ▸ Share ▸ Embed a map
//   NEXT_PUBLIC_MAP_CID        the place's CID — renders the real listing with
//                              its NAME and ADDRESS on the pin. Get it from a
//                              Maps place URL: the `!1s0x…:0xABC` segment, where
//                              0xABC converted from hex to decimal is the CID.
//   NEXT_PUBLIC_MAP_COORDS     "21.135,72.774" — exact point, but the pin is
//                              labelled with raw coordinates, not the address.
// With none of these the address string is searched, which only centres the
// map approximately.
export const MAP_EMBED_URL = process.env.NEXT_PUBLIC_MAP_EMBED_URL || ''
export const MAP_CID       = process.env.NEXT_PUBLIC_MAP_CID || ''
export const MAP_COORDS    = process.env.NEXT_PUBLIC_MAP_COORDS || ''

export const mapSrc = () => {
  // 1. An exact embed URL from Google Maps ▸ Share ▸ Embed a map always wins.
  if (MAP_EMBED_URL) return MAP_EMBED_URL
  if (MAP_CID) return `https://www.google.com/maps?cid=${MAP_CID}&output=embed`
  // 2. Otherwise search by name+address so the marker carries the business
  //    label, and pass ll= to centre on the exact point when we know it.
  const params = new URLSearchParams({ q: MAP_QUERY })
  if (MAP_COORDS) { params.set('ll', MAP_COORDS); params.set('z', '17') }
  params.set('output', 'embed')
  return `https://www.google.com/maps?${params.toString()}`
}

export default {
  SCHOOL_NAME, SCHOOL_SHORT_NAME, SCHOOL_CITY, TRUST_NAME,
  ADDRESS_LINE1, ADDRESS_LINE2, ADDRESS_FULL, POSTAL_CODE, MAP_QUERY,
  MAP_COORDS, MAP_CID, MAP_EMBED_URL, mapSrc,
}
