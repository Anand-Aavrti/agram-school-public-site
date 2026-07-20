'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, FileText, BadgeCheck } from 'lucide-react'
import { getCollection, getDocument, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import AdmissionProcess from '@/components/AdmissionProcess'
import Footer from '@/components/Footer'

const DOCUMENTS = [
  'Birth certificate (original + copy)',
  'Previous school report card',
  'Transfer certificate (Grade 2 and above)',
  'Aadhaar card of the child and parents',
  'Four passport-size photographs',
  'Address proof',
]

const ELIGIBILITY = [
  ['Kindergarten', '3.5+ years as on 1 June 2026'],
  ['Grade 1', '5.5+ years as on 1 June 2026'],
  ['Grades 2 – 9', 'Pass in previous grade + interaction'],
  ['Grade 11', 'Grade 10 board results + counselling'],
]

const FALLBACK_FAQS = [
  { q: 'When do admissions open for 2026–27?', a: 'Registrations are open now. Seats are offered in order of registration and interaction, and most grades fill by February — we encourage applying early.' },
  { q: 'Is there an entrance test?', a: 'For KG to Grade 5 there is no written test — only a friendly interaction with the child and parents. Grades 6 and above have a short readiness assessment in English and mathematics.' },
  { q: 'What is the fee structure?', a: 'Fees vary by grade and are shared transparently during your campus visit or on enquiry — with no hidden charges through the year. Sibling concessions are available.' },
  { q: 'Do you provide transport?', a: 'Yes — GPS-tracked buses with trained attendants cover all major areas of Surat. Routes and charges are confirmed at admission.' },
  { q: 'Can we visit before applying?', a: 'Please do. We prefer families to see the school on an ordinary working day — call the front office and we will arrange a walkthrough within the week.' },
]

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-hairline">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group cursor-pointer">
        <h3 className={`font-display font-semibold text-lg lg:text-xl transition-colors ${open ? 'text-crimson' : 'text-ink group-hover:text-crimson'}`}>
          {q}
        </h3>
        <span className={`shrink-0 w-9 h-9 border flex items-center justify-center transition-all duration-400 ${
          open ? 'border-crimson text-crimson rotate-45' : 'border-hairline text-inkmute'
        }`}>
          <Plus className="h-4 w-4" />
        </span>
      </button>
      <div className={`grid transition-all duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-inkmute text-[15px] leading-relaxed max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  )
}

const money = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? `₹${n.toLocaleString('en-IN')}` : '—'
}

export default function AdmissionsPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const [faqs, setFaqs] = useState([])
  const [fees, setFees] = useState([])
  const [feeNote, setFeeNote] = useState(null)

  useEffect(() => {
    // Admin-managed FAQs (drag-ordered) and fee disclosure.
    getCollection('faqs', { orderByField: 'order', orderDir: 'asc' })
      .then(data => setFaqs(data.filter(isVisible)))
    getCollection('fee_structure', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setFees(data.filter(isVisible)))
    getDocument('site_settings', 'fee_note').then(setFeeNote)
  }, [])

  const faqList = faqs.length
    ? faqs.map(f => ({ q: f.question, a: f.answer }))
    : FALLBACK_FAQS

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Admissions"
        eyebrow="Admissions 2026–27"
        title="Begin the"
        accent="journey."
        sub="A simple, transparent process — and a front office that actually picks up the phone."
        watermark="Join"
      />

      <AdmissionProcess />

      {/* Eligibility + documents */}
      <section className="py-20 lg:py-28 bg-cream hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14">
          <FadeUp direction="left">
            <div className="flex items-center gap-2.5">
              <BadgeCheck className="h-5 w-5 text-crimson" />
              <p className="eyebrow !text-ink">Age &amp; eligibility</p>
            </div>
            <h2 className="font-display font-semibold text-3xl leading-tight mt-4">
              Who can <em className="italic font-medium text-crimson">apply</em>
            </h2>
            <div className="mt-8 border-t border-ink/15">
              {ELIGIBILITY.map(([grade, rule]) => (
                <div key={grade} className="flex justify-between gap-6 py-4.5 border-b border-ink/10 py-4">
                  <p className="font-display font-semibold text-[17px]">{grade}</p>
                  <p className="text-inkmute text-[14.5px] text-right">{rule}</p>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={140} direction="right">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-crimson" />
              <p className="eyebrow !text-ink">Documents required</p>
            </div>
            <h2 className="font-display font-semibold text-3xl leading-tight mt-4">
              Keep these <em className="italic font-medium text-crimson">ready</em>
            </h2>
            <ul className="mt-8 space-y-3.5">
              {DOCUMENTS.map(d => (
                <li key={d} className="flex items-start gap-3 text-[15px] text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Fee structure — from the admin panel */}
      <section id="fees" className="py-20 lg:py-28 bg-white hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <FadeUp direction="down" className="max-w-xl mb-12">
            <p className="eyebrow">Transparent by default</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Fee <em className="italic font-medium text-crimson">structure</em>
            </h2>
          </FadeUp>
          {fees.length === 0 ? (
            <FadeUp direction="up">
              <div className="bg-cream border border-hairline p-8 max-w-2xl">
                <p className="text-inkmute text-[15px] leading-relaxed">
                  The detailed fee schedule for the coming academic year is shared on enquiry and during campus visits — no hidden charges through the year, and sibling concessions available.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 mt-4 text-crimson text-[14px] font-semibold link-quiet">
                  Request the fee schedule <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeUp>
          ) : (
            <FadeUp direction="up">
              <div className="overflow-x-auto border border-hairline">
                <table className="w-full text-left min-w-[720px]">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em]">Class</th>
                      <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em]">Year</th>
                      <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em] text-right">Tuition</th>
                      <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em] text-right">Admission</th>
                      <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em] text-right">Annual charges</th>
                      <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-[0.1em] text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f, i) => (
                      <tr key={f.id} className={`border-t border-hairline ${i % 2 === 1 ? 'bg-cream/60' : 'bg-white'} hover:bg-gold-light/30 transition-colors`}>
                        <td className="px-5 py-4 font-display font-semibold text-[15.5px]">
                          {f.className}{f.stream ? ` — ${f.stream}` : ''}
                        </td>
                        <td className="px-5 py-4 text-inkmute text-[14px]">{f.academicYear}</td>
                        <td className="px-5 py-4 text-[14.5px] text-right tabular-nums">{money(f.tuitionFee)}</td>
                        <td className="px-5 py-4 text-[14.5px] text-right tabular-nums">{money(f.admissionFee)}</td>
                        <td className="px-5 py-4 text-[14.5px] text-right tabular-nums">{money(f.annualCharges)}</td>
                        <td className="px-5 py-4 font-semibold text-crimson text-[15px] text-right tabular-nums">{money(f.totalFee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {feeNote?.note && (
                <p className="text-inkmute text-[13.5px] leading-relaxed mt-5 max-w-3xl">{feeNote.note}</p>
              )}
            </FadeUp>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 lg:py-28 bg-white hairline-t">
        <div className="max-w-grid mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12">
          <FadeUp direction="left" className="lg:col-span-4">
            <p className="eyebrow">Questions</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              Asked <em className="italic font-medium text-crimson">often</em>
            </h2>
            <p className="text-inkmute text-[15px] leading-relaxed mt-5 max-w-sm">
              Can&rsquo;t find your answer? Call the front office or write to us — we respond within one working day.
            </p>
            <Link href="/contact" className="btn-outline-ink mt-8">
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>
          <FadeUp delay={120} direction="blur" className="lg:col-span-8 border-t border-hairline">
            {faqList.map((f, i) => (
              <FaqItem key={f.q} {...f} open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </FadeUp>
        </div>
      </section>

      {/* Apply band */}
      <section className="bg-crimson">
        <div className="max-w-grid mx-auto px-6 lg:px-12 py-16 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <FadeUp direction="left">
            <h2 className="font-display font-semibold text-white text-3xl lg:text-[40px] leading-tight">
              Ready when <em className="italic font-medium text-gold-light">you</em> are.
            </h2>
            <p className="text-white/70 text-[15px] mt-3 max-w-xl">
              The application takes under ten minutes. Our admissions team will call you back within one working day.
            </p>
          </FadeUp>
          <FadeUp delay={150} direction="right">
            <Link href="/admissions/apply" className="btn-gold whitespace-nowrap">
              Start your application <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  )
}
