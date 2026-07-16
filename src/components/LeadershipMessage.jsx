'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getDocument } from '@/lib/firestore'
import FadeUp from './FadeUp'

const IMG = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&q=80'
const FALLBACK = `We do not measure a school year by the syllabus it covers, but by the
confidence, curiosity and character it leaves behind in every child. At Agram
Open School, our teachers are asked to do something harder than teaching a
subject well — to notice the quiet student who needs encouragement, and the
loud one who needs direction. That is the promise we make to every family
who walks through our gates.`

export default function LeadershipMessage() {
  const [msg, setMsg] = useState(null)
  useEffect(() => { getDocument('school_info', 'principal').then(setMsg) }, [])

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-14 items-center">

          <div className="lg:col-span-5 order-2 lg:order-1">
            <FadeUp direction="left">
              <p className="eyebrow">From the Principal&rsquo;s desk</p>
              <blockquote className="font-display italic font-light text-2xl lg:text-[32px] leading-[1.35] tracking-[-0.005em] mt-6 text-ink">
                &ldquo;{msg?.content || FALLBACK}&rdquo;
              </blockquote>
              <div className="mt-8">
                <p className="font-semibold text-[15px]">{msg?.name || 'Principal'}</p>
                <p className="text-inkmute text-[13.5px]">{msg?.designation || 'Agram Open School'}</p>
              </div>
              <Link href="/about/principal" className="mt-7 inline-flex items-center gap-2 text-[14.5px] font-semibold link-quiet">
                Read the full message <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeUp>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
            <FadeUp direction="right">
              <div className="relative border border-hairline p-2">
                <img src={msg?.photoUrl || IMG} alt="Principal, Agram Open School"
                  className="w-full aspect-[16/11] object-cover img-treat" />
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  )
}
