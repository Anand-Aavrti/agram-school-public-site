'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, ChevronDown, Menu, X, Phone, Mail } from 'lucide-react'
import { getSiteSettings } from '@/lib/firestore'

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Student life', href: '/student-life' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
]

const PORTAL_LINKS = {
  Student: 'https://student.agramopenschool.com/',
  Parent: 'https://parent.agramopenschool.com/',
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState(null)
  const pathname = usePathname()

  // A section stays active on its sub-routes too (/news/xyz → News).
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    getSiteSettings().then(setSettings)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const schoolName = settings?.schoolName || 'Agram Open School'
  const tagline = settings?.tagline || 'Swayam Tejasvi Bhava'

  return (
    <>
      <div className="hidden md:block bg-navy text-white/80">
        <div className="max-w-grid mx-auto px-6 lg:px-12 flex items-center justify-between h-10 text-[13px]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gold" /> +91 98765 43210</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gold" /> agram.surat@gmail.com</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                Parent / Student Portal <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="absolute left-0 top-full pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-[60]">
                <div className="bg-white text-ink shadow-lg border border-hairline min-w-[150px] py-1.5">
                  {Object.entries(PORTAL_LINKS).map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer"
                      className="block px-4 py-2 text-[13.5px] font-medium hover:bg-cream hover:text-crimson transition-colors">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-[0_4px_24px_-8px_rgba(33,28,22,0.15)]' : 'hairline-b'}`}>
        <div className="max-w-grid mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 min-w-0">
              <img src="/logo.png" alt="" className="h-12 w-12 object-contain shrink-0"
                onError={e => e.target.style.display = 'none'} />
              <div className="leading-none min-w-0">
                <span className="font-display text-[18px] sm:text-[20px] font-semibold block text-ink truncate">{schoolName}</span>
                <span className="text-[11px] tracking-[0.04em] italic text-gold font-medium block truncate">{tagline}</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map(n => (
                <Link key={n.href} href={n.href}
                  className={`link-quiet text-[14.5px] font-medium ${
                    isActive(n.href) ? 'link-active text-crimson' : 'text-ink'
                  }`}>
                  {n.label}
                </Link>
              ))}
              <Link href="/admissions/apply" className="btn-crimson !py-3 !px-6 text-[13.5px]">
                Apply Now <ArrowUpRight className="h-4 w-4" />
              </Link>
            </nav>

            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-ink shrink-0" aria-label="Menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden bg-white hairline-t max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-6 py-8 space-y-5">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 font-display text-2xl font-medium ${
                    isActive(n.href) ? 'text-crimson' : 'text-ink'
                  }`}>
                  {isActive(n.href) && <span className="w-5 h-[2px] bg-crimson inline-block" />}
                  {n.label}
                </Link>
              ))}
              <div className="pt-5 hairline-t flex flex-col gap-4">
                <span className="flex items-center gap-2 text-inkmute text-[13.5px]"><Phone className="h-4 w-4 text-crimson" /> +91 98765 43210</span>
                <span className="flex items-center gap-2 text-inkmute text-[13.5px]"><Mail className="h-4 w-4 text-crimson" /> agram.surat@gmail.com</span>
                <div className="flex flex-col gap-2">
                  <span className="text-inkmute text-[11px] font-semibold uppercase tracking-[0.08em]">Portal</span>
                  {Object.entries(PORTAL_LINKS).map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer"
                      onClick={() => setOpen(false)} className="text-inkmute text-sm font-medium">
                      {label} portal
                    </a>
                  ))}
                </div>
                <Link href="/admissions/apply" onClick={() => setOpen(false)} className="btn-crimson w-fit">Apply Now <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
