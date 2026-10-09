import { Mail, MessageCircle, Send } from 'lucide-react'
import { useMemo, useState } from 'react'

import { contact, profile } from '@/data/portfolio.js'
import Button from './ui/Button.jsx'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

const initial = {
  name: '',
  email: '',
  project: 'Website / product build',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initial)

  const whatsappHref = useMemo(() => {
    const lines = [
      'New portfolio enquiry',
      '',
      `Name: ${form.name || 'Not provided'}`,
      `Email: ${form.email || 'Not provided'}`,
      `Project type: ${form.project || 'Not provided'}`,
      '',
      'Message:',
      form.message || 'Not provided',
    ]

    return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
  }, [form])

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    window.open(whatsappHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      id="contact"
      className="relative flex min-h-svh w-full scroll-mt-gutter flex-col justify-center px-5 py-rhythm-lg sm:px-8 lg:px-10 lg:pr-10"
    >
      <SectionHeading
        eyebrow={contact.eyebrow}
        lines={contact.headline}
        accentLine={1}
        lede={contact.summary}
        rule
        delay={40}
      />

      <div className="mx-auto mt-rhythm-lg grid w-full max-w-section gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <Reveal
          delay={300}
          className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(16,185,129,0.11),rgba(12,18,17,0.72)_45%,rgba(5,7,6,0.5))] p-5 sm:p-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 top-4 font-display text-[7rem] font-semibold leading-none tracking-[-0.08em] text-accent-400/[0.055]"
          >
            ↗
          </span>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-accent-300">
            Direct line
          </p>
          <h3 className="mt-4 max-w-[12ch] font-display text-[2.25rem] font-semibold leading-[0.98] tracking-[-0.04em] text-fg">
            Start the build conversation.
          </h3>
          <p className="mt-5 max-w-[28rem] text-[0.98rem] leading-[1.75] text-dim">
            Share the goal, timeline, and what already exists. The form opens WhatsApp with a clean brief ready to send.
          </p>

          <div className="mt-7 grid gap-3">
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 rounded-2xl border border-accent-400/20 bg-accent-400/[0.08] p-4 text-accent-200 transition-colors duration-300 hover:border-accent-400/38 hover:bg-accent-400/[0.12]"
            >
              <MessageCircle aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.7} />
              <span className="min-w-0 text-[0.94rem] font-medium">{contact.directLabel}</span>
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-dim transition-colors duration-300 hover:border-accent-400/24 hover:text-fg"
            >
              <Mail aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.7} />
              <span className="min-w-0 text-[0.94rem] font-medium">{contact.emailLabel}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={420}>
          <form
            onSubmit={submit}
            className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Your name"
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Ahmed Khan"
                autoComplete="name"
                required
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <label className="mt-4 block">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/85">
                Project type
              </span>
              <select
                name="project"
                value={form.project}
                onChange={update}
                className="mt-2 h-12 w-full rounded-2xl border border-white/[0.08] bg-base-2/70 px-4 text-[0.95rem] text-fg outline-none transition-colors duration-300 focus:border-accent-400/55"
              >
                <option>Website / product build</option>
                <option>AI integration</option>
                <option>Frontend redesign</option>
                <option>Full-stack app</option>
                <option>Other</option>
              </select>
            </label>

            <label className="mt-4 block">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/85">
                Message
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={update}
                required
                rows={6}
                placeholder="Tell me what you want to build, improve, or launch..."
                className="mt-2 min-h-36 w-full resize-y overflow-y-hidden rounded-2xl border border-white/[0.08] bg-base-2/70 px-4 py-3 text-[0.95rem] leading-[1.6] text-fg outline-none transition-colors duration-300 placeholder:text-faint focus:border-accent-400/55"
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[24rem] text-[0.82rem] leading-[1.55] text-faint">
                This opens WhatsApp with your message prefilled. You can review it before sending.
              </p>
              <Button type="submit" iconEnd={Send} size="lg" className="shrink-0">
                Send to WhatsApp
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder, autoComplete, required = false }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/85">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 h-12 w-full rounded-2xl border border-white/[0.08] bg-base-2/70 px-4 text-[0.95rem] text-fg outline-none transition-colors duration-300 placeholder:text-faint focus:border-accent-400/55"
      />
    </label>
  )
}
