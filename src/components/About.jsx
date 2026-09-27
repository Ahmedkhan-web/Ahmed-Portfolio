import { about, profile } from '@/data/portfolio'
import Icon from './Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          {/* ---------------- Narrative ---------------- */}
          <div>
            <SectionHeading
              index="01"
              eyebrow="About"
              title={about.heading}
              accent={about.headingAccent}
            />

            <div className="mt-8 space-y-5">
              {about.paragraphs.map((text, i) => (
                <Reveal key={i} delay={i * 90}>
                  {/* Italic *word* markers in the copy render as accent spans */}
                  <p className="max-w-2xl text-base leading-[1.75] text-dim [&_em]:font-medium [&_em]:not-italic [&_em]:text-accent-300">
                    {renderEmphasis(text)}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Off-the-clock aside */}
            <Reveal delay={200}>
              <div className="mt-10 rounded-xl border border-dashed border-edge-2 bg-surface/40 p-5">
                <p className="flex items-center gap-2 font-mono text-xs tracking-wide text-faint uppercase">
                  <Icon name="sparkle" className="size-3.5 text-accent-400" />
                  {about.aside.label}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {about.aside.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-dim">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-accent-500/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* ---------------- Fact rail ---------------- */}
          <Reveal delay={140}>
            <div className="lg:sticky lg:top-28">
              <div className="glass gradient-border-after rounded-2xl p-6">
                <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">At a glance</p>

                <dl className="mt-5 space-y-4">
                  {about.facts.map((fact) => (
                    <div key={fact.label} className="flex items-baseline justify-between gap-4 border-b border-edge/60 pb-4 last:border-0 last:pb-0">
                      <dt className="text-sm text-dim">{fact.label}</dt>
                      <dd className="font-display text-lg font-semibold text-fg">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 space-y-3 border-t border-edge/60 pt-5 text-sm">
                  <p className="flex items-center gap-2.5 text-dim">
                    <Icon name="mapPin" className="size-4 shrink-0 text-accent-400" />
                    {profile.location}
                  </p>
                  <p className="flex items-center gap-2.5 text-dim">
                    <Icon name="mail" className="size-4 shrink-0 text-accent-400" />
                    <a href={`mailto:${profile.email}`} className="truncate transition-colors hover:text-accent-300">
                      {profile.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2.5 text-dim">
                    <Icon name="clock" className="size-4 shrink-0 text-accent-400" />
                    Replies within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Renders *word* markers as <em> so the copy in portfolio.js stays readable. */
function renderEmphasis(text) {
  return text.split(/(\*[^*]+\*)/g).map((chunk, i) =>
    chunk.startsWith('*') && chunk.endsWith('*') ? <em key={i}>{chunk.slice(1, -1)}</em> : chunk,
  )
}
