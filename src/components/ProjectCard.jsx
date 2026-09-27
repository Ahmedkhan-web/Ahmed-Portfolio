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
      className="reveal group relative overflow-hidden rounded-card border border-line bg-surface transition-colors duration-500 hover:border-line-strong"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <div className="relative p-7 sm:p-9 lg:p-11">
        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs text-accent">{num}</span>
            <span className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">{kicker}</span>
            <span className="h-3 w-px bg-line" aria-hidden="true" />
            <span className="font-mono text-[11px] text-faint">{year}</span>
          </div>
          {ai && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-pill border border-accent-muted px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
              <Icon name="sparkle" className="size-3" />
              AI
            </span>
          )}
        </div>

        <h3 className="mt-8 max-w-3xl text-[1.75rem] leading-[1.12] text-fg sm:text-[2.15rem] lg:text-[2.5rem]">
          {title}
        </h3>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-dim sm:text-base">{summary}</p>

        {/* Results — the "so what" */}
        {stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-light text-accent sm:text-3xl">{stat.value}</span>
                  <span className="mt-2 block text-[11px] leading-tight text-faint">{stat.label}</span>
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
              className="mt-9 inline-flex items-center gap-2.5 rounded-pill border border-line px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] text-dim uppercase transition-colors duration-300 hover:border-accent-muted hover:text-accent"
            >
              {open ? 'Close case study' : 'Read the case study'}
              <Icon
                name="chevronDown"
                className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {/* 0fr → 1fr grid transition animates to auto height cleanly */}
            <div
              id={`case-${id}`}
              className={`grid transition-all duration-500 ease-out ${
                open ? 'mt-10 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-9 border-t border-line pt-10">
                  <CaseBlock label="Problem">{problem}</CaseBlock>
                  <CaseBlock label="Solution" tone="accent">
                    {solution}
                  </CaseBlock>

                  {ai && (
                    <div className="rounded-card border border-accent-muted/60 bg-accent-wash p-6">
                      <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
                        <Icon name="sparkle" className="size-3.5" />
                        {ai.label}
                      </p>
                      <p className="mt-3 text-sm leading-[1.8] text-dim">{ai.detail}</p>
                    </div>
                  )}

                  {tech?.length > 0 && (
                    <div>
                      <p className="mb-4 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">Built with</p>
                      <ul className="flex flex-wrap gap-2">
                        {tech.map((item) => (
                          <li
                            key={item}
                            className="rounded-pill border border-line px-3.5 py-1.5 font-mono text-[11px] text-faint transition-colors duration-300 hover:border-accent-muted hover:text-accent"
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
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-2 rounded-pill border border-line px-5 py-2.5 font-mono text-[11px] tracking-[0.1em] text-dim uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <Icon name="external" className="size-3.5" />
                Live site
              </a>
            )}
            {links.repo && (
              <a
                href={links.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-2 rounded-pill border border-line px-5 py-2.5 font-mono text-[11px] tracking-[0.1em] text-dim uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <Icon name="github" className="size-3.5" />
                Source
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function CaseBlock({ label, tone = 'dim', children }) {
  if (!children) return null
  const labelColor = tone === 'accent' ? 'text-accent' : 'text-faint'
  return (
    <div>
      <p className={`mb-3 font-mono text-[11px] tracking-[0.14em] uppercase ${labelColor}`}>{label}</p>
      <p className="max-w-2xl text-[15px] leading-[1.8] text-dim">{children}</p>
    </div>
  )
}
