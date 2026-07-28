import StudentLifeClient from './StudentLifeClient'
import { getPageMetadata, breadcrumbSchema, SITE_URL } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

export async function generateMetadata() {
  return getPageMetadata('/student-life', {
    fallbackTitle: 'Student Life — Sports, Arts & Houses | Agram Open School',
    fallbackDescription: 'Sports, arts, music, clubs and the four-house system at Agram Open School, Surat — the parts of school children remember longest.',
  })
}

// Static — ACTIVITIES has no admin editing surface (StudentLifeClient.jsx),
// mirrored here for the schema.
const ACTIVITIES = [
  { title: 'Sports', desc: 'Cricket, basketball, athletics and yoga with structured coaching and inter-house tournaments every term.' },
  { title: 'Art & craft', desc: 'A working studio where sketching, painting and craft are taught as skills — with an annual exhibition of student work.' },
  { title: 'Music & dance', desc: 'Vocal, instrumental and classical dance programmes, performed at every school gathering.' },
  { title: 'Debate & drama', desc: 'Elocution, debate and an annual production that puts every willing student on stage at least once.' },
  { title: 'Eco club', desc: 'A student-run garden, recycling drives and field trips that make environmental care a habit, not a lesson.' },
  { title: 'Clubs & olympiads', desc: 'Chess, robotics, mathematics and science olympiad circles for students who want to go deeper.' },
]

export default function Page() {
  const schema = [
    breadcrumbSchema([{ name: 'Student life', path: '/student-life' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${SITE_URL}/student-life#activities`,
      name: 'Student life at Agram Open School',
      itemListElement: ACTIVITIES.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.title,
        description: a.desc,
      })),
    },
  ]

  return (
    <>
      <JsonLd data={schema} />
      <StudentLifeClient />
    </>
  )
}
