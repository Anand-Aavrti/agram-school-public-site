'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getDocument, getCollection, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import FadeUp from '@/components/FadeUp'
import Footer from '@/components/Footer'

// initialArticle/initialMore come from the server (news/[id]/page.js), which
// already fetched this exact id at build time for a prebuilt static page —
// undefined means "not prebuilt, fetch client-side" (the /news/placeholder
// shell that firebase.json rewrites unknown ids to); null means "server
// looked it up and it doesn't exist / isn't visible".
export default function NewsArticleClient({ initialArticle, initialMore = [] }) {
  const { id } = useParams()
  const [article, setArticle] = useState(initialArticle) // undefined = loading, null = not found
  const [more, setMore] = useState(initialMore)

  useEffect(() => {
    if (initialArticle !== undefined) return
    if (!id) return
    getDocument('news', id).then(doc => setArticle(doc && isVisible(doc) ? doc : null))
    getCollection('news', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setMore(data.filter(isVisible).filter(n => n.id !== id).slice(0, 3)))
  }, [id, initialArticle])

  return (
    <main>
      <Navbar />

      {article === undefined && (
        <section className="py-32 text-center"><p className="text-inkmute text-sm">Loading…</p></section>
      )}

      {article === null && (
        <section className="py-32 text-center">
          <h1 className="font-display font-semibold text-3xl">Story not found</h1>
          <p className="text-inkmute text-[15px] mt-3">This article may have been removed.</p>
          <Link href="/news" className="btn-crimson mt-8 inline-flex">
            <ArrowLeft className="h-4 w-4" /> All news
          </Link>
        </section>
      )}

      {article && (
        <>
          <article>
            {/* Article header */}
            <header className="bg-navy relative overflow-hidden">
              <div className="max-w-grid mx-auto px-6 lg:px-12 py-16 lg:py-20 relative">
                <FadeUp direction="pop">
                  <Link href="/news" className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-[13.5px] font-medium transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> All news
                  </Link>
                  <div className="flex items-center gap-4 mb-5">
                    <span className="badge bg-crimson text-white">{article.category || 'News'}</span>
                    {article.publishDate && (
                      <span className="text-white/60 text-[13px] font-semibold tracking-[0.1em] uppercase">{article.publishDate}</span>
                    )}
                  </div>
                  <h1 className="font-display font-semibold text-white text-3xl sm:text-4xl lg:text-[52px] leading-[1.12] tracking-[-0.01em] max-w-4xl">
                    {article.title}
                  </h1>
                </FadeUp>
              </div>
            </header>

            {/* Body */}
            <div className="bg-white py-14 lg:py-20">
              <div className="max-w-4xl mx-auto px-6 lg:px-12">
                {article.imageUrl && (
                  <FadeUp direction="zoom">
                    <img src={article.imageUrl} alt=""
                      className="w-full aspect-[16/9] object-cover img-treat border border-hairline p-2 bg-white mb-12" />
                  </FadeUp>
                )}
                <FadeUp delay={100} direction="blur">
                  {article.summary && (
                    <p className="font-display italic text-xl lg:text-2xl leading-relaxed text-ink mb-8">
                      {article.summary}
                    </p>
                  )}
                  {article.content ? (
                    <div className="text-inkmute leading-[1.85] text-[16px] [&_p]:mb-5 [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-4"
                      dangerouslySetInnerHTML={{ __html: article.content }} />
                  ) : (
                    !article.summary && <p className="text-inkmute">Full story coming soon.</p>
                  )}
                </FadeUp>
              </div>
            </div>
          </article>

          {/* More stories */}
          {more.length > 0 && (
            <section className="py-16 lg:py-24 bg-cream hairline-t">
              <div className="max-w-grid mx-auto px-6 lg:px-12">
                <FadeUp direction="down">
                  <p className="eyebrow mb-10">More from the school</p>
                </FadeUp>
                <div className="grid sm:grid-cols-3 gap-6">
                  {more.map((n, i) => (
                    <FadeUp key={n.id} delay={i * 110} direction="up">
                      <Link href={`/news/${n.id}`} className="group block bg-white border border-hairline p-6 h-full card-hover card">
                        <p className="text-[11.5px] font-semibold tracking-[0.1em] uppercase text-gold-dark">{n.category || 'News'}</p>
                        <h3 className="font-display font-semibold text-lg leading-snug mt-2.5 group-hover:text-crimson transition-colors">
                          {n.title}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-crimson text-[13px] font-semibold">
                          Read <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </Link>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  )
}
