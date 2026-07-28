'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpenCheck, PencilRuler, Users2, ClipboardCheck } from 'lucide-react'
import { getCollection, getDocument, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import AdmissionsCTA from '@/components/AdmissionsCTA'
import Footer from '@/components/Footer'

const STREAM_IMAGES = ['/banner1.jpeg', '/banner2.jpeg', '/science.jpeg', '/commerce.jpeg']

const FALLBACK_STREAMS = [
  { id: 'f', name: 'Foundational learning (OBE)', subjects: 'English, Hindi, Gujarati, Mathematics, EVS', description: 'NIOS’s Open Basic Education programme for younger learners — self-paced foundations in literacy and numeracy, without the pressure of a fixed classroom clock.' },
  { id: 's', name: 'Sciences', subjects: 'Physics, Chemistry, Biology, Mathematics', description: 'For learners drawn to the lab and the unknown — the same national NIOS curriculum, taught at a pace that respects how each student actually learns.' },
  { id: 'c', name: 'Commerce', subjects: 'Accountancy, Business Studies, Economics', description: 'Accountancy, business studies and economics for tomorrow’s entrepreneurs — taught with case studies drawn from real Indian businesses.' },
  { id: 'h', name: 'Humanities & vocational', subjects: 'History, Political Science, Psychology, Data Entry Operations, Tourism', description: 'For learners headed toward the humanities, the arts or a hands-on vocational skill — NIOS lets subjects be mixed across streams rather than locked into one.' },
]

const APPROACH = [
  { icon: BookOpenCheck, title: 'Understanding first', desc: 'Concepts before formulas. Students learn why before they memorise what.' },
  { icon: Users2, title: 'Small classes', desc: 'A 1:24 teacher–student ratio so no question goes unasked.' },
  { icon: PencilRuler, title: 'Learning by doing', desc: 'Labs, projects and fieldwork woven into every subject.' },
  { icon: ClipboardCheck, title: 'Honest assessment', desc: 'Regular, low-stakes evaluation that informs teaching — not fear.' },
]

export default function AcademicsClient() {
  const [streams, setStreams] = useState([])
  const [overview, setOverview] = useState(null)
  const [faculty, setFaculty] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    getCollection('academic_streams', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setStreams(data.filter(isVisible)))
    getDocument('school_info', 'academics_overview').then(setOverview)
    getCollection('faculty', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setFaculty(data.filter(isVisible)))
    getCollection('academic_departments', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setDepartments(data.filter(isVisible)))
  }, [])

  const list = streams.length ? streams : FALLBACK_STREAMS

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Academics"
        eyebrow="Academics"
        title="A curriculum that takes children"
        accent="seriously."
        sub="NIOS-accredited open schooling from foundational years through Grade 12 — taught for understanding, not just examinations."
        watermark="Learn"
      />

      {/* Overview — school_info/academics_overview */}
      {overview?.content && (
        <section className="py-16 lg:py-20 bg-white hairline-b">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <FadeUp direction="blur">
              <div className="text-inkmute leading-[1.85] text-[16px] [&_p]:mb-5 [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-4"
                dangerouslySetInnerHTML={{ __html: overview.content }} />
            </FadeUp>
          </div>
        </section>
      )}

      {/* Programmes — alternating rows */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp direction="down" className="max-w-xl mb-16">
            <p className="eyebrow">Programmes &amp; subjects</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Choose your own <em className="italic font-medium text-crimson">combination</em>
            </h2>
            <p className="text-inkmute text-[15px] leading-relaxed mt-5">
              As an NIOS-accredited open school, Agram doesn&rsquo;t lock a learner into a single track — subjects can be mixed across streams to match each child&rsquo;s pace, interests and goals.
            </p>
          </FadeUp>

          <div className="space-y-20 lg:space-y-28">
            {list.map((p, i) => (
              <div key={p.id} className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                <FadeUp direction={i % 2 === 0 ? 'left' : 'right'}
                  className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative border border-hairline p-2 img-hover">
                    <img src={STREAM_IMAGES[i % STREAM_IMAGES.length]} alt={p.name}
                      className="w-full aspect-[16/10] object-cover img-treat" />
                    <span className="absolute top-6 left-6 badge bg-crimson text-white">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </FadeUp>
                <FadeUp delay={130} direction="blur"
                  className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'}`}>
                  <h3 className="font-display font-semibold text-3xl lg:text-[34px] leading-tight">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-inkmute text-[15px] leading-relaxed mt-4">{p.description}</p>
                  )}
                  {p.subjects && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {p.subjects.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                        <span key={s} className="badge bg-cream text-ink border border-hairline">{s}</span>
                      ))}
                    </div>
                  )}
                  <Link href="/admissions"
                    className="inline-flex items-center gap-2 mt-6 text-crimson text-[14px] font-semibold link-quiet">
                    Admission details <ArrowRight className="h-4 w-4" />
                  </Link>
                </FadeUp>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we teach */}
      <section className="py-20 lg:py-28 bg-cream hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <FadeUp direction="left" className="lg:col-span-4">
              <p className="eyebrow">How we teach</p>
              <h2 className="font-display font-semibold text-3xl lg:text-[38px] leading-[1.16] tracking-[-0.01em] mt-5">
                One <em className="italic font-medium text-crimson">standard</em>
              </h2>
              <p className="text-inkmute text-[15px] leading-relaxed mt-5">
                Our faculty are experienced, trained every term, and chosen as much for patience as for subject mastery.
              </p>
              {departments.length > 0 && (
                <div className="mt-8">
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-dark mb-3">Departments</p>
                  <div className="flex flex-wrap gap-2">
                    {departments.map(d => (
                      <span key={d.id} className="badge bg-white text-ink border border-hairline">{d.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </FadeUp>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-hairline border border-hairline">
              {APPROACH.map((a, i) => (
                <FadeUp key={a.title} delay={i * 110} direction="pop" className="bg-white">
                  <div className="p-8 h-full hover:bg-cream transition-colors duration-[360ms]">
                    <a.icon className="h-6 w-6 text-crimson" />
                    <h3 className="font-display font-semibold text-xl mt-4">{a.title}</h3>
                    <p className="text-inkmute text-[14.5px] leading-relaxed mt-2.5">{a.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty — admin collection */}
      {faculty.length > 0 && (
        <section id="faculty" className="py-20 lg:py-28 bg-white hairline-t">
          <div className="max-w-grid mx-auto px-6 lg:px-12">
            <FadeUp direction="down" className="max-w-xl mb-14">
              <p className="eyebrow">The people</p>
              <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
                Meet our <em className="italic font-medium text-crimson">faculty</em>
              </h2>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {faculty.map((f, i) => (
                <FadeUp key={f.id} delay={(i % 4) * 100} direction="pop">
                  <div className="group card card-hover border border-hairline overflow-hidden h-full">
                    <div className="relative aspect-[4/5] overflow-hidden img-hover bg-cream">
                      {f.photoUrl ? (
                        <img src={f.photoUrl} alt={f.name} className="w-full h-full object-cover img-treat" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-6xl text-hairline font-semibold">
                            {f.name?.[0]?.toUpperCase() || 'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-[17px] leading-snug group-hover:text-crimson transition-colors">{f.name}</h3>
                      <p className="text-inkmute text-[13px] mt-1">{f.designation}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
                        {f.department && (
                          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-gold-dark">{f.department}</span>
                        )}
                        {f.qualification && (
                          <span className="text-[11.5px] text-inkmute">{f.qualification}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}
      {faculty.length === 0 && <div id="faculty" />}

      <AdmissionsCTA />
      <Footer />
    </main>
  )
}
