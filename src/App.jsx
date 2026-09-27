import Backdrop from '@/components/ui/Backdrop'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Stack from '@/components/Stack'
import Experience from '@/components/Experience'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <>
      <Backdrop />
      <Nav />

      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Stack />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
