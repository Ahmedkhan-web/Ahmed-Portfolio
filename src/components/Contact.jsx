import { useState } from 'react'
import { profile, socials } from '@/data/portfolio'
import Icon from './Icon'
import Button from './ui/Button'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

const EMPTY = { name: '', email: '', projectType: profile.projectTypes[0], message: '' }
const MESSAGE_MIN = 20
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Contact() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [copied, setCopied] = useState(false)

  const update = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Required'
    if (!EMAIL_RE.test(values.email.trim())) next.email = 'Enter a valid email'
    if (values.message.trim().length < MESSAGE_MIN) next.message = `At least ${MESSAGE_MIN} characters`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const buildMailto = () => {
    const subject = encodeURIComponent(`${values.projectType} — from ${values.name}`)
    const body = encodeURIComponent(
      `${values.message}\n\n—\n${values.name}\n${values.email}`,
    )
    return `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    // No endpoint configured — hand off to the visitor's mail client.
    if (!profile.contactEndpoint) {
      window.location.href = buildMailto()
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(profile.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...values,
          access_key: profile.contactAccessKey,
          from_name: values.name,
          replyto: values.email,
        }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setValues(EMPTY)
      setStatus('sent')
    } catch {
      // Degrade gracefully rather than losing the message.
      window.location.href = buildMailto()
      setStatus('error')
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* ---------------- Pitch ---------------- */}
          <div>
            <SectionHeading
              index="05"
              eyebrow="Contact"
              title="Let’s build something"
              accent="worth shipping"
              description="Got a product that needs an AI layer, a codebase that needs rescuing, or a role that needs filling? Tell me what’s actually broken. I read every message and reply within a day."
            />

            {/* Email w/ copy */}
            <button
              type="button"
              onClick={copyEmail}
              className="group mt-8 flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-edge-2 bg-surface/50 px-4 py-3.5 text-left transition-colors hover:border-accent-500/50"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon name="mail" className="size-4 shrink-0 text-accent-400" />
                <span className="truncate font-mono text-sm text-dim">{profile.email}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-faint transition-colors group-hover:text-accent-300">
                <Icon name={copied ? 'check' : 'copy'} className="size-3.5" />
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>

            {/* Socials */}
            <ul className="mt-8 space-y-1">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target={social.icon === 'mail' ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between gap-4 rounded-lg border-b border-edge/60 py-3.5 text-sm text-dim transition-colors hover:border-accent-500/30 hover:text-fg"
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        name={social.icon}
                        className="size-[18px] text-faint transition-colors group-hover:text-accent-300"
                      />
                      {social.label}
                    </span>
                    <span className="flex items-center gap-2 font-mono text-xs text-faint">
                      {social.handle}
                      <Icon
                        name="arrowUpRight"
                        className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- Form ---------------- */}
          <Reveal delay={140}>
            <div className="glass gradient-border-after relative overflow-hidden rounded-2xl p-6 sm:p-8">
              {status === 'sent' ? (
                <div className="flex min-h-96 flex-col items-center justify-center text-center">
                  <span className="grid size-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                    <Icon name="check" className="size-7 text-emerald-300" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-fg">Message on its way</h3>
                  <p className="mt-2 max-w-xs text-sm text-dim">
                    Thanks for reaching out — I’ll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" className="mt-7" onClick={() => setStatus('idle')}>
                    Send another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" error={errors.name} htmlFor="name">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={values.name}
                        onChange={update('name')}
                        aria-invalid={Boolean(errors.name)}
                        className={inputClass(errors.name)}
                      />
                    </Field>

                    <Field label="Email" error={errors.email} htmlFor="email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={values.email}
                        onChange={update('email')}
                        aria-invalid={Boolean(errors.email)}
                        className={inputClass(errors.email)}
                      />
                    </Field>
                  </div>

                  <Field label="What’s this about" htmlFor="projectType">
                    <div className="relative">
                      <select
                        id="projectType"
                        name="projectType"
                        value={values.projectType}
                        onChange={update('projectType')}
                        className={`${inputClass(false)} appearance-none pr-10`}
                      >
                        {profile.projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-surface text-fg">
                            {type}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name="chevronDown"
                        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-faint"
                      />
                    </div>
                  </Field>

                  <Field
                    label="Message"
                    error={errors.message}
                    htmlFor="message"
                    hint={`${values.message.trim().length}/${MESSAGE_MIN} min`}
                  >
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="What are you building, and where does the AI fit?"
                      value={values.message}
                      onChange={update('message')}
                      aria-invalid={Boolean(errors.message)}
                      className={`${inputClass(errors.message)} resize-y`}
                    />
                  </Field>

                  {status === 'error' && (
                    <p role="alert" className="rounded-lg border border-amber-400/25 bg-amber-400/10 px-3.5 py-2.5 text-xs text-amber-200">
                      Couldn’t send automatically — your mail app should have opened instead.
                    </p>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
                    {status === 'sending' ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <Icon
                          name="send"
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-[11px] text-faint">
                    No newsletter, no CRM. Your message goes to {profile.email} and nowhere else.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function inputClass(hasError) {
  return `w-full rounded-lg border bg-base-2/70 px-3.5 py-3 text-sm text-fg placeholder:text-faint/70 transition-colors focus:bg-base-2 focus:outline-none ${
    hasError ? 'border-red-400/60 focus:border-red-400' : 'border-edge-2 focus:border-accent-500/70'
  }`
}

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="font-mono text-[11px] tracking-[0.12em] text-faint uppercase">
          {label}
        </label>
        {hint && <span className="font-mono text-[10px] text-faint/80">{hint}</span>}
      </div>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 font-mono text-[11px] text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
