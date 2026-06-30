import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { portfolio } from '../data/portfolio'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/50 bg-background/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between">
        <a href="#" className="font-mono text-sm font-semibold text-primary">
          Mohd Azim
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {portfolio.navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
        >
          Hire Me
        </a>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="section-container flex flex-col gap-4 py-4">
              {portfolio.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Hire Me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
