'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'

const NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
]

export default function NewsEventsSection({ showNews = true, showEvents = true }) {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (showNews) {
      getCollection('news', { orderByField: 'createdAt', orderDir: 'desc' })
        .then(data => setNews(data.filter(isVisible).slice(0, 4)))
    }
    if (showEvents) {
      const today = new Date().toISOString().slice(0, 10)
      getCollection('events', { orderByField: 'date', orderDir: 'asc' })
        .then(data => setEvents(data.filter(isVisible).filter(e => !e.date || e.date >= today).slice(0, 3)))
    }
  }, [showNews, showEvents])

  if (!showNews && !showEvents) return null

  return (
    <section className="py-24 lg:py-32 hairline-t">
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

        {showNews && (
          news.length === 0 ? (
            <p className="text-inkmute text-sm mb-4">News will appear here.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((n, i) => (
                <FadeUp key={n.id} delay={i * 80} direction="up">
                  <Link href={`/news/${n.id}`} className="group block card card-hover overflow-hidden border border-hairline h-full">
                    <div className="relative aspect-[4/3] overflow-hidden img-hover">
                      <img src={n.imageUrl || NEWS_IMAGES[i % NEWS_IMAGES.length]} alt=""
                        className="w-full h-full object-cover img-treat" />
                      <span className="absolute top-3 left-3 badge bg-crimson text-white">{n.category || 'News'}</span>
                    </div>
                    <div className="p-5">
                      <p className="text-[12.5px] text-inkmute font-medium">{n.publishDate || ''}</p>
                      <h3 className="font-display font-semibold text-lg leading-snug mt-2 group-hover:text-crimson transition-colors">
                        {n.title}
                      </h3>
                      <p className="text-inkmute text-[13.5px] leading-relaxed mt-2 line-clamp-2">{n.summary}</p>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          )
        )}

        {showEvents && (
          <div className={showNews ? 'mt-16' : ''}>
            <div className="flex items-baseline justify-between mb-6">
              <p className="eyebrow">Coming up</p>
              {!showNews && (
                <Link href="/events" className="link-quiet text-[14.5px] font-semibold flex items-center gap-2">
                  All events <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            {events.length === 0 ? (
              <p className="text-inkmute text-sm">No upcoming events.</p>
            ) : (
              <div className="grid sm:grid-cols-3 gap-6">
                {events.map((e, i) => (
                  <FadeUp key={e.id} delay={i * 80} direction="up">
                    <div className="card border border-hairline p-5 flex gap-4 h-full">
                      <div className="bg-gold-light text-navy px-3.5 py-2.5 text-center shrink-0 h-fit">
                        <p className="font-display text-xl font-bold leading-none">
                          {e.date ? new Date(e.date).getDate() : '--'}
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-wide mt-1">
                          {e.date ? new Date(e.date).toLocaleString('default', { month: 'short' }) : ''}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <span className="badge bg-navy/10 text-navy">{e.category || 'Event'}</span>
                        <h3 className="font-semibold text-ink text-[15px] leading-snug mt-2">{e.title}</h3>
                        {e.venue && (
                          <p className="text-inkmute text-[13px] mt-1.5 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> {e.venue}
                          </p>
                        )}
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
