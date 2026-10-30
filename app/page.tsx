import { Hero } from '@/components/hero/hero'
import { Statement } from '@/components/sections/statement'
import { Flight } from '@/components/work/flight'
import { WorkIndex } from '@/components/work/work-index'
import { About, Experience } from '@/components/sections/about'
import { Contact, Footer } from '@/components/sections/contact'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Statement />
      <Flight />
      <WorkIndex />
      <About />
      <Experience />
      <Contact />
      <Footer />
    </main>
  )
}
