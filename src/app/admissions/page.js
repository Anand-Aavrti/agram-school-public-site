import AdmissionsClient from './AdmissionsClient'
import { getPageMetadata, breadcrumbSchema, getCollectionAtBuild, isVisible, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/admissions', {
    fallbackTitle: 'Admissions 2026–27 — Fees, Eligibility & FAQs | Agram Open School',
    fallbackDescription: 'Admissions open for 2026–27 at Agram Open School, Surat. Eligibility by grade, required documents, transparent fee structure and frequently asked questions.',
  })
}

// Mirrors AdmissionsClient.jsx's FALLBACK_FAQS — shown (and schema'd) only
// until the admin adds `faqs` entries.
const FALLBACK_FAQS = [
  { question: 'When do admissions open for 2026–27?', answer: 'Registrations are open now. Seats are offered in order of registration and interaction, and most grades fill by February — we encourage applying early.' },
  { question: 'Is there an entrance test?', answer: 'For KG to Grade 5 there is no written test — only a friendly interaction with the child and parents. Grades 6 and above have a short readiness assessment in English and mathematics.' },
  { question: 'What is the fee structure?', answer: 'Fees vary by grade and are shared transparently during your campus visit or on enquiry — with no hidden charges through the year. Sibling concessions are available.' },
  { question: 'Do you provide transport?', answer: 'Yes — GPS-tracked buses with trained attendants cover all major areas of Surat. Routes and charges are confirmed at admission.' },
  { question: 'Can we visit before applying?', answer: 'Please do. We prefer families to see the school on an ordinary working day — call the front office and we will arrange a walkthrough within the week.' },
]

export default async function Page() {
  const faqs = await getCollectionAtBuild('faqs', { orderByField: 'order', orderDir: 'asc' })
  const list = faqs.filter(isVisible).length
    ? faqs.filter(isVisible).map(f => ({ question: f.question, answer: f.answer }))
    : FALLBACK_FAQS

  const schema = [
    breadcrumbSchema([{ name: 'Admissions', path: '/admissions' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/admissions#faqs`,
      mainEntity: list.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <AdmissionsClient />
    </>
  )
}
