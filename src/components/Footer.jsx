'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getSiteSettings } from '@/lib/firestore'

const SocialIcon = ({ path, className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d={path} /></svg>
)

const SOCIAL_ICONS = {
  Facebook: 'M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.87.24-1.5 1.53-1.5H16.5V4.36c-.27-.036-1.2-.116-2.28-.116-2.26 0-3.8 1.38-3.8 3.92V10.5H8v3h2.42V21h3.08z',
  Instagram: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.86 1.02 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53C6.09.28 6.82.11 7.88.06 8.94.01 9.28 0 12 0zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.25A3.25 3.25 0 1 1 12 6.75a3.25 3.25 0 0 1 0 6.5zm5.2-8.7a1.17 1.17 0 1 1 0-2.33 1.17 1.17 0 0 1 0 2.33z',
  Youtube: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z',
}

const COLS = {
  School: [
    ['About', '/about'], ['Academics', '/academics'],
    ['Faculty', '/academics/faculty'], ['Infrastructure', '/about/infrastructure'],
  ],
  Admissions: [
    ['Process', '/admissions'], ['Fees', '/admissions/fees'],
    ['FAQs', '/admissions/faqs'], ['Apply', '/admissions/apply'],
  ],
  Community: [
    ['News', '/news'], ['Events', '/events'],
    ['Gallery', '/gallery'], ['Careers', '/careers'],
  ],
  Portals: [
    ['Parents', '/portal'], ['Students', '/portal'],
    ['Staff', '/portal'], ['Contact', '/contact'],
  ],
}

export default function Footer() {
  const [settings, setSettings] = useState(null)
  const [year] = useState(() => new Date().getFullYear())

  useEffect(() => { getSiteSettings().then(setSettings) }, [])

  const schoolName = settings?.schoolName || 'Agram Open School'
  const tagline = settings?.footerTagline || settings?.tagline || 'Swayam Tejasvi Bhava'

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-grid mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">

          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="" className="h-11 w-11 object-contain"
                onError={e => e.target.style.display = 'none'} />
              <div>
                <p className="font-display text-[20px] font-semibold leading-tight">{schoolName}</p>
                <p className="font-display italic text-gold text-[14px]">{tagline}</p>
              </div>
            </div>
            <p className="text-white/60 text-[14px] leading-relaxed mb-6 max-w-xs">
              A premier CBSE-affiliated school in Surat committed to nurturing excellence and shaping future leaders.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-[13.5px] text-white/70">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>Surat, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-3 text-[13.5px] text-white/70">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-[13.5px] text-white/70">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span>info@agramschool.edu.in</span>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              {Object.entries(SOCIAL_ICONS).map(([name, path]) => (
                <a key={name} href="#" target="_blank" rel="noreferrer"
                  className="w-10 h-10 border border-white/20 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-[240ms] hover:-translate-y-0.5">
                  <SocialIcon path={path} className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(COLS).map(([h, links]) => (
              <div key={h}>
                <p className="text-gold text-[12px] font-semibold uppercase tracking-[0.1em] mb-5">{h}</p>
                <ul className="space-y-3">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-[14px] text-white/65 hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-grid mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-white/40">
          <p>© {year} {schoolName}, Surat. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            <p>Designed &amp; developed by <span className="text-gold font-medium">Aavrti Technology</span></p>
          </div>
        </div>
      </div>
    </footer>
  )
}