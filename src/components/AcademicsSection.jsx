'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'

const STREAM_IMAGES = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&q=80',
  'https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=1000&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80',
]

const FALLBACK = [
  { id: 'p', name: 'Primary years', description: 'Foundations in literacy, numeracy and wonder — Kindergarten to Grade 5.' },
  { id: 'm', name: 'Middle school', description: 'Depth across disciplines with growing independence — Grades 6 to 8.' },
  { id: 's', name: 'Science stream', description: 'Physics, chemistry, biology and mathematics for Grades 11–12.' },
  { id: 'c', name: 'Commerce stream', description: 'Accountancy, business studies and economics for Grades 11–12.' },
]

export default function AcademicsSection() {
  const [items, setItems] = useState([])
  useEffect(() => {
    getCollection('academic_streams', { orderByField: 'createdAt', orderDir: 'desc' }).then(data => {
      const visible = data.filter(isVisible)
      if (visible.length > 0) setItems(visible)
    })
  }, [])

  const list = items.length ? items : FALLBACK

  return (
    <section className="py-24 lg:py-32 bg-white hairline-t">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <FadeUp direction="down" className="max-w-xl">
            <p className="eyebrow">Academics</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              A curriculum that takes children <em className="italic font-medium text-crimson">seriously</em>
            </h2>
          </FadeUp>
          <Link href="/academics" className="link-quiet text-[14.5px] font-semibold flex items-center gap-2">
            View all programmes <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((p, i) => (
            <FadeUp key={p.id} delay={i * 80} direction="up">
              <Link href="/academics" className="group block card card-hover overflow-hidden border border-hairline h-full">
                <div className="relative aspect-[4/5] overflow-hidden img-hover">
                  <img src={p.imageUrl || STREAM_IMAGES[i % STREAM_IMAGES.length]} alt={p.name}
                    className="w-full h-full object-cover img-treat" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
                  <span className="absolute top-4 left-4 badge bg-crimson text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-semibold text-xl text-white leading-tight">
                      {p.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-inkmute text-[14px] leading-relaxed">
                    {p.description || p.subjects}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-crimson text-[13.5px] font-semibold group-hover:gap-2.5 transition-all">
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
