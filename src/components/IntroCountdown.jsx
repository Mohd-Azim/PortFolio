import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FRAGMENTS = [
  'Java', 'Spring Boot', 'Microservices', 'Nginx', 'Docker',
  'AWS', 'Kafka', 'Redis', 'Spring AI', 'LangChain4j',
  'PostgreSQL', 'MySQL', 'Spring Security', 'JWT', 'REST API',
  'Hibernate', 'Jenkins', 'Maven', 'Tomcat', 'Git',
  'SQL', 'Python', 'TypeScript', 'React.js', 'Thymeleaf'
]

// Generate explosion particles that scatter across the entire viewport
const generateParticles = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200
  const height = typeof window !== 'undefined' ? window.innerHeight : 800

  return Array.from({ length: 55 }).map((_, i) => {
    const text = FRAGMENTS[i % FRAGMENTS.length]
    
    // Scatter to random coordinates covering the screen
    const x = (Math.random() - 0.5) * width
    const y = (Math.random() - 0.5) * height
    const scale = 0.9 + Math.random() * 0.7
    const rotation = (Math.random() - 0.5) * 720
    const delay = Math.random() * 0.1 // Rapid wave trigger

    // Multicolor neons
    const colorClasses = [
      'bg-red-500/20 border-red-500/50 text-red-400 shadow-red-500/10',
      'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-orange-500/10',
      'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-yellow-500/10',
      'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10',
      'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-cyan-500/10',
      'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-blue-500/10',
      'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-purple-500/10',
      'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400 shadow-fuchsia-500/10'
    ]
    const colorClass = colorClasses[i % colorClasses.length]

    return {
      id: i,
      text,
      x,
      y,
      scale,
      rotation,
      delay,
      colorClass
    }
  })
}

export default function IntroCountdown({ onComplete }) {
  const [count, setCount] = useState(5)
  const [phaseText, setPhaseText] = useState('Initializing compiler context...')
  const [isExploded, setIsExploded] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Lock scroll on start
    document.body.style.overflow = 'hidden'
    return () => {
      // Restore scroll on cleanup
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    if (count > 0) {
      const texts = {
        5: 'Bootstrapping payload dependency graph...',
        4: 'Compiling source files & binding port:8080...',
        3: 'Establishing Kafka brokers and Redis connection clusters...',
        2: 'Injecting Spring AI agents & RAG runbooks...',
        1: 'All systems green. Prepare for deploy launch...'
      }
      setPhaseText(texts[count] || 'Ready...')
      
      // Increased countdown speed (450ms instead of 600ms)
      const timer = setTimeout(() => {
        setCount(count - 1)
      }, 450)
      return () => clearTimeout(timer)
    } else {
      // Trigger Explosion
      setParticles(generateParticles())
      setIsExploded(true)
      
      // End introduction and reveal page after explosion completes
      const endTimer = setTimeout(() => {
        onComplete()
      }, 2400)
      return () => clearTimeout(endTimer)
    }
  }, [count, onComplete])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 select-none overflow-hidden">
      {/* Visual background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isExploded ? (
          <motion.div
            key="countdown-container"
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center z-10 text-center px-4"
          >
            {/* Circular Countdown Ring */}
            <div className="relative flex items-center justify-center w-40 h-40 mb-8">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  className="stroke-muted/30 fill-none"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="72"
                  className="stroke-primary fill-none"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 72}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 72) * (1 - count / 5) }}
                  transition={{ duration: 0.45, ease: 'linear' }}
                />
              </svg>

              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-6xl font-bold font-mono tracking-tighter text-foreground text-glow text-primary"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Simulated compiler logs */}
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={count}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-mono text-primary/80 uppercase tracking-widest"
                >
                  {phaseText}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Glowing decorative indicator */}
            <div className="mt-4 flex gap-1.5 justify-center">
              {[5, 4, 3, 2, 1].map((dotVal) => (
                <div
                  key={dotVal}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    count >= dotVal ? 'bg-primary scale-125 shadow-[0_0_8px_hsl(var(--primary))]' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            {/* White/Cyan shockwave flash */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 24, opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-white via-cyan-300 to-primary blur-md mix-blend-screen"
            />
            
            {/* Shockwave circle outline */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.8, borderWidth: '15px' }}
              animate={{ scale: 14, opacity: 0, borderWidth: '1px' }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute w-40 h-40 rounded-full border border-primary/80"
            />

            {/* Explosion Particles (Skill Tags) - Radial disperse + gravity drift landing */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0.1, opacity: 1, rotate: 0 }}
                animate={{
                  x: [0, p.x, p.x],
                  y: [0, p.y, p.y + 120], // Burst then drift down to "land"
                  scale: [0.1, p.scale, p.scale * 0.7],
                  opacity: [1, 1, 0.8, 0],
                  rotate: [0, p.rotation, p.rotation + 45]
                }}
                transition={{
                  duration: 2.2,
                  ease: [0.1, 0.85, 0.25, 1], // Custom deceleration curve
                  delay: p.delay
                }}
                className={`absolute px-4 py-1.5 rounded-full border font-mono text-xs font-semibold shadow-lg backdrop-blur-sm ${p.colorClass}`}
              >
                {p.text}
              </motion.div>
            ))}

          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
