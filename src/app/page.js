'use client'
import { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/firestore'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import AnnouncementLine from '@/components/AnnouncementLine'
import QuickLinksBar from '@/components/QuickLinksBar'
import AboutSection from '@/components/AboutSection'
import FocusAreas from '@/components/FocusAreas'
import LeadershipMessage from '@/components/LeadershipMessage'
import StatsSection from '@/components/StatsSection'
import AcademicsSection from '@/components/AcademicsSection'
import Gallery from '@/components/Gallery'
import NewsEventsSection from '@/components/NewsEventsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import AdmissionProcess from '@/components/AdmissionProcess'
import AdmissionsCTA from '@/components/AdmissionsCTA'
import Footer from '@/components/Footer'
import PopupNotice from '@/components/PopupNotice'

export default function HomePage() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    getSiteSettings().then(setSettings)
  }, [])

  // While settings are loading (settings === null) default every section to
  // visible; once loaded, an explicit `false` hides that section.
  const show = (key) => settings?.[key] !== false

  return (
    <main>
      <Navbar />
      {show('showAnnouncementTicker') && <AnnouncementLine />}
      {show('showBannerSlider') && <HeroSection />}
      {show('showQuickLinks') && <QuickLinksBar />}
      <AboutSection />
      <FocusAreas />
      <LeadershipMessage />
      {show('showStatsSection') && <StatsSection />}
      <AcademicsSection />
      <Gallery />
      {(show('showNewsSection') || show('showEventsSection')) && (
        <NewsEventsSection showNews={show('showNewsSection')} showEvents={show('showEventsSection')} />
      )}
      {show('showTestimonialsSection') && <TestimonialsSection />}
      <AdmissionProcess />
      <AdmissionsCTA />
      <Footer />
      <PopupNotice />
    </main>
  )
}
