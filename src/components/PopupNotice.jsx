'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { getDocument, isVisible } from '@/lib/firestore'

const SEEN_KEY = 'agram_popup_seen'

// Admin-controlled popup (site_settings/popup_notice). Off by default;
// honors showOnce via localStorage per the schema.
export default function PopupNotice() {
  const [notice, setNotice] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getDocument('site_settings', 'popup_notice').then(doc => {
      if (!doc || doc.active !== true) return
      if (doc.showOnce && typeof window !== 'undefined' && localStorage.getItem(SEEN_KEY)) return
      setNotice(doc)
      const t = setTimeout(() => setOpen(true), 1200)
      return () => clearTimeout(t)
    })
  }, [])

  const dismiss = () => {
    setOpen(false)
    if (notice?.showOnce) localStorage.setItem(SEEN_KEY, '1')
  }

  if (!notice || !isVisible(notice)) return null

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-opacity duration-500 ${
      open ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={dismiss} />
      <div className={`relative bg-white max-w-md w-full shadow-2xl transition-transform duration-500 ${
        open ? 'scale-100' : 'scale-90'
      }`}>
        <button onClick={dismiss} aria-label="Close notice"
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 hover:bg-crimson hover:text-white flex items-center justify-center transition-colors cursor-pointer">
          <X className="h-4 w-4" />
        </button>
        {notice.imageUrl && (
          <img src={notice.imageUrl} alt="" className="w-full aspect-[16/9] object-cover" />
        )}
        <div className="p-8">
          <p className="eyebrow">Notice</p>
          <h3 className="font-display font-semibold text-2xl mt-3">{notice.title}</h3>
          {notice.body && (
            <p className="text-inkmute text-[14.5px] leading-relaxed mt-3">{notice.body}</p>
          )}
          {notice.buttonLabel && notice.buttonLink && (
            <Link href={notice.buttonLink} onClick={dismiss} className="btn-crimson mt-6 !py-3 !px-6 text-[14px]">
              {notice.buttonLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
