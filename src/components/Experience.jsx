import { experience } from '@/data/portfolio'
import Icon from './Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Experience() {
  return (
    <section id="experience" className="section relative">
      <div className="shell">
        <SectionHeading index="04" eyebrow="Experience" title="Where I’ve" accent="done the work" />

        {/* Timeline — a single hairline spine, roles as open typography */}
        <ol className="relative mt-20">
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[3px] w-px bg-line sm:left-[4px]" />

          {experience.map((role, i) => (
            <Reveal
              as="li"
              key={`${role.org}-${role.period}`}
              delay={i * 110}
              className="group relative pb-16 pl-9 last:pb-0 sm:pl-14"
            >
              {/* Node */}
              <span
                className={`absolute top-2 left-0 grid size-2.5 place-items-center rounded-full transition-colors duration-500 ${
                  role.current ? 'bg-accent' : 'bg-line-strong group-hover:bg-accent'
                }`}
              />

              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <div>
                  <h3 className="text-[1.5rem] leading-tight text-fg sm:text-[1.85rem]">{role.role}</h3>
                  <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                    <span className="text-accent">{role.org}</span>
                    {role.current && (
                      <span className="rounded-pill border border-accent-muted px-2.5 py-0.5 font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
                        current
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-faint">
                      <Icon name="mapPin" className="size-3.5" />
                      {role.location}
                    </span>
                  </p>
                </div>

                <p className="shrink-0 font-mono text-xs text-faint">{role.period}</p>
              </div>

              <p className="mt-6 max-w-2xl text-[15px] leading-[1.85] text-dim">{role.summary}</p>

              {role.highlights?.length > 0 && (
                <ul className="mt-7 max-w-2xl space-y-3">
                  {role.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-3.5 text-sm leading-relaxed text-dim">
                      <span className="mt-[9px] size-1 shrink-0 rounded-full bg-accent/70" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {role.stack?.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {role.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-pill border border-line px-3.5 py-1.5 font-mono text-[11px] text-faint transition-colors duration-300 hover:border-accent-muted hover:text-accent"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
