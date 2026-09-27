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
    <section id="contact" className="section relative">
      <div className="shell">
        {/* Big centred pitch */}
        <SectionHeading
          index="06"
          eyebrow="Contact"
          title="Let’s build something"
          accent="worth shipping"
          align="center"
          description="Got a product that needs an AI layer, a codebase that needs rescuing, or a role that needs filling? Tell me what’s actually broken. I read every message and reply within a day."
        />

        {/* Direct channels */}
        <Reveal delay={120}>
          <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button as="a" href={`mailto:${profile.email}`} size="lg">
              <Icon name="mail" className="size-4" />
              {profile.email}
            </Button>

            <button
              type="button"
              onClick={copyEmail}
              className="group inline-flex items-center gap-2.5 rounded-pill border border-line px-6 py-3.5 font-mono text-[12px] tracking-[0.1em] text-dim uppercase transition-colors duration-300 hover:border-accent-muted hover:text-accent"
            >
              <Icon name={copied ? 'check' : 'copy'} className="size-4" />
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  target={social.icon === 'mail' ? undefined : '_blank'}
                  rel="noreferrer noopener"
                  className="link-underline inline-flex items-center gap-2 font-mono text-xs text-faint transition-colors duration-300 hover:text-accent"
                >
                  <Icon name={social.icon} className="size-[15px]" />
                  <span className="link-underline-on">{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Form */}
        <Reveal delay={240}>
          <div className="mx-auto mt-20 max-w-3xl rounded-card border border-line bg-surface p-7 sm:p-10">
            {status === 'sent' ? (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-full border border-accent-muted bg-accent-wash">
                  <Icon name="check" className="size-6 text-accent" />
                </span>
                <h3 className="mt-6 text-2xl font-light text-fg">Message on its way</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-dim">
                  Thanks for reaching out — I’ll get back to you within 24 hours.
                </p>
                <Button variant="outline" className="mt-8" onClick={() => setStatus('idle')}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
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
                      className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-faint"
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
                  <p
                    role="alert"
                    className="rounded-control border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs text-amber-200"
                  >
                    Couldn’t send automatically — your mail app should have opened instead.
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <Icon name="send" className="size-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-[11px] leading-relaxed text-faint">
                  No newsletter, no CRM. Your message goes to {profile.email} and nowhere else.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function inputClass(hasError) {
  return `w-full rounded-control border bg-surface-2 px-4 py-3.5 text-sm text-fg transition-colors duration-300 placeholder:text-faint/60 focus:bg-surface-3 focus:outline-none ${
    hasError ? 'border-red-400/60 focus:border-red-400' : 'border-line focus:border-accent-muted'
  }`
}

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
          {label}
        </label>
        {hint && <span className="font-mono text-[10px] text-faint/80">{hint}</span>}
      </div>
      {children}
      {error && (
        <p role="alert" className="mt-2 font-mono text-[11px] text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
