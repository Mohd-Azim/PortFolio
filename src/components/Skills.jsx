import { motion } from 'framer-motion'
import { portfolio } from '../data/portfolio'

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 py-24 bg-secondary/20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-primary">Skills</p>
          <h2 className="section-title mt-2">My toolbelt</h2>
          <p className="section-subtitle">
            A categorized view of technologies I use to ship real products.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.skills.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="mb-4 font-semibold text-foreground">{group.category}</h3>
              <div className="space-y-4">
                {group.items.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">{skill.name}</span>
                      <span className="font-mono text-xs text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
