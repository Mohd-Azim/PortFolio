import { motion } from 'framer-motion'
import { portfolio } from '../data/portfolio'

export default function About() {
  const { personal, stats, highlights } = portfolio

  return (
    <section
      id="about"
      className="relative z-10 py-24"
      aria-label="About Mohd Azim — Java Backend Engineer"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Hidden machine-readable identity signals for crawlers */}
      <meta itemProp="name" content="Mohd Azim" />
      <meta itemProp="jobTitle" content="Java Backend Engineer" />
      <meta itemProp="url" content="https://mohdazim.dev" />
      <meta itemProp="email" content="mohdazim6309@gmail.com" />
      <meta itemProp="addressLocality" content="Delhi" />
      <meta itemProp="addressCountry" content="IN" />
      <link itemProp="sameAs" href="https://www.linkedin.com/in/mohd-azim-922373204" />
      <link itemProp="sameAs" href="https://github.com/Mohd-Azim" />

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-primary">About Me</p>
          <h2 className="section-title mt-2">Crafting digital experiences</h2>
          <p className="section-subtitle max-w-2xl">
            Backend-leaning engineer obsessed with clean architecture and performance.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p itemProp="description">
              {personal.about.split('Java Backend Engineer')[0]}
              <span className="text-foreground font-medium">Java Backend Engineer</span>
              {personal.about.split('Java Backend Engineer')[1]}
            </p>
            <p>{personal.summary}</p>
            <p>
              I&apos;ve shipped products in{' '}
              <span className="text-foreground font-medium">{personal.domains}</span>.
              Whether it&apos;s designing a multi-tenant subscription engine or fine-tuning a SQL
              query that runs millions of times a day, I love the craft.
            </p>

            {/* Contact / Location for crawlers */}
            <address className="not-italic hidden" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="addressLocality">Delhi</span>,{' '}
              <span itemProp="addressCountry">India</span>
            </address>

            <div className="flex flex-wrap gap-2 pt-4" aria-label="Core competencies">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
                  itemProp="knowsAbout"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
            aria-label="Career statistics"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center transition-colors hover:border-primary/30"
              >
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl font-bold gradient-text"
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  {stat.value}
                </motion.p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
