'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Users, Award, Clock } from 'lucide-react'
import { getCollection, getSiteSettings, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

const HERO_IMG = '/banner2.jpeg'

// Background videos play one after another: when one finishes it crossfades
// into the next. Each poster is the clip's own first frame, so there is no
// jump when playback starts. Swap these files for real campus footage.
const VIDEOS = [
  { src: '/videos/hero1.mp4', poster: '/hero1-poster.jpg' },
  { src: '/videos/hero2.mp4', poster: '/hero2-poster.jpg' },
  { src: '/videos/hero3.mp4', poster: '/hero3-poster.jpg' },
]

export default function HeroSection() {
  const [banner, setBanner] = useState(null)
  const [settings, setSettings] = useState(null)
  const [current, setCurrent] = useState(0)
  const videoRefs = useRef([])

  useEffect(() => {
    getCollection('banners', { orderByField: 'order', orderDir: 'asc' }).then(data => {
      const visible = data.filter(isVisible)
      if (visible.length > 0) setBanner(visible[0])
    })
    getSiteSettings().then(setSettings)
  }, [])

  // Play only the active video; restart it from the top on each switch.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === current) {
        v.currentTime = 0
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [current])

  const advance = () => setCurrent(c => (c + 1) % VIDEOS.length)

  const image = banner?.imageUrl || HERO_IMG
  const ctaHref = banner?.buttonLink || '/admissions/apply'
  const ctaLabel = banner?.buttonLabel || 'Apply for Admission'

  const stats = [
    { icon: Users, n: settings?.statsStudents || '1,200+', l: 'Students' },
    { icon: Award, n: settings?.statsTeachers || '80+', l: 'Faculty' },
    { icon: Clock, n: settings?.statsYears || '10+', l: `Years in ${SCHOOL_CITY}` },
  ]

  return (
    <section className="relative flex flex-col min-h-[560px] sm:h-[92vh] sm:min-h-[560px] sm:max-h-[820px] overflow-hidden">
      {/* Fallback image underneath — shows until the first video is ready */}
      <img src={image} alt={`Students at ${SCHOOL_NAME}`}
        className="absolute inset-0 w-full h-full object-cover img-treat" />

      {/* Video layers — the finished one crossfades into the next */}
      {VIDEOS.map((v, i) => (
        <video
          key={v.src}
          ref={el => { videoRefs.current[i] = el }}
          src={v.src}
          poster={v.poster}
          muted
          playsInline
          preload="auto"
          onEnded={advance}
          onError={e => { e.target.style.display = 'none'; if (i === current) advance() }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/20 to-transparent" />

      <div className="relative z-10 max-w-grid mx-auto px-6 lg:px-12 flex-1 flex items-center w-full py-16 sm:py-0">
        <FadeUp direction="pop" className="max-w-2xl">
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
            {banner?.subtitle || 'An co-educational day school where every learner charts their own path — flexible, personal, and full of warmth.'}
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
          <FadeUp delay={250} direction="pop">
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
