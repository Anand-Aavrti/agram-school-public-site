'use client'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import FadeUp from './FadeUp'

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=1200&q=80', caption: 'Our campus', span: 'lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto' },
  { src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&q=80', caption: 'The library', span: 'aspect-square' },
  { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&q=80', caption: 'Independent reading', span: 'aspect-square' },
  { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&q=80', caption: 'Reading corner', span: 'aspect-square' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80', caption: 'Inside the classroom', span: 'aspect-square' },
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80', caption: 'Smart classrooms', span: 'aspect-square' },
  { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80', caption: 'Digital learning', span: 'aspect-square' },
  { src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=900&q=80', caption: 'Spirit of learning', span: 'aspect-square' },
]

export default function Gallery() {
  return (
    <section className="py-24 lg:py-32 bg-white hairline-t">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <FadeUp direction="down" className="max-w-xl">
            <p className="eyebrow">Campus life</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Life at <em className="italic font-medium text-crimson">Agram</em>
            </h2>
          </FadeUp>
          <Link href="/gallery" className="link-quiet text-[14.5px] font-semibold flex items-center gap-2">
            Full gallery <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 grid-flow-row-dense gap-4 lg:gap-5 lg:auto-rows-[180px]">
          {PHOTOS.map((p, i) => (
            <FadeUp key={p.src} delay={i * 60} direction={i % 2 === 0 ? 'left' : 'right'} className={`${p.span} relative overflow-hidden img-hover group border border-hairline`}>
              <img src={p.src} alt={p.caption} className="w-full h-full object-cover img-treat" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]" />
              <p className="absolute bottom-4 left-4 text-white text-[13.5px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]">
                {p.caption}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
