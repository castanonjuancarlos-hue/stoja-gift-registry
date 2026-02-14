import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { HowItWorks } from '@/components/HowItWorks'
import { CreateGiftTable } from '@/components/CreateGiftTable'
import { PaymentOptions } from '@/components/PaymentOptions'
import { PreMadeCollections } from '@/components/PreMadeCollections'
import { Testimonials } from '@/components/Testimonials'
import { WebsiteCreation } from '@/components/WebsiteCreation'
import { DigitalInvitations } from '@/components/DigitalInvitations'
import { ServicesGrid } from '@/components/ServicesGrid'
import { BrandPartners } from '@/components/BrandPartners'
import { Newsletter } from '@/components/Newsletter'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorks />
      <CreateGiftTable />
      <PaymentOptions />
      <PreMadeCollections />
      <Testimonials />
      <WebsiteCreation />
      <DigitalInvitations />
      <ServicesGrid />
      <BrandPartners />
      <Newsletter />
      <Footer />
    </main>
  )
}
