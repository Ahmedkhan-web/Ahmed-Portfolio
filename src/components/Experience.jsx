import { experience } from '@/data/portfolio.js'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

/* ---------------------------------------------------------------------------
 *  EXPERIENCE
 * ---------------------------------------------------------------------------
 *  A timeline rendered entirely from `experience.roles` in
 *  src/data/portfolio.js. Four fields per entry and nothing else: when, what,
 *  what it involved, and what it was built with.
 *
 *  THE SPINE. One gradient line down the left with a marker on each row, which is
 *  what makes a stack of blocks read as a sequence. The current role's marker is
 *  lit rather than hollow — a full stop on the timeline for the thing that is
 *  happening now. Everything else stays a ring.
 *
 *  DATES IN THEIR OWN COLUMN from `sm` up. The period is the one field that is
 *  only comparable between rows, so putting it in a fixed-width left column
 *  turns three separate strings into an aligned column of time, and the titles
 *  line up with each other down the page. Below `sm` it stacks above the title,
 *  where a 120px column would leave the role name a few words per line.
 *
 *  The rows are an ordered list. They are sequential content and a list is the
 *  correct element for it; the marker and spine are decoration and are hidden
 *  from assistive technology.
 *
 *  `min-h-svh` is a minimum and the section is usually taller than one screen:
 *  three entries with their responsibilities do not compress to fit a laptop
 *  viewport, and squeezing them to make it fit would mean either shorter rows or
 *  a smaller type size than the rest of the page. The reader scrolls on, which is
 *  what one continuous page is for.
 * -------------------------------------------------------------------------*/
export default function Experience() {
  return (
    <section
      id="experience"
      className="relative flex min-h-svh w-full scroll-mt-gutter flex-col justify-center px-5 pr-[var(--nav-clearance)] py-rhythm-lg sm:px-8 sm:pr-[var(--nav-clearance)] lg:px-10 lg:pr-10"
    >
      <SectionHeading
        eyebrow={experience.eyebrow}
        lines={experience.headline}
        accentLine={1}
        lede={experience.summary}
        delay={60}
      />

      <ol className="relative mx-auto mt-rhythm-md w-full max-w-[54rem]">
        {/* The spine. `left-[7px]` is half the 15px marker, so the marker sits on
            the line rather than beside it, and it stops short of the last row so
            the timeline does not appear to continue past the content. */}
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-[7px] top-3 w-px bg-gradient-to-b from-accent-400/45 via-edge-2 to-transparent"
        />

        {experience.roles.map((entry, i) => {
          const { period, role, org, summary, highlights, stack } = entry
          const current = i === 0

          return (
            <Reveal
              key={`${role}-${period}`}
              as="li"
              delay={300 + i * 110}
              className="relative pb-7 pl-8 last:pb-0 sm:pl-10"
            >
              {/* Marker: a ring rather than a filled dot, so it reads as a point
                  on the timeline instead of a bullet in a list. The current role
                  is lit, and carries a dark halo so the spine passes behind it
                  rather than through it. */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 size-[15px] rounded-full border-2 ${
                  current
                    ? 'border-accent-400 bg-base shadow-[0_0_0_3px_var(--color-base)]'
                    : 'border-edge-2 bg-base'
                }`}
              >
                {current ? (
                  <span className="absolute inset-[3px] rounded-full bg-accent-400" />
                ) : null}
              </span>

              {/* One grid for the period and the body, so the periods form a
                  column and the titles form another. */}
              <div className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-x-6">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent-300 sm:pt-1">
                  {period}
                </p>

                <article className="min-w-0">
                  <h3 className="font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-fg">
                    {role}
                  </h3>

                  {org ? <p className="mt-0.5 text-[0.82rem] text-dim">{org}</p> : null}

                  {summary ? (
                    <p className="mt-2.5 text-[0.9rem] leading-[1.7] text-dim">{summary}</p>
                  ) : null}

                  {highlights?.length ? (
                    <ul className="mt-3 grid gap-1.5">
                      {highlights.map((h) => (
                        <li
                          key={h}
                          className="flex gap-2.5 text-[0.875rem] leading-[1.65] text-dim"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] size-1 shrink-0 rounded-full bg-accent-400/70"
                          />
                          <span className="min-w-0">{h}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {stack?.length ? (
                    /* `flex-wrap` with no fixed widths: the chips break onto a
                       second row rather than squeezing, and nothing here can be
                       wider than its own label, so the row cannot push the
                       timeline out of the column. */
                    <ul
                      aria-label={`Technologies — ${role}`}
                      className="mt-3.5 flex flex-wrap gap-1.5"
                    >
                      {stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] leading-none tracking-[0.03em] text-dim"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}