import { experience } from '@/data/portfolio'
import Icon from './Icon'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading index="03" eyebrow="Experience" title="Where I’ve" accent="done the work" />

        <ol className="relative mt-14">
          {/* Spine */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-accent-500/60 via-edge-2 to-transparent sm:left-[9px]"
          />

          {experience.map((role, i) => (
            <Reveal
              as="li"
              key={`${role.org}-${role.period}`}
              delay={i * 110}
              className="group relative pb-12 pl-9 last:pb-0 sm:pl-12"
            >
              {/* Node */}
              <span
                className={`absolute top-1.5 left-0 grid size-4 place-items-center rounded-full border transition-all duration-500 sm:size-5 ${
                  role.current
                    ? 'border-accent-400/70 bg-accent-500/25 shadow-[0_0_0_4px_rgba(168,85,247,0.10)]'
                    : 'border-edge-2 bg-base group-hover:border-accent-500/50'
                }`}
              >
                <span
                  className={`size-1.5 rounded-full transition-colors duration-500 ${
                    role.current ? 'bg-accent-300' : 'bg-faint group-hover:bg-accent-400'
                  }`}
                />
              </span>

              <div className="glass gradient-border-after rounded-2xl p-6 transition-colors duration-500 group-hover:border-accent-500/40 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg sm:text-2xl">{role.role}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
                      <span className="text-accent-300">{role.org}</span>
                      {role.current && (
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-emerald-300 uppercase">
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

                <p className="mt-4 text-sm leading-relaxed text-dim">{role.summary}</p>

                {role.highlights?.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {role.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-dim">
                        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {role.stack?.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2 border-t border-edge/60 pt-5">
                    {role.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-edge-2 bg-base-2/60 px-2.5 py-1 font-mono text-[11px] text-faint"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
