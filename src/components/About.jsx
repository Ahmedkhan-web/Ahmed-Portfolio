import { about, profile, heroTerminal } from '@/data/portfolio'
import Icon from './Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import Terminal from './ui/Terminal'

export default function About() {
  return (
    <section id="about" className="section relative">
      <div className="shell">
        <SectionHeading index="02" eyebrow="About" title={about.heading} accent={about.headingAccent} />

        {/* ---------------- Narrative ---------------- */}
        <div className="mt-16 max-w-3xl space-y-7">
          {about.paragraphs.map((text, i) => (
            <Reveal key={i} delay={i * 90}>
              {/* Italic *word* markers in the copy render as accent spans */}
              <p className="text-[16px] leading-[1.9] text-dim sm:text-[17px] [&_em]:font-normal [&_em]:text-accent">
                {renderEmphasis(text)}
              </p>
            </Reveal>
          ))}
        </div>

        {/* ---------------- Aside ---------------- */}
        <Reveal delay={180}>
          <ul className="mt-14 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
            {about.aside.items.map((item) => (
              <li key={item} className="flex items-start gap-3.5 text-sm leading-relaxed text-dim">
                <Icon name="check" className="mt-1 size-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ---------------- Supporting row ---------------- */}
        <div className="mt-24 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal delay={140}>
            <Terminal
              title={heroTerminal.title}
              lines={heroTerminal.lines}
              footer={heroTerminal.footer}
              className="h-full"
            />
          </Reveal>

          {/* Fact rail */}
          <Reveal delay={220}>
            <div className="flex h-full flex-col justify-between rounded-card border border-line bg-surface p-8">
              <div>
                <p className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">At a glance</p>
                <dl className="mt-8 space-y-5">
                  {about.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-baseline justify-between gap-4 border-b border-line pb-5 last:border-0 last:pb-0"
                    >
                      <dt className="text-sm text-dim">{fact.label}</dt>
                      <dd className="font-display text-lg font-light text-fg">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8 space-y-3.5 border-t border-line pt-7 text-sm">
                <p className="flex items-center gap-3 text-dim">
                  <Icon name="mapPin" className="size-4 shrink-0 text-accent" />
                  {profile.location}
                </p>
                <p className="flex items-center gap-3 text-dim">
                  <Icon name="mail" className="size-4 shrink-0 text-accent" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="truncate transition-colors duration-300 hover:text-accent"
                  >
                    {profile.email}
                  </a>
                </p>
                <p className="flex items-center gap-3 text-dim">
                  <Icon name="clock" className="size-4 shrink-0 text-accent" />
                  Replies within 24 hours
                </p>
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
