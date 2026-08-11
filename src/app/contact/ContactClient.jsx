'use client'
import { useState } from 'react'
import { ArrowRight, Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'

const INFO = [
  { icon: Phone, title: 'Call us', lines: ['+91 98765 43210', 'Mon–Sat · 8:00 am – 4:00 pm'] },
  { icon: Mail, title: 'Write to us', lines: ['agram.surat@gmail.com', 'We reply within one working day'] },
  { icon: MapPin, title: 'Visit us', lines: ['Agram Open School', 'Surat, Gujarat, India'] },
  { icon: Clock, title: 'School hours', lines: ['Mon–Sat · 7:30 am – 2:30 pm', 'Front office open till 4:00 pm'] },
]

const field = 'w-full bg-white border border-hairline px-4 py-3.5 text-[15px] text-ink placeholder:text-inkmute/60 focus:outline-none focus:border-crimson transition-colors'
const label = 'block text-[13px] font-semibold text-ink mb-2'

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) return
    setStatus('sending')
    try {
      // Per PUBLIC_WEBSITE_SCHEMA.md: public contact forms create into
      // `enquiries` (requires non-empty name, status locked to "new").
      await addDoc(collection(db, 'enquiries'), {
        ...form,
        createdAt: serverTimestamp(),
        status: 'new',
      })
      setStatus('done')
    } catch (err) {
      console.error('Contact submit failed:', err)
      setStatus('error')
    }
  }

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Contact"
        eyebrow="Contact"
        title="Talk to"
        accent="us."
        sub="Questions about admissions, fees or a campus visit — we respond within one working day."
        watermark="Hello"
      />

      {/* Info tiles */}
      <section className="bg-white hairline-b">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {INFO.map((c, i) => (
              <FadeUp key={c.title} delay={i * 100} direction="pop">
                <div className={`py-10 px-2 lg:px-8 h-full ${i > 0 ? 'lg:border-l lg:border-hairline' : ''}`}>
                  <c.icon className="h-6 w-6 text-crimson" />
                  <h3 className="font-display font-semibold text-lg mt-4">{c.title}</h3>
                  {c.lines.map(l => (
                    <p key={l} className="text-inkmute text-[14px] leading-relaxed mt-1 first-of-type:mt-2 first-of-type:text-ink first-of-type:font-medium">{l}</p>
                  ))}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Form + map */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-grid mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 items-start">
          <FadeUp direction="left">
            {status === 'done' ? (
              <div className="bg-white border border-hairline p-10 lg:p-14 text-center">
                <CheckCircle2 className="h-12 w-12 text-crimson mx-auto" />
                <h2 className="font-display font-semibold text-3xl mt-6">Message sent</h2>
                <p className="text-inkmute text-[15px] leading-relaxed mt-3 max-w-md mx-auto">
                  Thank you for writing to us — we&rsquo;ll get back to you within one working day.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white border border-hairline p-8 lg:p-12">
                <h2 className="font-display font-semibold text-2xl mb-8">Send a message</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={label}>Your name *</label>
                    <input required value={form.name} onChange={set('name')} className={field} placeholder="Full name" />
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
                    <label className={label}>Subject</label>
                    <input value={form.subject} onChange={set('subject')} className={field} placeholder="Admissions, fees, transport…" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Message *</label>
                    <textarea required rows={5} value={form.message} onChange={set('message')} className={field} placeholder="How can we help?" />
                  </div>
                </div>
                {status === 'error' && (
                  <p className="text-crimson text-[14px] mt-6">
                    Something went wrong — please call us at +91 98765 43210 instead.
                  </p>
                )}
                <button type="submit" disabled={status === 'sending'} className="btn-crimson mt-8 disabled:opacity-60">
                  {status === 'sending' ? 'Sending…' : 'Send message'} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </FadeUp>

          <FadeUp delay={150} direction="right">
            <div className="border border-hairline bg-white p-2">
              <iframe
                title="Agram Open School on the map"
                src="https://www.google.com/maps?q=Surat,+Gujarat,+India&output=embed"
                className="w-full aspect-[4/3] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="bg-navy text-white p-8 mt-6">
              <h3 className="font-display font-semibold text-xl">Prefer to visit?</h3>
              <p className="text-white/70 text-[14.5px] leading-relaxed mt-2.5">
                The best way to understand a school is to walk through it on an ordinary morning. Call ahead and we&rsquo;ll arrange a walkthrough within the week.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  )
}
