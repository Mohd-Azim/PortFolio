import { motion } from 'framer-motion'
import { Award, GraduationCap } from 'lucide-react'
import { portfolio } from '../data/portfolio'

export default function Education() {
  return (
    <section id="education" className="relative z-10 py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-primary">Education & Certs</p>
          <h2 className="section-title mt-2">Background & credentials</h2>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {portfolio.education.map((edu) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card flex gap-4 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <p className="text-xs font-mono text-primary">{edu.period}</p>
                  <h3 className="mt-1 font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{edu.details}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <h3 className="mb-4 font-semibold flex items-center gap-2">
              <Award size={20} className="text-primary" />
              Certifications
            </h3>
            <div className="space-y-3">
              {portfolio.certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-sm">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {portfolio.testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <p className="text-sm font-medium text-primary text-center mb-6">Testimonials</p>
            <p className="text-center text-muted-foreground mb-8">
              Kind words from collaborators
            </p>
            {portfolio.testimonials.map((t) => (
              <blockquote
                key={t.author}
                className="glass-card mx-auto max-w-2xl p-8 text-center"
              >
                <p className="text-muted-foreground italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4">
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
