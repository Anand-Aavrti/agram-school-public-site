'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Paperclip, Pin } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'

const FALLBACK_IMAGES = ['/banner1.jpeg', '/banner2.jpeg', '/banner3.jpeg', '/science.jpeg', '/commerce.jpeg']

export default function NewsPage() {
  const [news, setNews] = useState(null)
  const [notices, setNotices] = useState([])

  useEffect(() => {
    getCollection('news', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setNews(data.filter(isVisible)))
    // Official notices: hide once past expiryDate (per schema).
    const today = new Date().toISOString().slice(0, 10)
    getCollection('notices', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setNotices(
        data.filter(isVisible).filter(n => !n.expiryDate || n.expiryDate >= today).slice(0, 6)
      ))
  }, [])

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="News"
        eyebrow="Stay informed"
        title="From the"
        accent="school."
        sub="Announcements, achievements and everyday moments worth sharing."
        watermark="News"
      />

      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          {news === null ? (
            <p className="text-inkmute text-sm">Loading news…</p>
          ) : news.length === 0 ? (
            <p className="text-inkmute text-sm">News will appear here soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {news.map((n, i) => (
                <FadeUp key={n.id} delay={(i % 3) * 110} direction="up">
                  <Link href={`/news/${n.id}`} className="group block card card-hover overflow-hidden h-full">
                    <div className="relative aspect-[16/10] overflow-hidden img-hover">
                      <img src={n.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} alt=""
                        className="w-full h-full object-cover img-treat" />
                      <span className="absolute top-4 left-4 badge bg-crimson text-white">{n.category || 'News'}</span>
                    </div>
                    <div className="p-6">
                      <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-inkmute">{n.publishDate || ''}</p>
                      <h3 className="font-display font-semibold text-xl leading-snug mt-2.5 group-hover:text-crimson transition-colors">
                        {n.title}
                      </h3>
                      {n.summary && (
                        <p className="text-inkmute text-[14px] leading-relaxed mt-2.5 line-clamp-3">{n.summary}</p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-crimson text-[13.5px] font-semibold group-hover:gap-2.5 transition-all">
                        Read <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Official notice board — admin `notices` collection */}
      {notices.length > 0 && (
        <section className="py-20 lg:py-28 bg-white hairline-t">
          <div className="max-w-grid mx-auto px-6 lg:px-12">
            <FadeUp direction="down" className="max-w-xl mb-12">
              <p className="eyebrow">Notice board</p>
              <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
                Official <em className="italic font-medium text-crimson">notices</em>
              </h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-x-12 border-t-2 border-ink">
              {notices.map((n, i) => (
                <FadeUp key={n.id} delay={(i % 2) * 110} direction="up">
                  <div className="flex gap-5 py-7 border-b border-hairline items-start">
                    <span className={`shrink-0 mt-1 flex items-center justify-center w-9 h-9 ${
                      n.category === 'Urgent' ? 'bg-crimson text-white' : 'bg-gold-light text-navy'
                    }`}>
                      <Pin className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className={`text-[10.5px] font-bold tracking-[0.14em] uppercase ${
                          n.category === 'Urgent' ? 'text-crimson' : 'text-gold-dark'
                        }`}>
                          {n.category || 'General'}
                        </span>
                        {n.publishDate && <span className="text-[12px] text-inkmute">{n.publishDate}</span>}
                      </div>
                      <h3 className="font-display font-semibold text-[18px] leading-snug mt-1.5">{n.title}</h3>
                      {n.content && (
                        <p className="text-inkmute text-[14px] leading-relaxed mt-2 line-clamp-3">{n.content}</p>
                      )}
                      {n.attachmentUrl && (
                        <a href={n.attachmentUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-crimson text-[13px] font-semibold link-quiet">
                          <Paperclip className="h-3.5 w-3.5" /> View attachment
                        </a>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
