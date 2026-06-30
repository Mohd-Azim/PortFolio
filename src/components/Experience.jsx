import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { portfolio } from '../data/portfolio'

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative z-10 py-24"
      aria-label="Work Experience — Mohd Azim Java Backend Engineer"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-primary">Experience</p>
          <h2 className="section-title mt-2">Where I&apos;ve built things</h2>
        </motion.div>

        <div className="relative mt-12">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          {portfolio.experience.map((job, index) => (
            <motion.div
              key={`${job.company}-${job.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative mb-12 flex flex-col md:flex-row ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
              itemScope
              itemType="https://schema.org/OrganizationRole"
            >
              <div className="hidden md:block md:w-1/2" />
              <div
                className={`md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}
              >
                <div className="glass-card p-6 ml-10 md:ml-0">
                  <div
                    className={`flex items-start gap-3 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Briefcase size={20} />
                    </div>
                    <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                      <p className="text-xs font-mono text-primary" itemProp="startDate">
                        {job.period}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold" itemProp="roleName">
                        {job.role}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground"
                        itemScope
                        itemType="https://schema.org/Organization"
                      >
                        <span itemProp="name">{job.company}</span>
                        {' · '}
                        <span itemProp="address">{job.location}</span>
                      </p>
                    </div>
                  </div>
                  <ul
                    className={`mt-4 space-y-2 text-sm text-muted-foreground ${
                      index % 2 === 0 ? 'md:text-right' : ''
                    }`}
                    aria-label={`Key achievements at ${job.company}`}
                  >
                    {job.highlights.map((item) => (
                      <li key={item} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:left-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
