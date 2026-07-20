'use client'
import { useEffect, useState } from 'react'
import { Users, GraduationCap, CalendarClock, Scale } from 'lucide-react'
import { getSiteSettings } from '@/lib/firestore'
import FadeUp from './FadeUp'

export default function StatsSection() {
  const [d, setD] = useState(null)
  useEffect(() => { getSiteSettings().then(setD) }, [])

  const stats = [
    { icon: Users, n: d?.statsStudents || '1,200+', label: 'Students on roll' },
    { icon: GraduationCap, n: d?.statsTeachers || '80+', label: 'Faculty members' },
    { icon: CalendarClock, n: d?.statsYears || '10+', label: 'Years in Surat' },
    { icon: Scale, n: d?.statsAwards || '25+', label: 'Awards won' },
  ]

  return (
    <section className="bg-navy relative overflow-hidden">
      {/* <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} /> */}
      <div className="max-w-grid mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 120} direction="pop"
              className={`py-10 sm:py-16 lg:py-20 px-3 sm:px-2 min-w-0 ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-10' : ''} ${i % 2 === 1 ? 'max-lg:border-l max-lg:border-white/10 max-lg:pl-6' : ''}`}>
              <s.icon className="h-5 w-5 sm:h-7 sm:w-7 text-gold" />
              <p className="font-display font-semibold text-white text-2xl sm:text-4xl lg:text-[58px] leading-none tracking-[-0.01em] sm:tracking-[-0.02em] mt-3 sm:mt-5 truncate">{s.n}</p>
              <p className="text-white/60 text-[11px] sm:text-[13px] font-medium uppercase tracking-[0.08em] sm:tracking-[0.1em] mt-2 sm:mt-4">{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
