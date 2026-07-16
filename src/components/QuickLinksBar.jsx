'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { getCollection, isVisible } from '@/lib/firestore'
import FadeUp from './FadeUp'

const FALLBACK_LINKS = [
  { label: 'Admissions', url: '/admissions', icon: 'ClipboardList' },
  { label: 'Academics', url: '/academics', icon: 'GraduationCap' },
  { label: 'Calendar', url: '/academics/calendar', icon: 'Calendar' },
  { label: 'Faculty', url: '/academics/faculty', icon: 'Users' },
  { label: 'Gallery', url: '/gallery', icon: 'Images' },
  { label: 'Sports', url: '/student-life/sports', icon: 'Trophy' },
  { label: 'Infrastructure', url: '/about/infrastructure', icon: 'Building2' },
  { label: 'Contact', url: '/contact', icon: 'Phone' },
]

export default function QuickLinksBar() {
  const [links, setLinks] = useState(FALLBACK_LINKS)

  useEffect(() => {
    getCollection('quick_links', { orderByField: 'order', orderDir: 'asc' }).then(data => {
      const visible = data.filter(isVisible)
      if (visible.length > 0) setLinks(visible)
    })
  }, [])

  return (
    <section className="bg-white hairline-b">
      <div className="max-w-grid mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 border-l border-t border-hairline">
          {links.map((link, i) => {
            const Icon = LucideIcons[link.icon] || LucideIcons.Link2
            return (
              <FadeUp key={link.id || link.label} delay={i * 50} direction="up">
                <Link href={link.url}
                  className="group flex flex-col items-center gap-3 text-center border-r border-b border-hairline px-3 py-7 transition-colors duration-[360ms] hover:border-crimson hover:bg-cream">
                  <Icon className="h-6 w-6 text-ink transition-all duration-[360ms] group-hover:text-crimson group-hover:-translate-y-0.5" />
                  <span className="text-[12.5px] font-medium text-ink group-hover:text-crimson transition-colors leading-tight">
                    {link.label}
                  </span>
                </Link>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
