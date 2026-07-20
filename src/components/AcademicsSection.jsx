'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'

const STREAM_IMAGES = ['/banner1.jpeg', '/banner2.jpeg', '/science.jpeg', '/commerce.jpeg']
const ROTATE_MS = 4500

const FALLBACK = [
  { id: 'p', name: 'Primary years', grades: 'KG – Grade 5', description: 'Foundations in literacy, numeracy and wonder — where curiosity is treated as a skill worth teaching.' },
  { id: 'm', name: 'Middle school', grades: 'Grades 6 – 8', description: 'Depth across disciplines with growing independence, projects and real questions.' },
  { id: 's', name: 'Science stream', grades: 'Grades 11 – 12', description: 'Physics, chemistry, biology and mathematics — taught in labs, not just lectures.' },
  { id: 'c', name: 'Commerce stream', grades: 'Grades 11 – 12', description: 'Accountancy, business studies and economics for tomorrow’s entrepreneurs.' },
]

export default function AcademicsSection() {
  const [items, setItems] = useState([])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    getCollection('academic_streams', { orderByField: 'createdAt', orderDir: 'desc' }).then(data => {
      const visible = data.filter(isVisible)
      if (visible.length > 0) setItems(visible)
    })
  }, [])

  const list = items.length ? items : FALLBACK

  // Auto-advance the spotlight; pause while the visitor explores the list.
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setActive(a => (a + 1) % list.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, list.length])

  const img = (p, i) => p.imageUrl || STREAM_IMAGES[i % STREAM_IMAGES.length]

  return (
    <section className="py-24 lg:py-32 bg-navy relative overflow-hidden">
      {/* Faint oversized watermark */}
      <span aria-hidden className="absolute -top-10 right-0 font-display italic font-semibold text-white/[0.04] text-[180px] lg:text-[260px] leading-none select-none pointer-events-none">
        Learn
      </span>

      <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <FadeUp direction="down" className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-gold">
              <span className="w-[18px] h-[2px] bg-gold inline-block" />
              Academics
            </p>
            <h2 className="font-display font-semibold text-white text-4xl lg:text-[46px] leading-[1.12] tracking-[-0.01em] mt-5">
              A curriculum that takes children <em className="italic font-medium text-gold">seriously</em>
            </h2>
          </FadeUp>
          <Link href="/academics"
            className="text-white/60 hover:text-gold text-[14.5px] font-semibold flex items-center gap-2 transition-colors">
            View all programmes <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Programme list — active row expands */}
          <div className="lg:col-span-6 xl:col-span-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}>
            <div className="border-t border-white/10">
              {list.map((p, i) => {
                const isActive = i === active
                return (
                  <FadeUp key={p.id} delay={i * 110} direction="left">
                    <div className="border-b border-white/10">
                      <button onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}
                        className="w-full text-left py-6 flex items-center gap-5 group cursor-pointer">
                        <span className={`font-display text-[14px] tabular-nums transition-colors duration-500 ${
                          isActive ? 'text-gold' : 'text-white/30'
                        }`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className={`font-display font-semibold text-[26px] sm:text-[32px] leading-tight transition-colors duration-500 ${
                          isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                        }`}>
                          {p.name}
                        </h3>
                        <span className={`ml-auto flex items-center justify-center w-9 h-9 border transition-all duration-500 shrink-0 ${
                          isActive ? 'border-gold text-gold rotate-0' : 'border-white/15 text-white/30 -rotate-45'
                        }`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </button>

                      {/* Expanding detail */}
                      <div className={`grid transition-all duration-700 ease-out ${
                        isActive ? 'grid-rows-[1fr] opacity-100 pb-7' : 'grid-rows-[0fr] opacity-0 pb-0'
                      }`}>
                        <div className="overflow-hidden pl-[34px] sm:pl-[38px]">
                          {(p.grades || p.subjects) && (
                            <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-gold/80 mb-2.5">
                              {p.grades || p.subjects}
                            </span>
                          )}
                          <p className="text-white/60 text-[15px] leading-relaxed max-w-md">
                            {p.description || p.subjects}
                          </p>
                          <Link href="/academics"
                            className="inline-flex items-center gap-2 mt-4 text-gold text-[13.5px] font-semibold hover:gap-3.5 transition-all">
                            Explore programme <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                )
              })}
            </div>
          </div>

          {/* Spotlight image — crossfades with the active programme */}
          <div className="lg:col-span-6 xl:col-span-6">
            <FadeUp direction="zoom">
              <div className="relative lg:ml-6">
                {/* Offset gold frame */}
                <div aria-hidden className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-full h-full border border-gold/40 pointer-events-none" />
                <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden">
                  {list.map((p, i) => (
                    <img key={p.id} src={img(p, i)} alt={p.name}
                      className={`absolute inset-0 w-full h-full object-cover img-treat transition-all duration-[1100ms] ease-out ${
                        i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`} />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-gold text-[11px] font-bold tracking-[0.16em] uppercase mb-1.5">
                        {list[active]?.grades || 'Programme'}
                      </p>
                      <p className="font-display font-semibold text-white text-2xl leading-tight">
                        {list[active]?.name}
                      </p>
                    </div>
                    <span className="font-display text-white/40 text-[13px] tabular-nums shrink-0">
                      {String(active + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
                    </span>
                  </div>
                  {/* Gold progress bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10">
                    <div key={active}
                      className="h-full bg-gold origin-left"
                      style={paused ? { width: '100%' } : { animation: `academics-progress ${ROTATE_MS}ms linear forwards` }} />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  )
}
