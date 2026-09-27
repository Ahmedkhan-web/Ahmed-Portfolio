import { skillGroups } from '@/data/portfolio'
import { useReveal } from '@/hooks/useReveal'
import Icon from './Icon'
import SectionHeading from './ui/SectionHeading'

export default function Stack() {
  const [ref, visible] = useReveal()

  return (
    <section id="stack" ref={ref} className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <SectionHeading
          index="02"
          eyebrow="Stack"
          title="Tools I reach for"
          accent="by default"
          description="Depth over breadth — these are the ones I’ve shipped with in production, not the ones I’ve read about once."
        />

        {/* Groups */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <div
              key={group.id}
              className={`reveal ${visible ? 'is-visible' : ''} glass gradient-border-after group/card relative overflow-hidden rounded-2xl p-6 transition-colors duration-500 hover:border-accent-500/40 sm:p-7`}
              style={{ transitionDelay: `${gi * 110}ms` }}
            >
              {/* Accent wash on the AI card */}
              {group.accent && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-accent-600/18 opacity-70 blur-3xl transition-opacity duration-500 group-hover/card:opacity-100"
                />
              )}

              <div className="relative flex items-start gap-3.5">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-lg border transition-colors duration-300 ${
                    group.accent
                      ? 'border-accent-500/40 bg-accent-500/12 text-accent-300'
                      : 'border-edge-2 bg-base-2 text-dim group-hover/card:border-accent-500/40 group-hover/card:text-accent-300'
                  }`}
                >
                  <Icon name={group.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-fg">
                    {group.label}
                    {group.accent && (
                      <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-2 py-0.5 font-mono text-[10px] font-normal tracking-wide text-accent-300 uppercase">
                        focus
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-faint">{group.blurb}</p>
                </div>
              </div>

              {/* Skill rows */}
              <ul className="relative mt-6 space-y-3">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-dim transition-colors duration-300 group-hover/card:text-fg">
                        {skill.name}
                        {skill.note && <span className="ml-2 font-mono text-[11px] text-faint">{skill.note}</span>}
                      </span>
                      {skill.level && <span className="font-mono text-[11px] text-faint">{skill.level}%</span>}
                    </div>
                    {skill.level && (
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-edge/70">
                        <div
                          className={`h-full rounded-full transition-[width] duration-1000 ease-out ${
                            group.accent
                              ? 'bg-gradient-to-r from-accent-500 to-glow'
                              : 'bg-gradient-to-r from-accent-600 to-accent-400'
                          }`}
                          style={{ width: visible ? `${skill.level}%` : '0%' }}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
