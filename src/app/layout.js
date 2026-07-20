import { Fraunces, Instrument_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'Agram Open School — Swayam Tejasvi Bhava',
  description: 'Agram Open School, Surat — An NIOS-accredited open school committed to flexible, learner-centric education and holistic development. Admissions open for 2026-27.',
  keywords: 'Agram Open School, NIOS school Surat, open schooling Surat, best school Surat, admissions 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
