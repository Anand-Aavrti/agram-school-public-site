import { jsonLdString } from '@/lib/seo'

// Renders one or more JSON-LD graphs. Accepts a single schema object or an
// array — each gets its own <script> tag (easier to debug in devtools /
// Rich Results Test than one combined @graph).
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data]
  return items.filter(Boolean).map((item, i) => (
    <script
      key={item['@id'] || item['@type'] || i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(item) }}
    />
  ))
}
