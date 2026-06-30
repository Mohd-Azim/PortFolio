import { useState, useEffect } from 'react'
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
import SarcasticMessage from './components/SarcasticMessage'
import SystemDesign from './components/SystemDesign'
import Blog from './components/Blog'
import CustomCursor from './components/CustomCursor'

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    const state = sessionStorage.getItem('intro_state')
    // Play intro on first load OR when primed for another refresh
    return !state || state === 'ready_for_countdown'
  })

  const [showSarcastic, setShowSarcastic] = useState(() => {
    const state = sessionStorage.getItem('intro_state')
    // Show sarcastic message ONLY on first refresh
    return state === 'shown'
  })

  // Prep the NEXT refresh to immediately show the countdown again
  useEffect(() => {
    if (showSarcastic) {
      sessionStorage.setItem('intro_state', 'ready_for_countdown')
    }
  }, [showSarcastic])

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_state', 'shown')
    setShowIntro(false)
    document.body.style.overflow = 'unset'
  }

  const handleReplayFromSarcastic = () => {
    sessionStorage.setItem('intro_state', 'shown') // Reset back to completed state
    setShowSarcastic(false)
    setShowIntro(true)
  }

  const handleSkipFromSarcastic = () => {
    setShowSarcastic(false)
    document.body.style.overflow = 'unset'
  }

  return (
    <>
      <CustomCursor />
      {showIntro && <IntroCountdown onComplete={handleIntroComplete} />}
      {showSarcastic && (
        <SarcasticMessage
          onReplay={handleReplayFromSarcastic}
          onSkip={handleSkipFromSarcastic}
        />
      )}
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
