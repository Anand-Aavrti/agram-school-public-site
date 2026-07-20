'use client'
import { useEffect, useState } from 'react'
import { FileDown, FolderOpen, Landmark, ShieldCheck, Hash } from 'lucide-react'
import { getCollection } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'

// Static — affiliation facts have no admin editing surface.
const AFFILIATION = [
  { icon: Landmark, label: 'Trust', value: 'Agram Charitable Trust' },
  { icon: ShieldCheck, label: 'Accreditation', value: 'NIOS — National Institute of Open Schooling' },
  { icon: Hash, label: 'School code', value: 'AAO04028 (Open Basic Education)' },
]

export default function DisclosurePage() {
  const [docs, setDocs] = useState(null)

  useEffect(() => {
    // No `active` gate on mandatory_disclosure — everything uploaded is public.
    getCollection('mandatory_disclosure', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(setDocs)
  }, [])

  // Group by category, newest first within each (already sorted desc).
  const groups = (docs || []).reduce((acc, d) => {
    const key = d.categoryLabel || d.category || 'General'
    ;(acc[key] = acc[key] || []).push(d)
    return acc
  }, {})

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Mandatory disclosure"
        eyebrow="Regulatory compliance"
        title="Mandatory"
        accent="disclosure."
        sub="Affiliation, safety and statutory documents — published as required by NIOS."
        watermark="NIOS"
      />

      <section className="py-16 lg:py-20 bg-white hairline-b">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-3 border-t border-l border-hairline">
            {AFFILIATION.map((a, i) => (
              <FadeUp key={a.label} delay={i * 100} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="flex items-center gap-4 p-7 border-r border-b border-hairline h-full">
                  <div className="h-11 w-11 border border-gold/40 text-gold-dark flex items-center justify-center shrink-0">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-inkmute">{a.label}</p>
                    <p className="font-display font-semibold text-[15.5px] text-ink leading-snug mt-1">{a.value}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          {docs === null ? (
            <p className="text-inkmute text-sm">Loading documents…</p>
          ) : docs.length === 0 ? (
            <p className="text-inkmute text-sm">Documents will be published here shortly.</p>
          ) : (
            <div className="space-y-14">
              {Object.entries(groups).map(([category, items], gi) => (
                <div key={category}>
                  <FadeUp direction="down">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-ink mb-2">
                      <FolderOpen className="h-5 w-5 text-crimson" />
                      <h2 className="font-display font-semibold text-2xl">{category}</h2>
                    </div>
                  </FadeUp>
                  {items.map((d, i) => (
                    <FadeUp key={d.id} delay={(i % 5) * 80} direction="up">
                      <a href={d.url} target="_blank" rel="noreferrer"
                        className="group flex items-center gap-4 py-4.5 py-4 border-b border-hairline hover:border-crimson transition-colors">
                        <FileDown className="h-5 w-5 text-gold-dark group-hover:text-crimson transition-colors shrink-0" />
                        <span className="text-[15px] font-medium text-ink group-hover:text-crimson transition-colors">
                          {d.fileName || 'Document'}
                        </span>
                        <span className="ml-auto text-[12.5px] text-inkmute shrink-0">View / download</span>
                      </a>
                    </FadeUp>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
