'use client'
import { useEffect, useState } from 'react'
import { Eye, Compass, FlaskConical, BookOpen, Trophy, MonitorPlay, Bus, ShieldCheck, Quote, Users2, Shuffle, Sparkles, Sprout, MonitorSmartphone, BadgeCheck, HeartHandshake, Rocket } from 'lucide-react'
import { getDocument, getCollection, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import FocusAreas from '@/components/FocusAreas'
import LeadershipMessage from '@/components/LeadershipMessage'
import StatsSection from '@/components/StatsSection'
import AdmissionsCTA from '@/components/AdmissionsCTA'
import Footer from '@/components/Footer'

const FALLBACK_CONTENT = `Agram Open School is an NIOS-accredited open school in Surat built on a simple belief: children flourish when high expectations are matched with genuine care. Our classrooms are places of questions, not just answers — and every child here is known by name, strength and struggle.`

// Shown only when the admin hasn't added infrastructure entries yet.
const FALLBACK_FACILITIES = [
  { id: 'f1', name: 'Science laboratories', description: 'Fully equipped physics, chemistry and biology labs where concepts are proven, not just read.' },
  { id: 'f2', name: 'Library', description: 'A quiet, well-stocked library with reading programmes for every grade.' },
  { id: 'f3', name: 'Smart classrooms', description: 'Interactive digital boards in every classroom, used to deepen — never replace — teaching.' },
  { id: 'f4', name: 'Sports grounds', description: 'Cricket, basketball and athletics facilities with structured coaching.' },
  { id: 'f5', name: 'Safe transport', description: 'GPS-tracked buses covering major routes across Surat with trained attendants.' },
  { id: 'f6', name: 'Campus safety', description: 'CCTV-monitored campus, verified staff and strict entry protocols.' },
]
const FACILITY_ICONS = [FlaskConical, BookOpen, MonitorPlay, Trophy, Bus, ShieldCheck]

// Static — vision & mission have no admin editing surface, so this is fixed copy.
const VISION_MISSION = [
  {
    icon: Eye,
    label: 'The vision',
    title: 'Swayam Tejasvi Bhava — be your own light',
    desc: 'To cultivate an inclusive, flexible and empowering learning ecosystem where every student discovers their unique potential, takes ownership of their journey, and graduates as a self-reliant, luminous leader.',
  },
  {
    icon: Compass,
    label: 'The mission',
    title: 'Removing barriers, igniting the spark',
    desc: 'To democratise education through a flexible, accessible, learner-centric environment — innovative open-schooling methods, personalised mentorship and a holistic curriculum that equip every student to be their own light.',
  },
]

// Static — the founding story & milestones are finalised, fixed copy with no admin surface.
const JOURNEY_INTRO = `Founded in 2015 on the Upanishadic blessing Swayam Tejasvi Bhava — be your own light — Agram Open School was built to challenge the "one-size-fits-all" approach to education, carving a path for dropouts, aspiring athletes, artists, slow learners and gifted children alike to reclaim their education on their own terms.`

const JOURNEY = [
  { tag: 'Foundation', year: '2015', icon: Sprout, title: 'The seed is sown', desc: 'Agram opens its doors as a pilot programme with just a handful of students, building a bridge curriculum for alternative learners out of a single learning centre.' },
  { tag: 'Modernisation', year: 'Phase 2', icon: MonitorSmartphone, title: 'Embracing the digital frontier', desc: 'Recognising the need for wider accessibility, Agram launches its own digital learning portal — bringing high-quality, self-paced modules to students in remote areas.' },
  { tag: 'Formal recognition', year: 'Phase 3', icon: BadgeCheck, title: 'National & board alignment', desc: 'Agram secures accreditation with NIOS, ensuring flexible learning is matched with universally valid certification for higher education.' },
  { tag: 'Holistic expansion', year: 'Phase 4', icon: HeartHandshake, title: 'The guiding hand', desc: 'A dedicated 1-on-1 mentorship programme is introduced, matching every learner with a life coach for emotional resilience, career paths and independent study habits.' },
  { tag: 'The Radiance', year: 'Present', icon: Rocket, title: 'A vibrant intellectuals’ network', desc: 'Our mentored learners go on to top universities, vocational careers, entrepreneurship and professional sports — proving self-illuminated learners can thrive anywhere.' },
]

// Static — the S.P.A.R.K. framework is finalised, fixed copy with no admin surface.
const CORE_VALUES = [
  { letter: 'S', icon: Compass, title: 'Self-Reliance', sub: 'Swayam', desc: 'Independent thinking and self-discipline — the autonomy to chart one’s own path as a self-driven, lifelong learner.' },
  { letter: 'P', icon: Users2, title: 'Perspective & Inclusivity', desc: 'We celebrate diversity and respect individual learning curves, creating a safe space where every student feels seen and valued.' },
  { letter: 'A', icon: Shuffle, title: 'Adaptability & Flexibility', desc: 'Education should fit life, not the other way around — open-schooling pathways that let students learn at their own pace.' },
  { letter: 'R', icon: Sparkles, title: 'Radiance & Excellence', sub: 'Tejasvi', desc: 'We aim beyond passing marks — for personal brilliance, moral integrity and the courage to let inner potential shine.' },
  { letter: 'K', icon: BookOpen, title: 'Knowledge for Life', sub: 'Bhava', desc: 'Learning that goes beyond textbooks — practical wisdom and emotional resilience to step confidently into the world.' },
]

export default function AboutPage() {
  const [about, setAbout] = useState(null)
  const [chairman, setChairman] = useState(null)
  const [facilities, setFacilities] = useState([])

  useEffect(() => {
    getDocument('school_info', 'about').then(setAbout)
    getDocument('school_info', 'chairman').then(setChairman)
    getCollection('infrastructure', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setFacilities(data.filter(isVisible)))
  }, [])

  const facilityList = facilities.length ? facilities : FALLBACK_FACILITIES

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="About"
        eyebrow="The school"
        title="Serious about learning. Gentle about"
        accent="childhood."
        sub="Who we are, what we believe, and the people who make Agram what it is."
        watermark="Agram"
      />

      {/* Our story — school_info/about */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-14 items-center">
            <FadeUp direction="left" className="lg:col-span-5">
              <p className="eyebrow">Our story</p>
              <h2 className="font-display font-semibold text-3xl lg:text-[38px] leading-[1.16] tracking-[-0.01em] mt-5">
                {about?.title || <>A decade of one <em className="italic font-medium text-crimson">promise</em></>}
              </h2>
              <div className="relative mt-10 border border-hairline p-2">
                <img src={about?.imageUrl || '/banner1.jpeg'} alt="Agram Open School campus"
                  className="w-full aspect-[4/3] object-cover img-treat" />
              </div>
            </FadeUp>
            <FadeUp delay={150} direction="blur" className="lg:col-span-6 lg:col-start-7">
              <div className="relative pl-8">
                <span aria-hidden className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gold" />
                {about?.content ? (
                  <div className="text-ink font-light leading-[1.75] text-xl lg:text-[23px] [&_p]:mb-6"
                    dangerouslySetInnerHTML={{ __html: about.content }} />
                ) : (
                  <p className="text-ink font-light leading-[1.75] text-xl lg:text-[23px]">{FALLBACK_CONTENT}</p>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Our journey — static founding story & milestones, no admin surface */}
      <section className="py-20 lg:py-28 bg-cream hairline-t relative overflow-hidden">
        <span aria-hidden className="absolute top-1/2 left-0 -translate-y-1/2 font-display italic font-semibold text-ink/[0.03] text-[160px] lg:text-[240px] leading-none select-none pointer-events-none whitespace-nowrap">
          Since 2015
        </span>
        <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
          <FadeUp direction="down" className="max-w-2xl mx-auto text-center mb-16 lg:mb-24">
            <p className="eyebrow justify-center">Our journey</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              From a single room to a <em className="italic font-medium text-crimson">movement</em>
            </h2>
            <p className="text-inkmute text-[15px] leading-relaxed mt-5">{JOURNEY_INTRO}</p>
          </FadeUp>

          <div className="relative">
            <span aria-hidden className="hidden lg:block absolute left-1/2 top-2 bottom-2 w-px bg-hairline -translate-x-1/2" />
            <span aria-hidden className="lg:hidden absolute left-6 top-2 bottom-2 w-px bg-hairline" />

            {JOURNEY.map((j, i) => {
              const isLast = i === JOURNEY.length - 1
              return (
                <div key={j.title} className="relative lg:grid lg:grid-cols-2 lg:gap-x-16 pb-14 lg:pb-20 last:pb-0">
                  <span className="absolute left-0 lg:left-1/2 top-0 lg:top-1 lg:-translate-x-1/2 h-12 w-12 rounded-full bg-cream border-2 border-gold flex items-center justify-center z-10">
                    {isLast && <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />}
                    <j.icon className="h-5 w-5 text-crimson relative" />
                  </span>

                  <FadeUp direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}
                    className={`pl-16 lg:pl-0 ${i % 2 === 0 ? 'lg:col-start-1 lg:pr-20 lg:text-right' : 'lg:col-start-2 lg:pl-20'}`}>
                    <span className="badge bg-crimson/10 text-crimson">{j.tag}</span>
                    <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-dark mt-3">{j.year}</p>
                    <h3 className="font-display font-semibold text-xl lg:text-2xl mt-1.5">{j.title}</h3>
                    <p className="text-inkmute text-[14px] leading-relaxed mt-2.5">{j.desc}</p>
                  </FadeUp>
                </div>
              )
            })}
          </div>

          <FadeUp direction="pop" className="max-w-lg mx-auto text-center mt-4 lg:mt-8">
            <Sparkles className="h-6 w-6 text-gold mx-auto" />
            <p className="font-display italic font-light text-xl lg:text-[22px] leading-snug text-ink mt-4">
              And the flame of <span className="text-crimson font-medium not-italic">Swayam Tejasvi Bhava</span> burns brighter with every passing year.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Vision & mission — static, no admin surface for this content */}
      <section className="py-20 lg:py-28 bg-navy relative overflow-hidden">
        <span aria-hidden className="absolute -top-8 right-0 font-display italic font-semibold text-white/[0.04] text-[150px] lg:text-[210px] leading-none select-none pointer-events-none">
          Vision
        </span>
        <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
          <FadeUp direction="down" className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-gold">
              <span className="w-[18px] h-[2px] bg-gold inline-block" />
              Vision &amp; mission
            </p>
            <h2 className="font-display font-semibold text-white text-3xl lg:text-[40px] leading-[1.14] tracking-[-0.01em] mt-5">
              Why this school <em className="italic font-medium text-gold">exists</em>
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-px bg-white/10 mt-14">
            {VISION_MISSION.map((v, i) => (
              <FadeUp key={v.label} delay={i * 120} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="group relative h-full bg-navy p-8 sm:p-10 transition-colors duration-[360ms] hover:bg-white/[0.04]">
                  <span className="absolute left-0 top-0 h-0 w-[3px] bg-gold transition-all duration-[360ms] group-hover:h-full" />
                  <div className="inline-flex items-center justify-center h-12 w-12 border border-gold/30 text-gold">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gold/70 mt-6">{v.label}</p>
                  <h3 className="font-display font-semibold text-2xl text-white mt-2.5">{v.title}</h3>
                  <p className="text-white/70 text-[14.5px] leading-relaxed mt-4">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Core values — static S.P.A.R.K. framework, no admin surface */}
      <section className="py-20 lg:py-28 bg-white hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp direction="down" className="max-w-xl mb-14">
            <p className="eyebrow">Our core values</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              The <em className="italic font-medium text-crimson">S.P.A.R.K.</em> that guides us
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-hairline">
            {CORE_VALUES.map((v, i) => (
              <FadeUp key={v.letter} delay={i * 90} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="group relative h-full p-7 border-r border-b border-hairline transition-colors duration-[360ms] hover:bg-cream">
                  <span className="absolute left-0 top-0 h-0 w-[3px] bg-gold transition-all duration-[360ms] group-hover:h-full" />
                  <p className="font-display text-[36px] font-light leading-none text-gold/40 group-hover:text-gold transition-colors">
                    {v.letter}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <v.icon className="h-4.5 w-4.5 text-gold-dark shrink-0" />
                    <h3 className="font-display font-semibold text-[15px] leading-snug">
                      {v.title}{v.sub && <span className="text-inkmute font-normal italic"> ({v.sub})</span>}
                    </h3>
                  </div>
                  <p className="text-inkmute text-[13px] leading-relaxed mt-2.5">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <FocusAreas />

      {/* Chairman's message — school_info/chairman */}
      {chairman?.content && (
        <section className="py-20 lg:py-28 bg-cream hairline-t">
          <div className="max-w-grid mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-12 gap-14 items-center">
              <FadeUp direction="zoom" className="lg:col-span-4">
                <div className="relative border border-hairline p-2 bg-white">
                  <img src={chairman.imageUrl || '/banner3.jpeg'} alt={chairman.name || 'Chairman'}
                    className="w-full aspect-[4/5] object-cover img-treat" />
                </div>
              </FadeUp>
              <FadeUp delay={130} direction="blur" className="lg:col-span-7 lg:col-start-6">
                <p className="eyebrow">From the Chairman&rsquo;s desk</p>
                <Quote className="h-8 w-8 text-gold mt-6" />
                <div className="font-display italic font-light text-xl lg:text-[26px] leading-[1.45] mt-4 text-ink [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: chairman.content }} />
                <div className="mt-7">
                  <p className="font-semibold text-[15px]">{chairman.name || 'Chairman'}</p>
                  <p className="text-inkmute text-[13.5px]">{chairman.designation || 'Agram Open School'}</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      )}

      <div id="principal">
        <LeadershipMessage />
      </div>

      {/* Infrastructure — admin collection with static fallback */}
      <section id="infrastructure" className="py-20 lg:py-28 bg-white hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp direction="down" className="max-w-xl mb-14">
            <p className="eyebrow">Infrastructure</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Built for <em className="italic font-medium text-crimson">learning</em>
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-hairline">
            {facilityList.map((f, i) => {
              const Icon = FACILITY_ICONS[i % FACILITY_ICONS.length]
              return (
                <FadeUp key={f.id} delay={(i % 3) * 100} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="group relative h-full border-r border-b border-hairline transition-colors duration-[360ms] hover:bg-cream overflow-hidden">
                    <span className="absolute left-0 top-0 h-0 w-[3px] bg-gold transition-all duration-[360ms] group-hover:h-full z-10" />
                    {f.imageUrl && (
                      <div className="aspect-[16/9] overflow-hidden img-hover">
                        <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover img-treat" />
                      </div>
                    )}
                    <div className="p-8">
                      {!f.imageUrl && <Icon className="h-6 w-6 text-crimson" />}
                      <h3 className="font-display font-semibold text-xl mt-4 first:mt-0">{f.name}</h3>
                      {f.description && (
                        <p className="text-inkmute text-[14.5px] leading-relaxed mt-2.5">{f.description}</p>
                      )}
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      <StatsSection />
      <AdmissionsCTA />
      <Footer />
    </main>
  )
}
