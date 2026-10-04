import { experience } from '@/data/portfolio.js'
import Chip from './ui/Chip.jsx'
import MicroLabel from './ui/MicroLabel.jsx'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

/* ---------------------------------------------------------------------------
 *  EXPERIENCE
 * ---------------------------------------------------------------------------
 *  A timeline rendered entirely from `experience.roles` in
 *  src/data/portfolio.js. Five fields per entry and nothing else: when, what,
 *  what it involved, what it was built with, and what it is now.
 *
 *  THE RAIL IS A REAL GRID COLUMN from `xl` up: period, then a 1.75rem rail,
 *  then the entry. Putting the timeline in columns rather than hanging markers
 *  off a padding edge means the periods form an aligned column of time and the
 *  role titles form another, which is what makes three entries scannable
 *  instead of merely present. Both columns are fixed and the entry takes
 *  everything left, so the entry's right edge is the section's right edge at
 *  every width — the timeline ends on the same line as the About section above
 *  it rather than floating in the middle of the column.
 *
 *  WHY `xl` AND NOT `sm` FOR THOSE COLUMNS. The shell has already spent 288px
 *  on the pinned card and 152px on the rail clearance, so at `lg` the content
 *  column is 504px. Two fixed columns inside that leave the entry around 340px,
 *  which turns every summary and every highlight into four or five short lines.
 *  So below `xl` the period moves above the entry and the rail collapses into
 *  the gutter the row's `pl-8` opens — the same arrangement as a phone, because
 *  it is the arrangement that fits. The entry then has the full column to
 *  itself at any width, and its text is capped by measure rather than by
 *  whatever is left over.
 *
 *  EVERY LINE OF TEXT INSIDE AN ENTRY IS CAPPED AT `max-w-measure`, the same
 *  36rem About's paragraphs use. That is the fix for the thing that made this
 *  section read as a wall: the card used to be as wide as the column allowed,
 *  which put a 91-100 character highlight line beside a 64-character summary in
 *  the same box. One measure for the section means the summary, the
 *  responsibilities and the tooling all wrap at the same place.
 *
 *  THE SPINE IS DRAWN PER ENTRY, NOT ONCE FOR THE WHOLE LIST. Each row owns the
 *  connector that runs from just below its own marker down past the bottom of
 *  its own box, and the last row owns none. A single line stretched over the
 *  <ol> would have to be stopped at a distance the CSS cannot know — the height
 *  of the last entry — and every value guessed for it is either a line that runs
 *  on past the final role or one that stops short of the one before it.
 *  Per-entry segments cannot get that wrong: each is as long as the row it
 *  belongs to, and because every one of them starts at the same x and the same
 *  offset below its marker, they line up into what reads as a single continuous
 *  line. Each stops 27px below its row, which is exactly where the next row's
 *  marker starts, so the line runs *into* the next dot rather than stopping a
 *  gap short of it.
 *
 *  27px is the offset that lines the period and the marker up with the role title
 *  inside the card: the card's own 24px of padding plus 3, which puts the 15px
 *  marker's centre 2.5px above the middle of the title's line box — close enough
 *  that the marker reads as level with the role it belongs to. One number for
 *  both the period and the marker is what makes the rail read as attached to the
 *  entry rather than floating beside it.
 *
 *  THE CURRENT ENTRY IS TREATED DIFFERENTLY, and it is the only asymmetry in the
 *  section. A lit marker, a hairline of emerald along the card's top edge, a
 *  "Current" chip in the period column and a slightly denser surface say which
 *  years are the present tense — and doing it by contrast, rather than by making
 *  all three cards equally loud, is what keeps three cards from reading as
 *  clutter.
 *
 *  HOVER CHANGES COLOUR AND NOTHING ELSE. The card does not lift, and the chips
 *  do not move: these are not links, and a card that rises under the pointer
 *  promises a click that is not there. So the response is the border, the
 *  surface and the chip tint — a change in state, not in position.
 *
 *  The rows are an ordered list. They are sequential content and a list is the
 *  correct element for it; the markers and connectors are decoration and are
 *  hidden from assistive technology.
 *
 *  `min-h-svh` is a minimum and the section is usually taller than one screen:
 *  three entries with their responsibilities do not compress to fit a laptop
 *  viewport, and squeezing them to make it fit would mean either shorter rows or
 *  a smaller type size than the rest of the page.
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
        rule
        delay={40}
      />

      <ol className="relative mx-auto mt-rhythm-lg w-full max-w-section">
        {experience.roles.map((entry, i) => {
          const { period, role, org, summary, highlights, stack } = entry
          const current = i === 0

          return (
            <Reveal
              key={`${role}-${period}`}
              as="li"
              delay={300 + i * 120}
              /* `pl-8` opens the gutter the rail sits in below `xl`; from `xl`
                 the rail is a column of its own and the padding is gone. */
              className="group relative grid grid-cols-1 pb-10 pl-8 last:pb-0 xl:grid-cols-[8.5rem_1.75rem_minmax(0,1fr)] xl:pb-12 xl:pl-0"
            >
              {/* ---- Period, and which entry is the present one -------------
                  Above the entry below `xl`, in the time column from `xl`. The
                  `nowrap` is why that column is sized to fit its longest value:
                  a period that breaks reads as a layout fault, not as a range. */}
              <div className="xl:pt-[27px]">
                <p className="whitespace-nowrap font-mono text-[11px] font-medium uppercase leading-[1.4] tracking-[0.16em] text-accent-300">
                  {period}
                </p>

                {current ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-accent-400/25 bg-accent-400/[0.07] px-2 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-accent-300">
                    <span aria-hidden="true" className="size-1 rounded-full bg-accent-400" />
                    Current
                  </span>
                ) : null}
              </div>

              {/* ---- The rail: marker and the connector below it ------------
                  Below `xl` this is an absolutely positioned box in the row's
                  gutter, 15px wide so the marker's centre lands exactly on the
                  connector's x. From `xl` it stops being positioned and becomes
                  the grid's own rail column, centred with `justify-self-center`
                  so it lands in the same place relative to the row. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-[1px] xl:static xl:justify-self-center xl:pt-[27px]"
              >
                <span
                  className={`relative block size-[15px] rounded-full border-2 bg-base transition-colors duration-300 ${
                    current
                      ? 'border-accent-400'
                      : 'border-edge-2 group-hover:border-accent-400/60'
                  }`}
                >
                  {current ? (
                    <>
                      <span className="absolute inset-[3px] rounded-full bg-accent-400" />
                      {/* The halo. `status-pulse` is the same keyframe the card's
                          availability dot uses — one animation for "this is live"
                          on the whole page — and the reduced-motion block
                          collapses it for anyone who has asked for none. It is
                          `inset-0` inside a 15px marker, so it scales from the
                          marker's own centre rather than from its corner. */}
                      <span className="absolute inset-0 animate-[status-pulse_3.2s_var(--ease-out-expo)_infinite] rounded-full border border-accent-400/40" />
                    </>
                  ) : null}
                </span>
              </div>

              {/* The connector. Rendered only between entries, so the spine
                  genuinely stops at the last marker instead of trailing off the
                  end of the section — and it *runs into* the next marker rather
                  than stopping at this row's own bottom edge, which would leave
                  the gap the next row's 27px marker offset opens up.

                  Sized with `bottom` rather than a height so it tracks the row's
                  real height, which changes with the entry's copy and its
                  highlights. The two offsets are the two marker offsets: the
                  stacked marker sits 1px down and the `xl` marker 27px down, so
                  each segment ends level with the top of the marker it feeds.

                  The `xl` x is the centre of the rail column: the period column
                  is a fixed 8.5rem and the rail 1.75rem, so the centre is the
                  same number at every width. It is measured from the row's left
                  edge and not from the right precisely because the entry is
                  `1fr` — the one column here whose width CSS cannot know. */}
              {i < experience.roles.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[-1px] left-[7px] top-[16px] w-px bg-gradient-to-b from-accent-400/40 to-edge-2 xl:bottom-[-27px] xl:left-[calc(8.5rem+0.875rem)] xl:top-[42px]"
                />
              ) : null}

              {/* ---- The entry ------------------------------------------------ */}
              <article
                className={`relative mt-3 rounded-2xl border p-5 transition-[border-color,background-color] duration-300 sm:mt-2 sm:p-6 xl:mt-0 ${
                  current
                    ? 'border-accent-400/20 bg-white/[0.045]'
                    : 'border-white/[0.07] bg-white/[0.02] hover:border-accent-400/25 hover:bg-white/[0.04]'
                }`}
              >
                {/* A lit edge along the top of the current card, fading out at
                    both ends — the same hairline the section rules are cut from,
                    which is what ties the card to the chapter it sits in. */}
                {current ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent"
                  />
                ) : null}

                <h3 className="max-w-measure font-display text-[1.2rem] font-semibold leading-[1.25] tracking-[-0.02em] text-fg">
                  {role}
                </h3>

                {org ? (
                  <p className="mt-1.5 max-w-measure text-[0.8125rem] leading-[1.5] text-dim">
                    {org}
                  </p>
                ) : null}

                {summary ? (
                  <p className="mt-3 max-w-measure text-[0.9375rem] leading-[1.7] text-dim">
                    {summary}
                  </p>
                ) : null}

                {highlights?.length ? (
                  /* Under a hairline of its own, so the card reads as three
                     labelled levels — what it was, what it involved, what it was
                     built with — rather than as one paragraph run-on. */
                  <ul className="mt-4 grid max-w-measure gap-2 border-t border-white/[0.06] pt-4">
                    {highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-3 text-[0.9375rem] leading-[1.65] text-dim"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.62em] size-1 shrink-0 rounded-full bg-accent-400/80"
                        />
                        <span className="min-w-0">{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {stack?.length ? (
                  /* The page's own `Chip`, wrapped in a `flex-wrap` with no
                     fixed widths: the pills break onto a second row rather than
                     squeezing, and nothing here can be wider than its own label,
                     so no tool name can push the card out of the column. */
                  <div className="mt-5">
                    <MicroLabel>Technologies</MicroLabel>
                    <ul aria-label={`Technologies — ${role}`} className="mt-3 flex flex-wrap gap-1.5">
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
