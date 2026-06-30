import { motion } from 'framer-motion'
import { ExternalLink, Code2 } from 'lucide-react'
import { portfolio } from '../data/portfolio'

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative z-10 py-24 bg-secondary/20"
      aria-label="Software Projects by Mohd Azim — Java Backend Engineer"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-primary">Projects</p>
          <h2 className="section-title mt-2">Selected work</h2>
          <p className="section-subtitle">
            A few products I&apos;ve designed, built or scaled.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {portfolio.projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card group overflow-hidden transition-all hover:border-primary/30 ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
              itemScope
              itemType="https://schema.org/SoftwareApplication"
            >
              <div
                className={`h-1 bg-gradient-to-r ${project.gradient}`}
              />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono text-primary">{project.subtitle}</p>
                    <h3
                      className="mt-1 text-xl font-semibold group-hover:text-primary transition-colors"
                      itemProp="name"
                    >
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {project.links.code && (
                      <a
                        href={project.links.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label={`View source code for ${project.title}`}
                        itemProp="codeRepository"
                      >
                        <Code2 size={16} />
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label={`View live demo of ${project.title}`}
                        itemProp="url"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <p
                  className="mt-4 text-sm text-muted-foreground leading-relaxed"
                  itemProp="description"
                >
                  {project.description}
                </p>

                <div className="mt-4">
                  <p className="text-xs font-medium text-foreground mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2" aria-label={`Technologies used in ${project.title}`}>
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-muted px-2 py-1 text-xs font-mono text-muted-foreground"
                        itemProp="applicationCategory"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-border/60 px-3 py-0.5 text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <p className="text-sm font-medium text-primary text-center mb-6">My tech stack</p>
          <div
            className="flex flex-wrap justify-center gap-3"
            aria-label="Full tech stack: Java, Spring Boot, Kafka, Redis, MySQL, PostgreSQL, AWS, Docker, GitHub Actions, Spring AI, LangChain4j, React"
          >
            {portfolio.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-border/50 bg-card/60 px-4 py-2 text-sm font-mono text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
