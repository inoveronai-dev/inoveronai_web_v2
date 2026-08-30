import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Problem } from '@/components/problem'
import { Services } from '@/components/services'
import { Process } from '@/components/process'
import { Stats } from '@/components/stats'
import { About } from '@/components/about'
import { CTA } from '@/components/cta'
import { Faq } from '@/components/faq'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-link">Preskočiť na obsah</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <Services />
        <Process />
        <Stats />
        <About />
        <CTA />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
