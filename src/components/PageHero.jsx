'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import FadeUp from './FadeUp'

// Shared page header band for all inner pages — navy, serif headline with an
// italic gold accent word, breadcrumb trail and a faint oversized watermark.
export default function PageHero({ eyebrow, title, accent, sub, crumb, watermark }) {
  return (
    <section className="relative bg-navy overflow-hidden">
      {watermark && (
        <span aria-hidden className="absolute -bottom-8 right-0 font-display italic font-semibold text-white/[0.04] text-[140px] lg:text-[220px] leading-none select-none pointer-events-none">
          {watermark}
        </span>
      )}
      <div className="max-w-grid mx-auto px-6 lg:px-12 py-16 lg:py-24 relative">
        <FadeUp direction="pop">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50 mb-7">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/80">{crumb}</span>
          </nav>
          {eyebrow && (
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-gold">
              <span className="w-[18px] h-[2px] bg-gold inline-block" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-display font-semibold text-white text-4xl sm:text-5xl lg:text-[58px] leading-[1.1] tracking-[-0.01em] mt-5 max-w-3xl">
            {title}{accent && <> <em className="italic font-medium text-gold">{accent}</em></>}
          </h1>
          {sub && (
            <p className="text-white/60 text-base lg:text-lg leading-relaxed mt-6 max-w-2xl">{sub}</p>
          )}
        </FadeUp>
      </div>
    </section>
  )
}
