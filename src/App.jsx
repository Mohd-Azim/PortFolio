import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import Chatbot from './components/Chatbot'
import SystemDesign from './components/SystemDesign'
import Blog from './components/Blog'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <>
      <CustomCursor />
      <main className="relative">
        <ParticleBackground />
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <SystemDesign />
        <Experience />
        <Projects />
        <Blog />
        <Education />
        <Contact />
        <Footer />
        <Chatbot />
      </main>
    </>
  )
}
