'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Phone, Mail } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'
import { SCHOOL_SHORT_NAME } from '@/lib/branding'

const GRADES = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11 — Science', 'Grade 11 — Commerce']

const field = 'w-full bg-white border border-hairline px-4 py-3.5 text-[15px] text-ink placeholder:text-inkmute/60 focus:outline-none focus:border-crimson transition-colors'
const label = 'block text-[13px] font-semibold text-ink mb-2'

export default function ApplyClient() {
  const [form, setForm] = useState({ childName: '', grade: '', parentName: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.childName || !form.grade || !form.parentName || !form.phone) return
    setStatus('sending')
    try {
      // Per PUBLIC_WEBSITE_SCHEMA.md: public admission forms create into
      // `applications` with a locked initial status of "pending".
      await addDoc(collection(db, 'applications'), {
        ...form,
        createdAt: serverTimestamp(),
        status: 'pending',
      })
      setStatus('done')
    } catch (err) {
      console.error('Application submit failed:', err)
      setStatus('error')
    }
  }

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Apply"
        eyebrow="Admissions 2026–27"
        title="Start your"
        accent="application."
        sub="Under ten minutes, no documents needed yet — we call you back within one working day."
        watermark="Apply"
      />

      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-grid mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14">

          {/* Form */}
          <FadeUp direction="left" className="lg:col-span-7">
            {status === 'done' ? (
              <div className="bg-white border border-hairline p-10 lg:p-14 text-center">
                <CheckCircle2 className="h-12 w-12 text-crimson mx-auto" />
                <h2 className="font-display font-semibold text-3xl mt-6">Application received</h2>
                <p className="text-inkmute text-[15px] leading-relaxed mt-3 max-w-md mx-auto">
                  Thank you — our admissions team will call you within one working day to schedule a campus visit.
                </p>
                <Link href="/" className="btn-crimson mt-8 inline-flex">
                  Back to home <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white border border-hairline p-8 lg:p-12">
                <h2 className="font-display font-semibold text-2xl mb-8">Applicant details</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={label}>Child&rsquo;s full name *</label>
                    <input required value={form.childName} onChange={set('childName')} className={field} placeholder="Full name" />
                  </div>
                  <div>
                    <label className={label}>Applying for *</label>
                    <select required value={form.grade} onChange={set('grade')} className={field}>
                      <option value="">Select grade</option>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={label}>Parent / guardian name *</label>
                    <input required value={form.parentName} onChange={set('parentName')} className={field} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={label}>Phone *</label>
                    <input required type="tel" value={form.phone} onChange={set('phone')} className={field} placeholder="+91" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Email</label>
                    <input type="email" value={form.email} onChange={set('email')} className={field} placeholder="you@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Anything we should know?</label>
                    <textarea rows={4} value={form.message} onChange={set('message')} className={field}
                      placeholder={`Previous school, sibling at ${SCHOOL_SHORT_NAME}, preferred visit time…`} />
                  </div>
                </div>
                {status === 'error' && (
                  <p className="text-crimson text-[14px] mt-6">
                    Something went wrong submitting online — please call us at +91 98765 43210 and we&rsquo;ll take your application over the phone.
                  </p>
                )}
                <button type="submit" disabled={status === 'sending'} className="btn-crimson mt-8 disabled:opacity-60">
                  {status === 'sending' ? 'Submitting…' : 'Submit application'} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </FadeUp>

          {/* Side info */}
          <FadeUp delay={150} direction="right" className="lg:col-span-4 lg:col-start-9">
            <div className="bg-navy text-white p-8">
              <h3 className="font-display font-semibold text-xl">What happens next</h3>
              <ol className="mt-6 space-y-5">
                {['We call you within one working day', 'You visit the campus with your child', 'Interaction & document submission', 'Seat confirmation and orientation'].map((s, i) => (
                  <li key={s} className="flex gap-4 items-start">
                    <span className="font-display text-gold font-semibold text-lg leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-white/75 text-[14.5px] leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
              <div className="border-t border-white/15 mt-8 pt-6 space-y-3">
                <p className="flex items-center gap-2.5 text-[14px] text-white/80">
                  <Phone className="h-4 w-4 text-gold" /> +91 98765 43210
                </p>
                <p className="flex items-center gap-2.5 text-[14px] text-white/80">
                  <Mail className="h-4 w-4 text-gold" /> hello@demoschool.example
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  )
}
