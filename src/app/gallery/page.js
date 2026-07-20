'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Images, PlayCircle } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import FadeUp from '@/components/FadeUp'
import AdmissionsCTA from '@/components/AdmissionsCTA'
import Footer from '@/components/Footer'

// Shown until the admin creates albums.
const FALLBACK_PHOTOS = [
  { url: '/banner1.jpeg', caption: 'Our campus', span: 'lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto' },
  { url: '/science.jpeg', caption: 'Science in action', span: 'aspect-square' },
  { url: '/banner3.jpeg', caption: 'Morning assembly', span: 'aspect-square' },
  { url: '/commerce.jpeg', caption: 'Commerce classroom', span: 'aspect-square' },
  { url: '/banner2.jpeg', caption: 'School spirit', span: 'lg:col-span-2 aspect-square lg:aspect-auto' },
]

export default function GalleryPage() {
  const [albums, setAlbums] = useState(null)
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [activeAlbum, setActiveAlbum] = useState(null)

  useEffect(() => {
    getCollection('gallery_albums', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setAlbums(data.filter(isVisible)))
    // Photos are fetched once and filtered client-side by albumId (per schema).
    getCollection('gallery_photos', { orderByField: 'createdAt', orderDir: 'asc' })
      .then(setPhotos)
    getCollection('videos', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setVideos(data.filter(isVisible)))
  }, [])

  const albumPhotos = (albumId) => photos.filter(p => p.albumId === albumId)
  const albumCover = (a) => a.coverUrl || albumPhotos(a.id)[0]?.url

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Gallery"
        eyebrow="Campus life"
        title="Life at"
        accent="Agram."
        sub="Ordinary school days, extraordinary moments."
        watermark="Gallery"
      />

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-grid mx-auto px-6 lg:px-12">

          {albums === null ? (
            <p className="text-inkmute text-sm">Loading gallery…</p>
          ) : activeAlbum ? (
            /* ── Inside an album ─────────────────────────── */
            <>
              <FadeUp direction="down" className="mb-10">
                <button onClick={() => setActiveAlbum(null)}
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-inkmute hover:text-crimson transition-colors cursor-pointer">
                  <ArrowLeft className="h-4 w-4" /> All albums
                </button>
                <h2 className="font-display font-semibold text-3xl lg:text-[38px] mt-4">{activeAlbum.name}</h2>
                {activeAlbum.description && (
                  <p className="text-inkmute text-[15px] mt-2 max-w-2xl">{activeAlbum.description}</p>
                )}
              </FadeUp>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {albumPhotos(activeAlbum.id).map((p, i) => (
                  <FadeUp key={p.id} delay={(i % 4) * 90} direction="zoom"
                    className="relative aspect-square overflow-hidden img-hover group border border-hairline">
                    <img src={p.url} alt={p.caption || activeAlbum.name} className="w-full h-full object-cover img-treat" />
                    {p.caption && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]" />
                        <p className="absolute bottom-4 left-4 right-4 text-white text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]">
                          {p.caption}
                        </p>
                      </>
                    )}
                  </FadeUp>
                ))}
                {albumPhotos(activeAlbum.id).length === 0 && (
                  <p className="text-inkmute text-sm col-span-full">No photos in this album yet.</p>
                )}
              </div>
            </>
          ) : albums.length > 0 ? (
            /* ── Album grid ─────────────────────────────── */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((a, i) => {
                const count = albumPhotos(a.id).length
                const cover = albumCover(a)
                return (
                  <FadeUp key={a.id} delay={(i % 3) * 110} direction="zoom">
                    <button onClick={() => setActiveAlbum(a)}
                      className="group block w-full text-left card card-hover border border-hairline overflow-hidden cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden img-hover bg-cream">
                        {cover ? (
                          <img src={cover} alt={a.name} className="w-full h-full object-cover img-treat" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Images className="h-10 w-10 text-hairline" />
                          </div>
                        )}
                        <span className="absolute bottom-4 right-4 badge bg-navy/85 text-white flex items-center gap-1.5">
                          <Images className="h-3.5 w-3.5" /> {count} photo{count === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-display font-semibold text-xl group-hover:text-crimson transition-colors">{a.name}</h3>
                        {a.description && (
                          <p className="text-inkmute text-[14px] leading-relaxed mt-1.5 line-clamp-2">{a.description}</p>
                        )}
                      </div>
                    </button>
                  </FadeUp>
                )
              })}
            </div>
          ) : (
            /* ── Fallback until albums exist ─────────────── */
            <div className="grid grid-cols-2 lg:grid-cols-4 grid-flow-row-dense gap-4 lg:gap-5 lg:auto-rows-[200px]">
              {FALLBACK_PHOTOS.map((p, i) => (
                <FadeUp key={p.url} delay={(i % 4) * 90} direction="zoom"
                  className={`${p.span} relative overflow-hidden img-hover group border border-hairline`}>
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover img-treat" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]" />
                  <p className="absolute bottom-4 left-4 text-white text-[13.5px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-[360ms]">
                    {p.caption}
                  </p>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Videos — admin `videos` collection (YouTube) */}
      {videos.length > 0 && (
        <section className="py-20 lg:py-28 bg-navy relative overflow-hidden">
          <span aria-hidden className="absolute -bottom-8 right-0 font-display italic font-semibold text-white/[0.04] text-[150px] lg:text-[210px] leading-none select-none pointer-events-none">
            Watch
          </span>
          <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
            <FadeUp direction="down" className="max-w-xl mb-14">
              <p className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-gold">
                <span className="w-[18px] h-[2px] bg-gold inline-block" />
                Videos
              </p>
              <h2 className="font-display font-semibold text-white text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5">
                Agram in <em className="italic font-medium text-gold">motion</em>
              </h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v, i) => (
                <FadeUp key={v.id} delay={(i % 3) * 110} direction="pop">
                  <a href={v.youtubeUrl} target="_blank" rel="noreferrer"
                    className="group block border border-white/10 hover:border-gold/50 transition-colors overflow-hidden">
                    <div className="relative aspect-video overflow-hidden bg-black/40">
                      {v.thumbnailUrl ? (
                        <img src={v.thumbnailUrl} alt={v.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-white/30" />
                        </div>
                      )}
                      <PlayCircle className="absolute inset-0 m-auto h-14 w-14 text-white drop-shadow-lg group-hover:text-gold group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-white text-[17px] leading-snug group-hover:text-gold transition-colors">{v.title}</h3>
                      {v.description && (
                        <p className="text-white/50 text-[13.5px] leading-relaxed mt-1.5 line-clamp-2">{v.description}</p>
                      )}
                    </div>
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      <AdmissionsCTA />
      <Footer />
    </main>
  )
}
