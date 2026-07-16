'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Users, Award, Clock } from 'lucide-react'
import { getCollection, getSiteSettings, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'

const HERO_IMG = 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=2000&q=80'

export default function HeroSection() {
  const [banner, setBanner] = useState(null)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    getCollection('banners', { orderByField: 'order', orderDir: 'asc' }).then(data => {
      const visible = data.filter(isVisible)
      if (visible.length > 0) setBanner(visible[0])
    })
    getSiteSettings().then(setSettings)
  }, [])

  const image = banner?.imageUrl || HERO_IMG
  const ctaHref = banner?.buttonLink || '/admissions/apply'
  const ctaLabel = banner?.buttonLabel || 'Apply for Admission'

  const stats = [
    { icon: Users, n: settings?.statsStudents || '1,200+', l: 'Students' },
    { icon: Award, n: settings?.statsTeachers || '80+', l: 'Faculty' },
    { icon: Clock, n: settings?.statsYears || '30+', l: 'Years in Surat' },
  ]

  return (
    <section className="relative flex flex-col min-h-[560px] sm:h-[92vh] sm:min-h-[560px] sm:max-h-[820px] overflow-hidden">
      <img src={image} alt="Students at Agram Open School"
        className="absolute inset-0 w-full h-full object-cover img-treat" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/20 to-transparent" />

      <div className="relative z-10 max-w-grid mx-auto px-6 lg:px-12 flex-1 flex items-center w-full py-16 sm:py-0">
        <FadeUp direction="right" className="max-w-2xl">
          <span className="badge bg-gold text-navy">Admissions Open · 2026–27</span>
          {banner?.title ? (
            <h1 className="font-display font-semibold text-white text-4xl sm:text-6xl lg:text-[74px] leading-[1.08] sm:leading-[1.05] tracking-[-0.01em] mt-5 sm:mt-7">
              {banner.title}
            </h1>
          ) : (
            <h1 className="font-display font-semibold text-white text-4xl sm:text-6xl lg:text-[74px] leading-[1.08] sm:leading-[1.05] tracking-[-0.01em] mt-5 sm:mt-7">
              Where curiosity<br />
              <em className="italic font-medium text-gold">belongs</em>
            </h1>
          )}
          <p className="text-white/80 text-base sm:text-lg mt-5 sm:mt-7 max-w-lg leading-relaxed">
            {banner?.subtitle || 'A CBSE school in Surat where academic rigour meets warmth — and every child is known by name.'}
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10">
            <Link href={ctaHref} className="btn-gold">
              {ctaLabel} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="btn-outline-white">
              Visit the school
            </Link>
          </div>
        </FadeUp>
      </div>

      <div className="relative z-10 w-full pb-8 sm:pb-10">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp delay={150} direction="up">
            <div className="glass-card grid grid-cols-3 divide-x divide-white/15 max-w-xl">
              {stats.map(s => (
                <div key={s.l} className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 px-2 sm:px-6 py-3 sm:py-5 min-w-0">
                  <s.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="font-display text-lg sm:text-2xl font-semibold text-white leading-none truncate">{s.n}</p>
                    <p className="text-[10px] sm:text-[12px] text-white/70 mt-0.5 sm:mt-1 truncate">{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
