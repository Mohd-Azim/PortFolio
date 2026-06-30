import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Link, Code2, Loader2, Send } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { portfolio } from '../data/portfolio'

export default function Contact() {
  const { personal } = portfolio

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScWSifchRIYDAyxArssjGqk09fIAg--pm8IiMxcY1doCDERKQ/formResponse'
    const bodyParams = new URLSearchParams()
    
    // Exact entry keys from user curl request
    bodyParams.append('entry.1301988031', formData.name)
    bodyParams.append('entry.1396968391', formData.email)
    bodyParams.append('entry.1860165093', formData.phone)
    bodyParams.append('entry.1591275612', formData.company)
    bodyParams.append('entry.483737399', formData.message)

    try {
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      })

      toast.success('Response saved! Opening for new message.', {
        position: 'bottom-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      })
    } catch (err) {
      console.error('Google form post error:', err)
      toast.error('Failed to submit. Please mail directly to ' + personal.email, {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'colored',
      })
    } finally {
      setSubmitting(false)
    }
  }

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
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm hover:text-primary transition-colors font-mono"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-mono">{value}</p>
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
                className="inline-flex items-center gap-2 rounded border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Mail size={16} />
                Email me directly
              </a>
            </div>
          </motion.div>

          {/* ── Right: Custom Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8"
          >
            <h3 className="mb-6 font-semibold text-lg">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
                    Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-background/50 border border-border/80 rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full bg-background/50 border border-border/80 rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 70XXXXXX29"
                    className="w-full bg-background/50 border border-border/80 rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
                    Company / Org
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Paytm"
                    className="w-full bg-background/50 border border-border/80 rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can I help you? Feel free to describe your project or opportunity..."
                  className="w-full bg-background/50 border border-border/80 rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </section>
  )
}
