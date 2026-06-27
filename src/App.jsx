import { useState } from 'react'
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
import IntroCountdown from './components/IntroCountdown'
import Chatbot from './components/Chatbot'

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Show intro on first load per session
    return !sessionStorage.getItem('intro_shown')
  })

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_shown', 'true')
    setShowIntro(false)
    document.body.style.overflow = 'unset'
  }

  return (
    <>
      {showIntro && <IntroCountdown onComplete={handleIntroComplete} />}
      <main className="relative">
        <ParticleBackground />
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
        <Footer />
        <Chatbot />
      </main>
    </>
  )
}
