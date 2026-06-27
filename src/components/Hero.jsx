import { motion } from 'framer-motion'
import { ArrowDown, Download, Mail } from 'lucide-react'
import { portfolio } from '../data/portfolio'

export default function Hero() {
  const { personal, hero } = portfolio

  return (
    <section className="relative z-10 min-h-screen flex items-center pt-16">
      <div className="section-container grid gap-12 lg:grid-cols-2 lg:gap-8 items-center py-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {personal.availability}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Hi, I&apos;m{' '}
            <span className="gradient-text">{personal.firstName}</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            {personal.tagline.split('Java, Spring Boot & Microservices')[0]}
            <span className="text-primary font-medium">
              Java, Spring Boot & Microservices
            </span>
            {personal.tagline.split('Java, Spring Boot & Microservices')[1]}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              View Projects
            </a>
            <a
              href={`mailto:${personal.email}?subject=Resume Request`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Download size={16} />
              Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Mail size={16} />
              Contact
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {hero.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-border/60 bg-muted/50 px-3 py-1 text-xs font-mono text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card overflow-hidden shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                developer.ts
              </span>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed">
              <code>
                <span className="text-accent">const</span>{' '}
                <span className="text-primary">dev</span> = {'{'}
                {'\n'}
                {'  '}
                <span className="text-muted-foreground">name:</span>{' '}
                <span className="text-emerald-400">{hero.codeSnippet.name}</span>,
                {'\n'}
                {'  '}
                <span className="text-muted-foreground">role:</span>{' '}
                <span className="text-emerald-400">{hero.codeSnippet.role}</span>,
                {'\n'}
                {'  '}
                <span className="text-muted-foreground">stack:</span> [
                {'\n'}
                {hero.codeSnippet.stack.map((item, i) => (
                  <span key={item}>
                    {'    '}
                    <span className="text-emerald-400">{item}</span>
                    {i < hero.codeSnippet.stack.length - 1 ? ',' : ''}
                    {'\n'}
                  </span>
                ))}
                {'  '}]
                {'\n'}
                {'};'}
              </code>
            </pre>
          </div>
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-2xl" />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Scroll to about"
      >
        <ArrowDown className="animate-bounce" size={24} />
      </motion.a>
    </section>
  )
}
