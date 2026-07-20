'use client'
import { Trophy, Palette, Music, Mic2, Leaf, Puzzle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Gallery from '@/components/Gallery'
import TestimonialsSection from '@/components/TestimonialsSection'
import AdmissionsCTA from '@/components/AdmissionsCTA'
import Footer from '@/components/Footer'

const ACTIVITIES = [
  { icon: Trophy, title: 'Sports', desc: 'Cricket, basketball, athletics and yoga with structured coaching and inter-house tournaments every term.', img: '/banner2.jpeg' },
  { icon: Palette, title: 'Art & craft', desc: 'A working studio where sketching, painting and craft are taught as skills — with an annual exhibition of student work.', img: '/banner3.jpeg' },
  { icon: Music, title: 'Music & dance', desc: 'Vocal, instrumental and classical dance programmes, performed at every school gathering.', img: '/banner1.jpeg' },
  { icon: Mic2, title: 'Debate & drama', desc: 'Elocution, debate and an annual production that puts every willing student on stage at least once.', img: '/science.jpeg' },
  { icon: Leaf, title: 'Eco club', desc: 'A student-run garden, recycling drives and field trips that make environmental care a habit, not a lesson.', img: '/commerce.jpeg' },
  { icon: Puzzle, title: 'Clubs & olympiads', desc: 'Chess, robotics, mathematics and science olympiad circles for students who want to go deeper.', img: '/banner1.jpeg' },
]

const HOUSES = [
  { name: 'Agni', color: 'bg-crimson', desc: 'Courage' },
  { name: 'Vayu', color: 'bg-navy', desc: 'Speed' },
  { name: 'Prithvi', color: 'bg-gold', desc: 'Strength' },
  { name: 'Jal', color: 'bg-ink', desc: 'Calm' },
]

export default function StudentLifePage() {
  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Student life"
        eyebrow="Beyond the classroom"
        title="More than"
        accent="marks."
        sub="Sports, arts, music, clubs and houses — the parts of school children remember longest."
        watermark="Play"
      />

      {/* Activities */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp direction="down" className="max-w-xl mb-14">
            <p className="eyebrow">Every week</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Something for every <em className="italic font-medium text-crimson">child</em>
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIVITIES.map((a, i) => (
              <FadeUp key={a.title} delay={i * 100} direction="zoom">
                <div className="group border border-hairline overflow-hidden card-hover card h-full">
                  <div className="relative aspect-[16/10] overflow-hidden img-hover">
                    <img src={a.img} alt={a.title} className="w-full h-full object-cover img-treat" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                    <a.icon className="absolute bottom-4 left-4 h-6 w-6 text-gold" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-xl">{a.title}</h3>
                    <p className="text-inkmute text-[14.5px] leading-relaxed mt-2">{a.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Houses */}
      <section className="py-20 lg:py-28 bg-navy relative overflow-hidden">
        <span aria-hidden className="absolute -bottom-8 left-0 font-display italic font-semibold text-white/[0.04] text-[160px] lg:text-[220px] leading-none select-none pointer-events-none">
          Houses
        </span>
        <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
          <FadeUp direction="down" className="max-w-xl mb-14">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-gold">
              <span className="w-[18px] h-[2px] bg-gold inline-block" />
              The house system
            </p>
            <h2 className="font-display font-semibold text-white text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Four houses, one <em className="italic font-medium text-gold">spirit</em>
            </h2>
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {HOUSES.map((h, i) => (
              <FadeUp key={h.name} delay={i * 120} direction="pop" className="bg-navy">
                <div className="p-8 lg:p-10 text-center group hover:bg-navy-light transition-colors duration-[360ms]">
                  <span className={`inline-block w-4 h-4 ${h.color} rounded-full ring-4 ring-white/10`} />
                  <p className="font-display font-semibold text-white text-2xl lg:text-3xl mt-5">{h.name}</p>
                  <p className="text-white/50 text-[13px] uppercase tracking-[0.14em] mt-2">{h.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={200} direction="up">
            <p className="text-white/50 text-[14.5px] leading-relaxed mt-8 max-w-2xl">
              Every student belongs to a house from day one — earning points for sport, academics, conduct and service through the year, culminating in the annual house trophy.
            </p>
          </FadeUp>
        </div>
      </section>

      <Gallery />
      <TestimonialsSection />
      <AdmissionsCTA />
      <Footer />
    </main>
  )
}
