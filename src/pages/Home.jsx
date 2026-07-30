import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import DisciplinesSection from '../components/sections/DisciplinesSection'
import WhyUsSection from '../components/sections/WhyUsSection'
import ProjectsGrid from '../components/sections/ProjectsGrid'
import ContactSection from '../components/sections/ContactSection'
import PageTransition from '../components/ui/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <Navbar />
      <main>
        <Hero />
        <DisciplinesSection />
        <WhyUsSection />
        <ProjectsGrid />
        <ContactSection />
      </main>
      <Footer />
    </PageTransition>
  )
}
