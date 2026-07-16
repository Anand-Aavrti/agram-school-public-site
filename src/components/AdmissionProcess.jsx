'use client'
import Link from 'next/link'
import { ArrowRight, MessageSquare, MapPinned, FileCheck, PartyPopper } from 'lucide-react'
import FadeUp from './FadeUp'

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Enquire',
    desc: 'Reach out to our admissions desk with your child’s grade and a few details — we respond within one working day.',
  },
  {
    icon: MapPinned,
    title: 'Visit the campus',
    desc: 'Walk through our classrooms on an ordinary school day and meet the teachers who will actually teach your child.',
  },
  {
    icon: FileCheck,
    title: 'Submit application',
    desc: 'Complete the application form along with the required documents and the registration fee, online or at the front office.',
  },
  {
    icon: PartyPopper,
    title: 'Welcome aboard',
    desc: 'Once the seat is confirmed, we schedule an orientation for your child and family before the term begins.',
  },
]

export default function AdmissionProcess() {
  return (
    <section className="py-24 lg:py-32 bg-white hairline-t">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center gap-6 mb-14 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <FadeUp direction="down" className="max-w-xl mx-auto lg:mx-0">
            <p className="eyebrow">Admissions 2026–27</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Four steps to <em className="italic font-medium text-crimson">enroll</em>
            </h2>
          </FadeUp>
          <Link href="/admissions" className="link-quiet text-[14.5px] font-semibold flex items-center gap-2">
            Admissions guide <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-hairline">
          {STEPS.map((s, i) => (
            <FadeUp key={s.title} delay={i * 100} direction="up" className="min-w-0">
              <div className="relative h-full min-w-0 flex flex-col items-center text-center pb-8 sm:pb-8 lg:pb-0 pt-8 px-4 sm:px-6 lg:px-0 lg:pr-6 border-b border-hairline sm:border-b lg:border-b-0 lg:border-r last:border-b-0 last:border-r-0 lg:items-start lg:text-left">
                <p className="font-display text-6xl font-light text-hairline leading-none">{String(i + 1).padStart(2, '0')}</p>
                <s.icon className="h-6 w-6 text-crimson mt-5" />
                <h3 className="font-display font-semibold text-lg mt-3">{s.title}</h3>
                <p className="text-inkmute text-[14px] leading-relaxed mt-2.5 max-w-[240px] break-words">{s.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={200} direction="up" className="mt-12 pt-10 border-t border-hairline flex justify-center lg:justify-start">
          <Link href="/admissions/apply" className="btn-crimson">
            Start your application <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
