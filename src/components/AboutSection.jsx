'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { getDocument } from '@/lib/firestore'
import FadeUp from './FadeUp'

const IMAGES = [
  '/banner1.jpeg',
  '/banner2.jpeg',
  '/banner3.jpeg',
  '/science.jpeg',
  '/commerce.jpeg',
  '/life1.jpeg',
  '/life2.jpeg',
  '/life3.jpeg',
]
const FALLBACK_CONTENT = 'Agram Open School is an NIOS-accredited open school in Surat built on a simple belief: children flourish when high expectations are matched with genuine care. Our classrooms are places of questions, not just answers.'

// Three frames (big, bottom-right, top-left), each rotating on its own
// randomized clock so the changes never feel synchronized. A shared slots
// array guarantees no two frames ever show the same photo at once.
const SLOT_TIMING = [
  [3800, 6000], // big image
  [2800, 4800], // bottom-right card
  [4600, 7200], // top-left card
]

function ImageStack({ extraFirst }) {
  const imgs = extraFirst ? [extraFirst, ...IMAGES] : IMAGES
  const [slots, setSlots] = useState([0, 1, 2])

  useEffect(() => {
    const timers = []
    const advance = (slot) => {
      setSlots(prev => {
        const used = new Set(prev)
        const candidates = imgs.map((_, i) => i).filter(i => !used.has(i))
        if (!candidates.length) return prev
        const next = candidates[Math.floor(Math.random() * candidates.length)]
        const copy = [...prev]
        copy[slot] = next
        return copy
      })
    }
    const schedule = (slot) => {
      const [min, max] = SLOT_TIMING[slot]
      timers[slot] = setTimeout(() => {
        advance(slot)
        schedule(slot)
      }, min + Math.random() * (max - min))
    }
    slots.forEach((_, slot) => schedule(slot))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgs.length])

  const [current, next, third] = slots

  return (
    <div className="relative">
      {/* Big image */}
      <div className="border border-hairline p-2 bg-white">
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {imgs.map((src, i) => (
            <img key={src} src={src} alt="Life at Agram Open School"
              className={`absolute inset-0 w-full h-full object-cover img-treat transition-all duration-[1200ms] ease-out ${
                i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`} />
          ))}
          {/* Progress dots */}
          <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
            {imgs.map((_, i) => (
              <span key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current ? 'w-6 bg-gold' : 'w-2 bg-white/50'
                }`} />
            ))}
          </div>
        </div>
      </div>

      {/* Small overlapping image — bottom-right corner */}
      <div className="absolute -bottom-8 -right-4 sm:-bottom-10 sm:-right-10 w-32 sm:w-44 border-4 border-white shadow-xl bg-white">
        <div className="relative w-full aspect-square overflow-hidden">
          {imgs.map((src, i) => (
            <img key={src} src={src} alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ${
                i === next ? 'opacity-100' : 'opacity-0'
              }`} />
          ))}
        </div>
      </div>

      {/* Small overlapping image — top-left corner */}
      <div className="absolute -top-5 -left-3 sm:-top-8 sm:-left-8 w-28 sm:w-36 border-4 border-white shadow-xl bg-white">
        <div className="relative w-full aspect-square overflow-hidden">
          {imgs.map((src, i) => (
            <img key={src} src={src} alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ${
                i === third ? 'opacity-100' : 'opacity-0'
              }`} />
          ))}
        </div>
      </div>
    </div>
  )
}

const HIGHLIGHTS = [
  'NIOS-accredited open schooling (school code AAO04028)',
  'Smart classrooms & modern infrastructure',
  'Experienced, dedicated faculty',
  'Holistic growth through sports, arts & academics',
]

export default function AboutSection() {
  const [about, setAbout] = useState(null)
  useEffect(() => { getDocument('school_info', 'about').then(setAbout) }, [])

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-14 items-center">

          <div className="lg:col-span-5 relative">
            <FadeUp direction="zoom">
              <ImageStack extraFirst={about?.imageUrl} />
            </FadeUp>
          </div>

          <div className="lg:col-span-7">
            <FadeUp delay={150} direction="blur">
              <p className="eyebrow">The School</p>
              <h2 className="font-display font-semibold text-4xl lg:text-[46px] leading-[1.14] tracking-[-0.01em] mt-5">
                Serious about learning.<br />
                Gentle about <em className="italic font-medium text-crimson">childhood</em>.
              </h2>

              {about?.content ? (
                <div
                  className="text-inkmute leading-relaxed mt-6 max-w-xl [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: about.content }}
                />
              ) : (
                <p className="text-inkmute leading-relaxed mt-6 max-w-xl">{FALLBACK_CONTENT}</p>
              )}

              <ul className="grid sm:grid-cols-2 gap-3.5 mt-8 max-w-xl">
                {HIGHLIGHTS.map(h => (
                  <li key={h} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-crimson shrink-0 mt-0.5" />
                    <span className="text-ink text-[14.5px] leading-snug">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/about" className="btn-crimson">
                  About the School <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/academics" className="btn-outline-ink">
                  Academics
                </Link>
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  )
}
