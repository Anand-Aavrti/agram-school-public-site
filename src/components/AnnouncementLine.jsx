'use client'
import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'

export default function AnnouncementLine() {
  const [items, setItems] = useState([])

  useEffect(() => {
    getCollection('ticker_announcements', { orderByField: 'createdAt', orderDir: 'desc' })
      .then(data => setItems(data.filter(isVisible)))
  }, [])

  if (!items.length) return null

  const text = items.map(a => a.text).join('     •     ')

  return (
    <div className="bg-crimson text-white overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 bg-navy text-white px-5 py-3 flex items-center gap-2 z-10">
          <Megaphone className="h-4 w-4 text-gold" />
          <span className="text-[12px] font-bold uppercase tracking-wider">Notice</span>
        </div>
        <div className="overflow-hidden flex-1 relative py-3">
          <div className="whitespace-nowrap animate-marquee inline-block text-[14px] font-medium pl-8">
            {text} &nbsp;&nbsp;&nbsp;&nbsp; {text}
          </div>
        </div>
      </div>
    </div>
  )
}
