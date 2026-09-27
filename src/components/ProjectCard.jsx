import Icon from './Icon'

/**
 * Case-study card: problem → solution → tech → AI component → result.
 * Collapsed shows the headline + measured result; expanded reveals the story.
 */
export default function ProjectCard({ project, index, open, onToggle, delay }) {
  const { id, title, kicker, year, summary, problem, solution, tech, ai, stats = [], links = {} } = project
  const num = String(index + 1).padStart(2, '0')
  const hasDetail = Boolean(problem || solution)

  return (
    <article
      className="reveal glass gradient-border-after group relative overflow-hidden rounded-2xl transition-colors duration-500 hover:border-accent-500/40"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {/* Hover wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-72 rounded-full bg-accent-600/12 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
      />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-faint">{num}</span>
            <span className="rounded-full border border-edge-2 bg-base-2/70 px-2.5 py-1 font-mono text-[11px] tracking-wide text-dim">
              {kicker}
            </span>
            <span className="font-mono text-[11px] text-faint">{year}</span>
          </div>
          {ai && (
            <span
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-1 font-mono text-[11px] text-accent-300"
              title="This project uses AI"
            >
              <Icon name="sparkle" className="size-3" />
              AI
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold text-fg sm:text-[1.75rem]">{title}</h3>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-dim">{summary}</p>

        {/* Results — the "so what" */}
        {stats.length > 0 && (
          <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-edge/60 py-4">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-lg font-semibold text-gradient sm:text-xl">{stat.value}</span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-faint">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Expandable case study */}
        {hasDetail && (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={`case-${id}`}
              className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-accent-400 transition-colors hover:text-accent-300"
            >
              {open ? 'Collapse case study' : 'Read the case study'}
              <Icon
                name="chevronDown"
                className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {/* 0fr → 1fr grid transition animates to auto height cleanly */}
            <div
              id={`case-${id}`}
              className={`grid transition-all duration-500 ease-out ${
                open ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-5 border-t border-edge/60 pt-5">
                  <CaseBlock label="Problem" tone="dim">
                    {problem}
                  </CaseBlock>

                  <CaseBlock label="Solution" tone="accent">
                    {solution}
                  </CaseBlock>

                  {ai && (
                    <div className="rounded-xl border border-accent-500/25 bg-accent-500/[0.07] p-4">
                      <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-accent-300 uppercase">
                        <Icon name="sparkle" className="size-3.5" />
                        {ai.label}
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-dim">{ai.detail}</p>
                    </div>
                  )}

                  {tech?.length > 0 && (
                    <div>
                      <p className="mb-2.5 font-mono text-[11px] tracking-[0.15em] text-faint uppercase">Built with</p>
                      <ul className="flex flex-wrap gap-2">
                        {tech.map((item) => (
                          <li
                            key={item}
                            className="rounded-md border border-edge-2 bg-base-2/60 px-2.5 py-1 font-mono text-[11px] text-dim transition-colors hover:border-accent-500/40 hover:text-accent-300"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Links */}
        {(links.live || links.repo) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-2 rounded-lg border border-edge-2 bg-base-2/60 px-3.5 py-2 text-[13px] text-dim transition-all duration-300 hover:border-accent-500/50 hover:text-fg"
              >
                <Icon name="external" className="size-3.5" />
                Live site
                <Icon
                  name="arrowUpRight"
                  className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                />
              </a>
            )}
            {links.repo && (
              <a
                href={links.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-2 rounded-lg border border-edge-2 bg-base-2/60 px-3.5 py-2 text-[13px] text-dim transition-all duration-300 hover:border-accent-500/50 hover:text-fg"
              >
                <Icon name="github" className="size-3.5" />
                Source
                <Icon
                  name="arrowUpRight"
                  className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function CaseBlock({ label, tone = 'dim', children }) {
  const labelColor = tone === 'accent' ? 'text-accent-400' : 'text-faint'
  return (
    <div>
      <p className={`mb-2 font-mono text-[11px] tracking-[0.15em] uppercase ${labelColor}`}>{label}</p>
      <p className="text-sm leading-relaxed text-dim">{children}</p>
    </div>
  )
}
