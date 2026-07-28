'use client'
import { useEffect, useState } from 'react'
import { MapPin, Clock } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'

const day = (d) => (d ? new Date(d).getDate() : '--')
const mon = (d) => (d ? new Date(d).toLocaleString('default', { month: 'short' }) : '')
const year = (d) => (d ? new Date(d).getFullYear() : '')

function EventRow({ e, i, past = false }) {
  return (
    <FadeUp delay={(i % 4) * 100} direction={past ? 'up' : 'right'}>
      <div className={`flex gap-6 py-7 border-b border-hairline items-start ${past ? 'opacity-60' : ''}`}>
        <div className={`shrink-0 w-[72px] text-center py-3 ${past ? 'bg-hairline text-inkmute' : 'bg-gold-light text-navy'}`}>
          <p className="font-display text-[30px] font-bold leading-none">{day(e.date)}</p>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] mt-1">{mon(e.date)} {year(e.date)}</p>
        </div>
        <div className="min-w-0 pt-1">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-crimson mb-1.5">{e.category || 'Event'}</p>
          <h3 className="font-display font-semibold text-xl leading-snug">{e.title}</h3>
          {e.description && <p className="text-inkmute text-[14.5px] leading-relaxed mt-2 max-w-2xl">{e.description}</p>}
          <div className="flex flex-wrap gap-5 mt-3">
            {e.venue && (
              <p className="text-inkmute text-[13px] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold-dark" /> {e.venue}
              </p>
            )}
            {e.time && (
              <p className="text-inkmute text-[13px] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gold-dark" /> {e.time}
              </p>
            )}
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

export default function EventsClient() {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    getCollection('events', { orderByField: 'date', orderDir: 'asc' })
      .then(data => setEvents(data.filter(isVisible)))
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = (events || []).filter(e => !e.date || e.date >= today)
  const past = (events || []).filter(e => e.date && e.date < today).reverse()

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Events"
        eyebrow="The school calendar"
        title="Coming"
        accent="up."
        sub="Sports days, exhibitions, celebrations and everything in between."
        watermark="Events"
      />

      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          {events === null ? (
            <p className="text-inkmute text-sm">Loading events…</p>
          ) : (
            <>
              <FadeUp direction="down">
                <p className="eyebrow mb-4">Upcoming</p>
              </FadeUp>
              <div className="border-t-2 border-ink">
                {upcoming.length === 0 && (
                  <p className="text-inkmute text-sm py-8">No upcoming events right now — check back soon.</p>
                )}
                {upcoming.map((e, i) => <EventRow key={e.id} e={e} i={i} />)}
              </div>

              {past.length > 0 && (
                <div className="mt-20">
                  <FadeUp direction="down">
                    <p className="eyebrow mb-4">Recently concluded</p>
                  </FadeUp>
                  <div className="border-t border-hairline">
                    {past.slice(0, 6).map((e, i) => <EventRow key={e.id} e={e} i={i} past />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
