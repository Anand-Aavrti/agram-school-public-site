'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getSiteSettings } from '@/lib/firestore'
import { ADDRESS_LINE1, ADDRESS_LINE2, SCHOOL_CITY, SCHOOL_NAME, TRUST_NAME } from '@/lib/branding'

const SocialIcon = ({ path, className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d={path} /></svg>
)

const SOCIAL_ICONS = {
  Facebook: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 1.878-.287 1.789h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  Instagram: 'M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 1 0-2.881.001 1.441 1.441 0 0 0 2.881-.001z',
  X: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-2.323 17.52h1.833L7.084 4.126H5.117z',
  Youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
}

// Real brand colors so the icons read as the actual platforms, not flat outlines.
const SOCIAL_STYLE = {
  Facebook: 'bg-[#1877F2] hover:bg-[#0d5dc7]',
  Instagram: 'bg-gradient-to-br from-[#4f5bd5] via-[#c13584] to-[#f5a04d] hover:brightness-110',
  X: 'bg-black hover:bg-white hover:text-black',
  Youtube: 'bg-[#FF0000] hover:bg-[#cc0000]',
}

// Maps each icon above to the matching field saved by the admin panel's
// Homepage Settings → Social Media Links card (same site_settings/homepage
// document this component already reads below).
const SOCIAL_LINK_KEYS = { Facebook: 'facebook', Instagram: 'instagram', X: 'x', Youtube: 'youtube' }

// Client-provided handles, used until the admin panel's own values are set.
const FALLBACK_SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  youtube: 'https://www.youtube.com/',
}

const COLS = {
  School: [
    ['About', '/about'], ['Academics', '/academics'],
    ['Faculty', '/academics#faculty'], ['Infrastructure', '/about#infrastructure'],
  ],
  Admissions: [
    ['Process', '/admissions'], ['Fees', '/admissions#fees'],
    ['FAQs', '/admissions#faqs'], ['Apply', '/admissions/apply'],
  ],
  Community: [
    ['News', '/news'], ['Events', '/events'],
    ['Gallery', '/gallery'], ['Careers', '/careers'],
  ],
  More: [
    ['Portal', '/portal'], ['Contact', '/contact'],
    ['Mandatory disclosure', '/disclosure'],
  ],
}

export default function Footer() {
  const [settings, setSettings] = useState(null)
  const [year] = useState(() => new Date().getFullYear())

  useEffect(() => { getSiteSettings().then(setSettings) }, [])

  const schoolName = settings?.schoolName || `${SCHOOL_NAME}`
  const tagline = settings?.footerTagline || settings?.tagline || 'Learning for life'

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
              A co-educational day school managed by {TRUST_NAME} — nurturing curious, confident learners.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-[13.5px] text-white/70">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>{ADDRESS_LINE1}<br />{ADDRESS_LINE2}</span>
              </div>
              <div className="flex items-center gap-3 text-[13.5px] text-white/70">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-[13.5px] text-white/70">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span>hello@demoschool.example</span>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              {Object.entries(SOCIAL_ICONS)
                .map(([name, path]) => [name, path, settings?.socialLinks?.[SOCIAL_LINK_KEYS[name]] || FALLBACK_SOCIAL_LINKS[SOCIAL_LINK_KEYS[name]]])
                .filter(([, , url]) => url)
                .map(([name, path, url]) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name}
                    className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md transition-all duration-[240ms] hover:-translate-y-1 hover:shadow-lg ${SOCIAL_STYLE[name]}`}>
                    <SocialIcon path={path} className="h-[18px] w-[18px]" />
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
          <p>© {year} {schoolName}, {SCHOOL_CITY}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            <p>Designed &amp; developed by <span className="text-gold font-medium">Aavrti Technology</span></p>
          </div>
        </div>
      </div>
    </footer>
  )
}