import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Link, Code2, Loader2 } from 'lucide-react'
import { portfolio } from '../data/portfolio'

const GOOGLE_FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScWSifchRIYDAyxArssjGqk09fIAg--pm8IiMxcY1doCDERKQ/viewform?embedded=true'

export default function Contact() {
  const { personal } = portfolio
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const contactItems = [
    { icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    {
      icon: Phone,
      label: 'Phone',
      value: personal.phone,
      href: personal.phone.includes('XX') ? null : `tel:${personal.phone}`,
    },
    { icon: MapPin, label: 'Location', value: personal.location, href: null },
    {
      icon: Link,
      label: 'LinkedIn',
      value: personal.linkedinHandle,
      href: personal.linkedin,
    },
    {
      icon: Code2,
      label: 'GitHub',
      value: personal.githubHandle,
      href: personal.github,
    },
  ]

  return (
    <section
      id="contact"
      aria-label="Contact Mohd Azim — Java Backend Engineer"
      className="relative z-10 py-24 bg-secondary/20"
    >
      <div className="section-container">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium text-primary">Contact</p>
          <h2 className="section-title mt-2">Let&apos;s build something</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Have a project in mind, a role to discuss, or just want to say hi? Fill out the form
            below — I&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* ── Left: Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 font-semibold">Contact Information</h3>
            <div className="space-y-4">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 glass-card p-6">
              <p className="text-sm font-medium text-primary">Available for opportunities</p>
              <p className="mt-1 text-sm text-muted-foreground">{personal.openTo}</p>
            </div>

            {/* Direct email CTA */}
            <div className="mt-6">
              <a
                href={`mailto:${personal.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Mail size={16} />
                Email me directly
              </a>
            </div>
          </motion.div>

          {/* ── Right: Embedded Google Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card overflow-hidden p-2"
          >
            {/* Loading placeholder shown until iframe fires onLoad */}
            {!iframeLoaded && (
              <div className="flex h-[600px] items-center justify-center gap-3 text-muted-foreground">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="text-sm">Loading contact form…</span>
              </div>
            )}

            <iframe
              id="google-contact-form"
              title="Contact Mohd Azim — Send a Message"
              src={GOOGLE_FORM_EMBED_URL}
              onLoad={() => setIframeLoaded(true)}
              style={{ display: iframeLoaded ? 'block' : 'none' }}
              className="h-[620px] w-full rounded-lg border-0 bg-transparent"
              allowFullScreen
              loading="lazy"
            >
              Loading contact form…
            </iframe>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
