import Link from 'next/link'
import { ArrowUpRight, Phone, Mail } from 'lucide-react'
import FadeUp from './FadeUp'

const CTA_IMG = '/banner1.jpeg'

export default function AdmissionsCTA() {
  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      <img src={CTA_IMG} alt="" className="absolute inset-0 w-full h-full object-cover img-treat" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
      {/* <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} /> */}

      <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <FadeUp direction="left">
              <span className="badge bg-gold text-navy">Admissions Open · 2026–27</span>
              <h2 className="font-display font-semibold text-white text-5xl lg:text-[72px] leading-[1.08] tracking-[-0.015em] mt-7">
                Come and see<br />for <em className="italic font-medium text-gold">yourself</em>
              </h2>
              <p className="text-white/70 text-[15.5px] leading-relaxed max-w-md mt-6">
                The best way to understand a school is to walk through it
                on an ordinary morning. We would be glad to show you ours.
              </p>
            </FadeUp>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <FadeUp delay={150} direction="right">
              <div className="flex flex-col gap-4 items-start lg:items-end">
                <Link href="/admissions/apply" className="btn-gold">
                  Begin an application <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-outline-white">
                  Schedule a visit <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-8 lg:justify-end text-white/70">
                <span className="flex items-center gap-2 text-[13.5px]"><Phone className="h-4 w-4 text-gold" /> +91 98765 43210</span>
                <span className="flex items-center gap-2 text-[13.5px]"><Mail className="h-4 w-4 text-gold" /> admissions@agramschool.edu.in</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
