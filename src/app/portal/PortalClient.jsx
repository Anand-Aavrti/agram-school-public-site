'use client'
import Link from 'next/link'
import { LockKeyhole, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'

export default function PortalClient() {
  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Portal"
        eyebrow="Parents · Students · Staff"
        title="The Agram"
        accent="portal."
        sub="Report cards, circulars, fee receipts and attendance — in one place."
        watermark="Portal"
      />

      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp direction="pop" className="max-w-xl mx-auto">
            <div className="bg-white border border-hairline p-10 lg:p-14 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 bg-navy text-gold">
                <LockKeyhole className="h-6 w-6" />
              </span>
              <h2 className="font-display font-semibold text-3xl mt-6">Launching soon</h2>
              <p className="text-inkmute text-[15px] leading-relaxed mt-4">
                The online portal is being rolled out grade by grade this term. Until then, report cards and circulars continue to be shared through class teachers and the school diary.
              </p>
              <Link href="/contact" className="btn-crimson mt-8 inline-flex">
                Need something meanwhile? <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  )
}
