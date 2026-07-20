'use client'
import { useEffect, useState } from 'react'
import { Quote, Star } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    getCollection('testimonials', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setTestimonials(data.filter(isVisible).slice(0, 3)))
  }, [])

  if (!testimonials.length) return null

  return (
    <section className="py-24 lg:py-32 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-crimson/15 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

      <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
        <FadeUp direction="down" className="max-w-xl mb-14">
          <p className="eyebrow !text-gold">Voices of our community</p>
          <h2 className="font-display font-semibold text-4xl lg:text-[44px] leading-[1.14] tracking-[-0.01em] mt-5 text-white">
            What people <em className="italic font-medium text-gold">say</em>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeUp key={t.id} delay={i * 130} direction="pop" className="min-w-0">
              <div className="bg-white/[0.06] border border-white/10 p-7 backdrop-blur-sm hover:bg-white/[0.09] hover:border-gold/40 transition-colors h-full flex flex-col min-w-0">
                <Quote className="h-8 w-8 text-gold mb-4 opacity-80" />
                <p className="text-white/85 text-[15px] leading-relaxed flex-1 break-words">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-5 mt-6">
                  <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm shrink-0 overflow-hidden">
                    {t.photoUrl ? (
                      <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      t.name?.[0]?.toUpperCase() || 'G'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-[14px] truncate">{t.name}</p>
                    <p className="text-white/50 text-[12px] truncate">{[t.role, t.batch].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5 shrink-0">
                    {[...Array(t.rating || 5)].map((_, si) => (
                      <Star key={si} className="h-3.5 w-3.5 text-gold fill-gold" />
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
