'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MapPin, CalendarDays } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'

const NEWS_IMAGES = ['/banner1.jpeg', '/banner2.jpeg', '/banner3.jpeg', '/science.jpeg']
const ROTATE_MS = 5000

const day = (d) => (d ? new Date(d).getDate() : '--')
const mon = (d) => (d ? new Date(d).toLocaleString('default', { month: 'short' }) : '')

export default function NewsEventsSection({ showNews = true, showEvents = true }) {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (showNews) {
      getCollection('news', { orderByField: 'createdAt', orderDir: 'desc' })
        .then(data => setNews(data.filter(isVisible).slice(0, 4)))
    }
    if (showEvents) {
      const today = new Date().toISOString().slice(0, 10)
      getCollection('events', { orderByField: 'date', orderDir: 'asc' })
        .then(data => setEvents(data.filter(isVisible).filter(e => !e.date || e.date >= today).slice(0, 4)))
    }
  }, [showNews, showEvents])

  // Auto-rotate the spotlight story; pause while the visitor hovers it.
  useEffect(() => {
    if (paused || news.length < 2) return
    const t = setInterval(() => setActive(a => (a + 1) % news.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, news.length])

  if (!showNews && !showEvents) return null

  const story = news[active]

  return (
    <section className="py-24 lg:py-32 hairline-t bg-cream">
      <div className="max-w-grid mx-auto px-6 lg:px-12">

        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <FadeUp direction="down" className="max-w-xl">
            <p className="eyebrow">Stay informed</p>
            <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
              From the <em className="italic font-medium text-crimson">school</em>
            </h2>
          </FadeUp>
          {showNews && (
            <Link href="/news" className="link-quiet text-[14.5px] font-semibold flex items-center gap-2">
              All news <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Rotating spotlight story — full-bleed photo, text pops over it */}
          {showNews && (
            <FadeUp direction="zoom" className={showEvents ? 'lg:col-span-8' : 'lg:col-span-12'}>
              {news.length === 0 ? (
                <div className="aspect-[16/9] border border-hairline bg-white flex items-center justify-center">
                  <p className="text-inkmute text-sm">News will appear here.</p>
                </div>
              ) : (
                <div
                  className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden group"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  {/* Photo layers */}
                  {news.map((n, i) => (
                    <img key={n.id} src={n.imageUrl || NEWS_IMAGES[i % NEWS_IMAGES.length]} alt=""
                      className={`absolute inset-0 w-full h-full object-cover img-treat transition-all duration-[1200ms] ease-out ${
                        i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`} />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />

                  {/* Story text — remounts on each change so it pops up fresh */}
                  {story && (
                    <div key={story.id} className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 spotlight-pop">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="badge bg-crimson text-white">{story.category || 'News'}</span>
                        {story.publishDate && (
                          <span className="text-white/70 text-[12px] font-semibold tracking-[0.12em] uppercase">
                            {story.publishDate}
                          </span>
                        )}
                      </div>
                      <Link href={`/news/${story.id}`} className="block group/title">
                        <h3 className="font-display font-semibold text-white text-2xl sm:text-4xl leading-[1.15] max-w-2xl group-hover/title:text-gold transition-colors duration-300">
                          {story.title}
                        </h3>
                      </Link>
                      {story.summary && (
                        <p className="text-white/70 text-[14.5px] leading-relaxed mt-3 max-w-xl line-clamp-2 hidden sm:block">
                          {story.summary}
                        </p>
                      )}
                      <Link href={`/news/${story.id}`}
                        className="inline-flex items-center gap-2 mt-5 text-gold text-[13.5px] font-semibold hover:gap-3.5 transition-all">
                        Read more <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Controls */}
                  {news.length > 1 && (
                    <>
                      <div className="absolute top-5 right-5 sm:top-6 sm:right-8 text-white/50 font-display text-[13px] tabular-nums">
                        {String(active + 1).padStart(2, '0')} / {String(news.length).padStart(2, '0')}
                      </div>
                      <div className="absolute top-5 left-5 sm:top-6 sm:left-8 flex gap-2">
                        {news.map((_, i) => (
                          <button key={i} onClick={() => setActive(i)} aria-label={`Story ${i + 1}`}
                            className={`h-[3px] rounded-full transition-all duration-400 cursor-pointer ${
                              i === active ? 'w-8 bg-gold' : 'w-4 bg-white/40 hover:bg-white/70'
                            }`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </FadeUp>
          )}

          {/* Coming up — gold date chips */}
          {showEvents && (
            <div className={showNews ? 'lg:col-span-4' : 'lg:col-span-12'}>
              <FadeUp direction="right">
                <div className="flex items-center justify-between mb-2 pb-4 border-b-2 border-ink">
                  <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] uppercase text-ink">
                    <CalendarDays className="h-4 w-4 text-crimson" /> Coming up
                  </p>
                  <Link href="/events" className="text-[13px] font-semibold text-inkmute hover:text-crimson transition-colors">
                    All events
                  </Link>
                </div>
              </FadeUp>
              {events.length === 0 ? (
                <FadeUp direction="right" delay={100}>
                  <p className="text-inkmute text-sm mt-4">No upcoming events.</p>
                </FadeUp>
              ) : (
                events.map((e, i) => (
                  <FadeUp key={e.id} delay={i * 130} direction="right">
                    <div className="group flex gap-4 py-5 border-b border-hairline items-center hover:border-gold transition-colors duration-300">
                      <div className="shrink-0 w-[52px] text-center bg-gold-light text-navy py-2.5 group-hover:bg-gold transition-colors duration-300">
                        <p className="font-display text-[22px] font-bold leading-none">{day(e.date)}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] mt-1">{mon(e.date)}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-crimson mb-1">
                          {e.category || 'Event'}
                        </p>
                        <h3 className="font-semibold text-ink text-[14.5px] leading-snug">{e.title}</h3>
                        {e.venue && (
                          <p className="text-inkmute text-[12.5px] mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" /> {e.venue}
                          </p>
                        )}
                      </div>
                    </div>
                  </FadeUp>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
