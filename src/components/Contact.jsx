import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Link, Code2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { portfolio } from '../data/portfolio'

export default function Contact() {
  const { personal } = portfolio
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = encodeURIComponent(
      `From: ${form.name} (${form.email})\n\n${form.message}`,
    )
    const mailto = `mailto:${personal.email}?subject=${encodeURIComponent(form.subject)}&body=${body}`
    window.location.href = mailto
    toast.success('Opening your email client...')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const contactItems = [
    { icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: Phone, label: 'Phone', value: personal.phone, href: personal.phone.includes('XX') ? null : `tel:${personal.phone}` },
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
    <section id="contact" className="relative z-10 py-24 bg-secondary/20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium text-primary">Contact</p>
          <h2 className="section-title mt-2">Let&apos;s build something</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Have a project in mind, a role to discuss, or just want to say hi? My inbox is always
            open.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
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
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass-card space-y-4 p-6"
          >
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-muted-foreground">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm text-muted-foreground">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send size={16} />
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
