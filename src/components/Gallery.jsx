'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getCollection } from '@/lib/firestore'
import FadeUp from './FadeUp'
import { SCHOOL_SHORT_NAME } from '@/lib/branding'

// Shown only until the admin has real gallery photos in Firestore.
const FALLBACK_PHOTOS = [
  { url: '/banner1.jpeg', caption: 'Our campus' },
  { url: '/life7.jpeg', caption: 'Yoga & wellness' },
  { url: '/life4.jpeg', caption: 'Festive celebrations' },
  { url: '/science.jpeg', caption: 'Creative workshops' },
  { url: '/commerce.jpeg', caption: 'Republic Day' },
  { url: '/banner3.jpeg', caption: 'Rakshabandhan' },
  { url: '/life5.jpeg', caption: 'Vasant Panchami' },
  { url: '/life6.jpeg', caption: 'Sports Day' },
]

const SPANS = [
  'lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto',
  'aspect-square', 'aspect-square', 'aspect-square',
  'aspect-square', 'aspect-square', 'aspect-square', 'aspect-square',
]

export default function Gallery() {
  const [photos, setPhotos] = useState(null)

  useEffect(() => {
    getCollection('gallery_photos', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setPhotos(data.slice(0, 8)))
  }, [])

  const list = (photos?.length ? photos : FALLBACK_PHOTOS).map((p, i) => ({
    url: p.url,
    caption: p.caption,
    span: SPANS[i % SPANS.length],
  }))

  return (
    <section className="py-24 lg:py-32 bg-white hairline-t">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <FadeUp direction="down" className="max-w-xl">
            <p className="eyebrow">Campus life</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Life at <em className="italic font-medium text-crimson">{SCHOOL_SHORT_NAME}</em>
            </h2>
          </FadeUp>
          <Link href="/gallery" className="link-quiet text-[14.5px] font-semibold flex items-center gap-2">
            Full gallery <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 grid-flow-row-dense gap-4 lg:gap-5 lg:auto-rows-[180px]">
          {list.map((p, i) => (
            <FadeUp key={p.url} delay={i * 90} direction="zoom" className={`${p.span} relative overflow-hidden img-hover group border border-hairline`}>
              <img src={p.url} alt={p.caption || `Life at ${SCHOOL_SHORT_NAME}`} className="w-full h-full object-cover img-treat" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]" />
              {p.caption && (
                <p className="absolute bottom-4 left-4 text-white text-[13.5px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]">
                  {p.caption}
                </p>
              )}
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
