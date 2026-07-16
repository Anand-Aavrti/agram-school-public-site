'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { getDocument } from '@/lib/firestore'
import FadeUp from './FadeUp'

const IMG = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80'
const FALLBACK_CONTENT = 'Agram Open School is a CBSE-affiliated school in Surat built on a simple belief: children flourish when high expectations are matched with genuine care. Our classrooms are places of questions, not just answers.'

const HIGHLIGHTS = [
  'CBSE affiliated with 30+ years of excellence',
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
            <FadeUp direction="left">
              <div className="relative">
                <div className="border border-hairline p-2 img-hover">
                  <img src={about?.imageUrl || IMG} alt="A classroom at Agram Open School"
                    className="w-full aspect-[4/5] object-cover img-treat" />
                </div>
                <div className="absolute -bottom-5 -right-3 sm:-bottom-7 sm:-right-8 bg-crimson text-white p-4 sm:p-5">
                  <p className="font-display text-2xl sm:text-3xl font-bold leading-none">30+</p>
                  <p className="text-[11px] sm:text-[12px] font-medium opacity-90 mt-1">Years of Excellence</p>
                </div>
                <div className="absolute -top-4 -left-3 sm:-top-6 sm:-left-8 bg-gold text-navy p-3.5 sm:p-4">
                  <p className="font-display text-xl sm:text-2xl font-bold leading-none">1200+</p>
                  <p className="text-[10px] sm:text-[11px] font-semibold mt-1">Happy Students</p>
                </div>
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-7">
            <FadeUp delay={100} direction="right">
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
                <Link href="/about/vision" className="btn-outline-ink">
                  Our Vision
                </Link>
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  )
}
