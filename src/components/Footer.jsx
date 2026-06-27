import { portfolio } from '../data/portfolio'

export default function Footer() {
  const { personal, site, navLinks } = portfolio

  return (
    <footer className="relative z-10 border-t border-border/50 py-12">
      <div className="section-container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-sm font-semibold text-primary">{site.domain}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Crafted with React, Tailwind and a lot of espresso.
            </p>
          </div>

          <div>
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
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Connect</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${personal.email}`} className="hover:text-primary transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {site.year} {personal.fullName}. All rights reserved.
          </p>
          <p className="mt-1">Designed & built with care.</p>
        </div>
      </div>
    </footer>
  )
}
