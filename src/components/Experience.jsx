import { CheckCircle2 } from 'lucide-react'

import { experience } from '@/data/portfolio.js'
import Chip from './ui/Chip.jsx'
import MicroLabel from './ui/MicroLabel.jsx'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative flex min-h-svh w-full scroll-mt-gutter flex-col justify-center px-5 py-rhythm-lg sm:px-8 lg:px-10 lg:pr-10"
    >
      <SectionHeading
        eyebrow={experience.eyebrow}
        lines={experience.headline}
        accentLine={1}
        lede={experience.summary}
        rule
        delay={40}
      />

      <ol className="mx-auto mt-rhythm-lg grid w-full max-w-section gap-4">
        {experience.roles.map((entry, index) => {
          const { period, role, org, summary, highlights, stack } = entry
          const current = index === 0

          return (
            <Reveal
              key={`${role}-${period}`}
              as="li"
              delay={300 + index * 120}
              className="group"
            >
              <article
                className={`relative overflow-hidden rounded-[1.75rem] border transition-[border-color,background-color] duration-300 ${
                  current
                    ? 'border-accent-400/25 bg-[linear-gradient(145deg,rgba(16,185,129,0.12),rgba(12,18,17,0.72)_38%,rgba(5,7,6,0.5))] p-5 shadow-[0_36px_100px_-62px_rgba(52,211,153,0.55)] sm:p-6'
                    : 'border-white/[0.07] bg-white/[0.02] p-5 hover:border-accent-400/24 hover:bg-white/[0.035] sm:p-6'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-6 left-0 w-px ${
                    current
                      ? 'bg-gradient-to-b from-transparent via-accent-400 to-transparent'
                      : 'bg-gradient-to-b from-transparent via-edge-2 to-transparent group-hover:via-accent-400/45'
                  }`}
                />
                {current ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-28 size-56 rounded-full border border-accent-400/[0.08]"
                  />
                ) : null}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_14.5rem] xl:gap-8">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <p className="whitespace-nowrap font-mono text-[11px] font-medium uppercase leading-[1.4] tracking-[0.16em] text-accent-300">
                        {period}
                      </p>
                      {current ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-400/25 bg-accent-400/[0.08] px-2.5 py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-accent-300">
                          <span aria-hidden="true" className="size-1 rounded-full bg-accent-400" />
                          Current
                        </span>
                      ) : null}
                    </div>

                    <h3
                      className={`mt-3 max-w-measure font-display font-semibold leading-[1.05] tracking-[-0.03em] text-fg ${
                        current ? 'text-[1.95rem] sm:text-[2.35rem]' : 'text-[1.35rem] sm:text-[1.55rem]'
                      }`}
                    >
                      {role}
                    </h3>

                    {org ? (
                      <p className="mt-2 max-w-measure text-[0.84rem] leading-[1.55] text-accent-200/75">
                        {org}
                      </p>
                    ) : null}

                    {summary ? (
                      <p className="mt-4 max-w-measure text-[0.98rem] leading-[1.72] text-dim">
                        {summary}
                      </p>
                    ) : null}
                  </div>

                  <aside className="border-t border-white/[0.07] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                    <MicroLabel>Stack</MicroLabel>
                    <p className="mt-3 font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-fg tabular-nums">
                      {String(stack?.length ?? 0).padStart(2, '0')}
                    </p>
                    <p className="mt-2 text-[0.82rem] leading-[1.6] text-faint">
                      Core technologies carried through this chapter.
                    </p>
                  </aside>
                </div>

                {highlights?.length ? (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                    {highlights.map((highlight, i) => (
                      <li
                        key={highlight}
                        className="rounded-2xl border border-white/[0.065] bg-base/25 p-4 transition-colors duration-300 group-hover:border-accent-400/18"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            aria-hidden="true"
                            className="size-4 shrink-0 text-accent-300"
                            strokeWidth={1.6}
                          />
                          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-300/80">
                            Signal {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="mt-3 text-[0.9rem] leading-[1.62] text-dim">{highlight}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {stack?.length ? (
                  <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-start sm:justify-between">
                    <MicroLabel>Technologies</MicroLabel>
                    <ul
                      aria-label={`Technologies - ${role}`}
                      className="flex max-w-[34rem] flex-wrap gap-1.5 sm:justify-end"
                    >
                      {stack.map((tech) => (
                        <li key={tech}>
                          <Chip>{tech}</Chip>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}
