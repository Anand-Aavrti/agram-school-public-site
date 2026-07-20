'use client'
import { Heart, BookOpenCheck, Trophy, Users2 } from 'lucide-react'
import FadeUp from './FadeUp'

const PILLARS = [
  {
    num: '01',
    icon: BookOpenCheck,
    title: 'Academic rigour',
    desc: 'A curriculum taught with depth, not just coverage — building thinkers, not memorisers. Every subject is anchored in real understanding rather than rote preparation for exams.',
  },
  {
    num: '02',
    icon: Heart,
    title: 'Genuine care',
    desc: 'Small class sizes and teachers who know every child by name, strength, and struggle, so no student is ever just a face in the back row.',
  },
  {
    num: '03',
    icon: Trophy,
    title: 'Holistic growth',
    desc: 'Sports, arts, music and leadership woven into everyday school life, not treated as extras — because a full education is more than marks on a report card.',
  },
  {
    num: '04',
    icon: Users2,
    title: 'A real community',
    desc: 'Parents, faculty and alumni who stay involved and invested well beyond graduation day, keeping the Agram family close for years after.',
  },
]

export default function FocusAreas() {
  return (
    <section className="py-24 lg:py-32 bg-white hairline-t">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <FadeUp direction="down" className="max-w-xl mb-14">
          <p className="eyebrow">Why families choose us</p>
          <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
            What sets <em className="italic font-medium text-crimson">Agram</em> apart
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-hairline">
          {PILLARS.map((p, i) => (
            <FadeUp key={p.title} delay={i * 90} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className="group relative h-full p-8 border-r border-b border-hairline transition-colors duration-[360ms] hover:bg-cream">
                <span className="absolute left-0 top-0 h-0 w-[3px] bg-crimson transition-all duration-[360ms] group-hover:h-full" />
                <p className="font-display text-[42px] font-light leading-none text-crimson/25 group-hover:text-crimson/40 transition-colors">
                  {p.num}
                </p>
                <div className="flex items-center gap-2.5 mt-5">
                  <p.icon className="h-5 w-5 text-crimson shrink-0" />
                  <h3 className="font-display font-semibold text-xl">{p.title}</h3>
                </div>
                <p className="text-inkmute text-[14.5px] leading-relaxed mt-3">{p.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
