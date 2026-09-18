'use client'
import { useEffect, useState } from 'react'
import { Mail, GraduationCap, HeartHandshake, TrendingUp, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getCollection, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'
import { SCHOOL_SHORT_NAME } from '@/lib/branding'

const REASONS = [
  { icon: GraduationCap, title: 'Teach properly', desc: 'Small classes and sensible workloads, so you can actually teach — not just finish portions.' },
  { icon: HeartHandshake, title: 'Be supported', desc: 'Termly training, mentoring for new teachers, and a staff room that behaves like a team.' },
  { icon: TrendingUp, title: 'Grow here', desc: `Coordinators, heads and leaders at ${SCHOOL_SHORT_NAME} are promoted from within, not parachuted in.` },
]

const field = 'w-full bg-white border border-hairline px-4 py-3.5 text-[15px] text-ink placeholder:text-inkmute/60 focus:outline-none focus:border-crimson transition-colors'
const label = 'block text-[13px] font-semibold text-ink mb-2'

export default function CareersClient() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', experience: '', message: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    getCollection('jobs', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setJobs(data.filter(isVisible).filter(j => !j.lastDate || j.lastDate >= today)))
  }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.position) return
    setStatus('sending')
    try {
      // Per PUBLIC_WEBSITE_SCHEMA.md: careers forms create into
      // `job_applications` with a locked initial status of "new".
      await addDoc(collection(db, 'job_applications'), {
        ...form,
        createdAt: serverTimestamp(),
        status: 'new',
      })
      setStatus('done')
    } catch (err) {
      console.error('Job application failed:', err)
      setStatus('error')
    }
  }

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Careers"
        eyebrow="Work with us"
        title="Teach at"
        accent={`${SCHOOL_SHORT_NAME}.`}
        sub="We hire for patience and subject mastery — in that order."
        watermark="Teach"
      />

      {/* Why teach here */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-3 border-t border-l border-hairline">
            {REASONS.map((r, i) => (
              <FadeUp key={r.title} delay={i * 110} direction="pop">
                <div className="p-8 lg:p-10 border-r border-b border-hairline h-full hover:bg-cream transition-colors duration-[360ms]">
                  <r.icon className="h-6 w-6 text-crimson" />
                  <h3 className="font-display font-semibold text-xl mt-4">{r.title}</h3>
                  <p className="text-inkmute text-[14.5px] leading-relaxed mt-2.5">{r.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions — admin `jobs` collection */}
      <section className="py-20 lg:py-28 bg-cream hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp direction="down" className="max-w-xl mb-12">
            <p className="eyebrow">Open positions</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              We&rsquo;re <em className="italic font-medium text-crimson">hiring</em>
            </h2>
          </FadeUp>

          {jobs.length === 0 ? (
            <FadeUp direction="up">
              <div className="bg-white border border-hairline p-8 max-w-2xl">
                <p className="text-inkmute text-[15px] leading-relaxed">
                  No positions are open right now — but we keep applications on file year-round and reach out as roles open across primary, middle and senior school. Send yours below.
                </p>
              </div>
            </FadeUp>
          ) : (
            <div className="border-t-2 border-ink">
              {jobs.map((j, i) => (
                <FadeUp key={j.id} delay={(i % 4) * 100} direction="left">
                  <div className="grid lg:grid-cols-12 gap-4 lg:gap-8 py-8 border-b border-hairline items-start">
                    <div className="lg:col-span-5">
                      <h3 className="font-display font-semibold text-2xl leading-tight">{j.title}</h3>
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
                        {j.department && (
                          <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-gold-dark">{j.department}</span>
                        )}
                        {j.type && (
                          <span className="text-[12.5px] text-inkmute flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {j.type}
                          </span>
                        )}
                        {j.lastDate && (
                          <span className="text-[12.5px] text-crimson font-medium">Apply by {j.lastDate}</span>
                        )}
                      </div>
                    </div>
                    <div className="lg:col-span-5">
                      {j.description && <p className="text-inkmute text-[14.5px] leading-relaxed">{j.description}</p>}
                      {(j.qualification || j.experience) && (
                        <p className="text-[13px] text-inkmute mt-2.5">
                          {[j.qualification, j.experience && `${j.experience} experience`].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                    <div className="lg:col-span-2 lg:justify-self-end">
                      <a href="#apply"
                        onClick={() => setForm(f => ({ ...f, position: j.title }))}
                        className="btn-outline-ink !py-2.5 !px-5 text-[13.5px]">
                        Apply <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application form → job_applications */}
      <section id="apply" className="py-20 lg:py-28 bg-white hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14">
          <FadeUp direction="left" className="lg:col-span-4">
            <p className="eyebrow">Apply</p>
            <h2 className="font-display font-semibold text-3xl lg:text-[38px] leading-[1.16] mt-5">
              Send us your <em className="italic font-medium text-crimson">details</em>
            </h2>
            <p className="text-inkmute text-[15px] leading-relaxed mt-5">
              We keep every application on file and respond to shortlisted candidates within two weeks. You can also email your résumé directly.
            </p>
            <a href="mailto:careers@demoschool.example" className="inline-flex items-center gap-2 mt-6 text-crimson text-[14px] font-semibold link-quiet">
              <Mail className="h-4 w-4" /> careers@demoschool.example
            </a>
          </FadeUp>

          <FadeUp delay={130} direction="right" className="lg:col-span-8">
            {status === 'done' ? (
              <div className="bg-cream border border-hairline p-10 lg:p-14 text-center">
                <CheckCircle2 className="h-12 w-12 text-crimson mx-auto" />
                <h2 className="font-display font-semibold text-3xl mt-6">Application received</h2>
                <p className="text-inkmute text-[15px] leading-relaxed mt-3 max-w-md mx-auto">
                  Thank you — please also email your résumé to careers@demoschool.example mentioning the position, so we can match it to your application.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-cream border border-hairline p-8 lg:p-12">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={label}>Your name *</label>
                    <input required value={form.name} onChange={set('name')} className={field} placeholder="Full name" />
                  </div>
                  <div>
                    <label className={label}>Position *</label>
                    <input required value={form.position} onChange={set('position')} className={field} placeholder="e.g. TGT Mathematics" />
                  </div>
                  <div>
                    <label className={label}>Phone *</label>
                    <input required type="tel" value={form.phone} onChange={set('phone')} className={field} placeholder="+91" />
                  </div>
                  <div>
                    <label className={label}>Email</label>
                    <input type="email" value={form.email} onChange={set('email')} className={field} placeholder="you@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Experience</label>
                    <input value={form.experience} onChange={set('experience')} className={field} placeholder="e.g. 5 years, senior secondary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>A few lines about you</label>
                    <textarea rows={4} value={form.message} onChange={set('message')} className={field}
                      placeholder="Subjects, grades taught, current school…" />
                  </div>
                </div>
                {status === 'error' && (
                  <p className="text-crimson text-[14px] mt-6">
                    Something went wrong — please email careers@demoschool.example instead.
                  </p>
                )}
                <button type="submit" disabled={status === 'sending'} className="btn-crimson mt-8 disabled:opacity-60">
                  {status === 'sending' ? 'Submitting…' : 'Submit application'} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  )
}
