import { Fraunces, Instrument_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import {
  getGlobalSeo, SITE_URL, SITE_NAME, SITE_DEFAULT_TITLE, SITE_DEFAULT_DESCRIPTION,
  organizationSchema, websiteSchema,
} from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { SCHOOL_CITY, SCHOOL_NAME } from '@/lib/branding'

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
  const title = seo.defaultTitle || SITE_DEFAULT_TITLE
  const description = seo.defaultDescription || SITE_DEFAULT_DESCRIPTION
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: `${SCHOOL_NAME}, CBSE school, admissions, best school ${SCHOOL_CITY}, admissions 2026`,
    applicationName: seo.siteName || SITE_NAME,
    authors: [{ name: seo.siteName || SITE_NAME, url: SITE_URL }],
    alternates: { canonical: '/' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    manifest: '/manifest.json',
    icons: {
      icon: [{ url: '/icon.png', type: 'image/png' }],
      apple: [{ url: '/logo.png', type: 'image/png' }],
    },
    other: { 'msapplication-config': '/browserconfig.xml' },
    ...(seo.googleSiteVerification ? { verification: { google: seo.googleSiteVerification } } : {}),
    openGraph: {
      title: seo.siteName || title,
      description,
      url: '/',
      siteName: seo.siteName || SITE_NAME,
      type: 'website',
      locale: 'en_IN',
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: {
      card: seo.ogImage ? 'summary_large_image' : 'summary',
      title: seo.siteName || title,
      description,
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
  }
}

export default async function RootLayout({ children }) {
  const seo = await getGlobalSeo()

  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body className="antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
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
