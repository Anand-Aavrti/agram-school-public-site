import { Fraunces, Instrument_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { getGlobalSeo, SITE_DEFAULT_TITLE, SITE_DEFAULT_DESCRIPTION } from '@/lib/seo'

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

export async function generateMetadata() {
  const seo = await getGlobalSeo()
  return {
    title: seo.defaultTitle || SITE_DEFAULT_TITLE,
    description: seo.defaultDescription || SITE_DEFAULT_DESCRIPTION,
    keywords: 'Agram Open School, NIOS school Surat, open schooling Surat, best school Surat, admissions 2026',
    ...(seo.googleSiteVerification ? { verification: { google: seo.googleSiteVerification } } : {}),
    openGraph: {
      title: seo.siteName || seo.defaultTitle || SITE_DEFAULT_TITLE,
      description: seo.defaultDescription || SITE_DEFAULT_DESCRIPTION,
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
  }
}

export default async function RootLayout({ children }) {
  const seo = await getGlobalSeo()

  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body className="antialiased">
        {children}
        {seo.googleAnalyticsId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.googleAnalyticsId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
