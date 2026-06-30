import { portfolio } from '../data/portfolio'

export default function Footer() {
  const { personal, site, navLinks } = portfolio

  return (
    <footer
      className="relative z-10 border-t border-border/50 py-12"
      aria-label="Site footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="section-container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-sm font-semibold text-primary">{site.domain}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Crafted with React, Tailwind and a lot of espresso.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-3 text-sm font-semibold">Quick Links</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 text-sm font-semibold">Connect</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="hover:text-primary transition-colors"
                  aria-label="Mohd Azim on LinkedIn — Java Backend Engineer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="hover:text-primary transition-colors"
                  aria-label="Mohd Azim on GitHub — Spring Boot & Java Projects"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${personal.email}`}
                  className="hover:text-primary transition-colors"
                  aria-label={`Email Mohd Azim at ${personal.email}`}
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {site.year}{' '}
            <span itemScope itemType="https://schema.org/Person" itemProp="name">
              {personal.fullName}
            </span>
            . All rights reserved.
          </p>
          <p className="mt-1">
            Java Backend Engineer — Spring Boot • Microservices • Kafka • AI. Delhi, India.
          </p>
        </div>
      </div>
    </footer>
  )
}
