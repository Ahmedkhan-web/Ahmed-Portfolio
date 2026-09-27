import { skillGroups } from '@/data/portfolio'
import { useReveal } from '@/hooks/useReveal'
import Icon from './Icon'
import SectionHeading from './ui/SectionHeading'

export default function Stack() {
  const [ref, visible] = useReveal()

  return (
    <section id="stack" ref={ref} className="section relative">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Stack"
          title="Tools I reach for"
          accent="by default"
          description="Depth over breadth — these are the ones I’ve shipped with in production, not the ones I’ve read about once."
        />

        {/* Groups — flat columns, separated by hairlines rather than boxed in cards */}
        <div className="mt-20 grid gap-x-14 gap-y-16 md:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <div
              key={group.id}
              className="reveal border-t border-line pt-9"
              style={{ transitionDelay: `${gi * 110}ms`, opacity: visible ? undefined : 0 }}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-control border transition-colors duration-300 ${
                    group.accent
                      ? 'border-accent-muted bg-accent-wash text-accent'
                      : 'border-line bg-surface text-dim'
                  }`}
                >
                  <Icon name={group.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="flex items-center gap-3 text-xl font-light text-fg">
                    {group.label}
                    {group.accent && (
                      <span className="rounded-pill border border-accent-muted px-2.5 py-0.5 font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
                        focus
                      </span>
                    )}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-faint">{group.blurb}</p>
                </div>
              </div>

              {/* Skill rows */}
              <ul className="mt-9 space-y-4">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-dim">
                        {skill.name}
                        {skill.note && <span className="ml-2 font-mono text-[11px] text-faint">{skill.note}</span>}
                      </span>
                      {skill.level && <span className="font-mono text-[11px] text-faint">{skill.level}%</span>}
                    </div>
                    {skill.level && (
                      <div className="mt-2.5 h-px bg-line">
                        <div
                          className="h-px bg-accent transition-[width] duration-1000 ease-out"
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
