import { about, capabilityIcon, hero } from '@/data/portfolio.js'
import MicroLabel from './ui/MicroLabel.jsx'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

/* ---------------------------------------------------------------------------
 *  ABOUT
 * ---------------------------------------------------------------------------
 *  One chapter heading, then two bands of body on a single shared width
 *  (`max-w-section`) and a single shared left edge:
 *
 *      heading            centred, closes on the page's chapter rule
 *      ───────────────
 *      prose  |  ledger   the argument, and the figures that back it
 *      ───────────────
 *      01 02 03 04        four capabilities, two by two
 *
 *  Nothing follows the capabilities. The section used to close on a band of
 *  tools by layer, which was the one block on the page that repeated itself: the
 *  same technologies were already listed under every role in Experience, a screen
 *  further down, in the same pills. Two inventories of the same list is one too
 *  many, and the one that lost was the one that read least like an argument —
 *  a list of tools says what was used, while the paragraphs above it say what
 *  was built and why it holds up.
 *
 *  THE CENTRED HEADING OVER A LEFT-ALIGNED BODY is deliberate, and it is the
 *  same axis the hero sits on, so arriving at About reads as the next chapter
 *  of the same page rather than as a different layout. The chapter rule is what
 *  makes the turn legible: it spans the full content width, so the centred block
 *  above it and the flush-left block below it are visibly one section and not
 *  two designs that happen to be adjacent.
 *
 *  WHY THE PROSE IS NOT FULL WIDTH. A line of running text wants 45-75
 *  characters; the content column here is 830-1000px on a desktop, which is
 *  100-115 characters a line — a page of type, not a paragraph. So every
 *  paragraph is capped at `max-w-measure` (36rem, 60-68 characters), the same
 *  cap Experience's summaries use, and the width that is left over is not left
 *  ragged: from `xl` the ledger takes the right margin, and below `xl` it
 *  becomes a horizontal row of figures under the prose. Asymmetric emptiness
 *  reads as a mistake; a margin column or a band beneath it reads as a layout.
 *
 *  WHY `xl` AND NOT `lg` FOR THE MARGIN LEDGER. At `lg` the shell has already
 *  spent 288px on the pinned card and 152px on the rail clearance, so the
 *  content column is 504px — and a ledger beside the prose there leaves each of
 *  them around 240px, which is 28 characters a line. The split needs the full
 *  832px of `max-w-section`, so it starts where that width exists.
 *
 *  THE LEDGER is the same figures the hero states under its buttons, resolved
 *  from `hero.stats` by label rather than written out again here, so the two
 *  cannot end up printing two different numbers for the same thing. It is
 *  hairline rows rather than a panel: three figures under one label are a spec
 *  sheet, and a box around them would be a second competing surface in a
 *  section whose whole argument is type. A `stat` naming nothing throws rather
 *  than rendering an empty cell.
 *
 *  THE CAPABILITIES ARE A 2x2 GRID OF HAIRLINE ROWS, not four boxes. Four boxes
 *  read as a dashboard of unrelated widgets; four numbered rows under one
 *  heading read as one list of four things. The numeral is `aria-hidden` and set
 *  immediately before its title rather than pushed to the far edge of the cell:
 *  an index 300px from the word it numbers is a second thing to read, and the
 *  `<ol>` already carries the ordering for anything that cannot see it.
 *
 *  Every block is a `Reveal`, driven by the viewport rather than the mount — so
 *  the section assembles as it is scrolled to, in the order the stagger sets,
 *  and assembles again every time the reader comes back to it.
 *
 *  `min-h-svh` because the document is the scroller: it gives the section a full
 *  screen of its own, so arriving at About is arriving at a section rather than
 *  at the tail of the hero. It is a minimum, not a height — once the copy runs
 *  longer than the screen the section grows past one viewport and the reader
 *  simply keeps going, which is the whole point of one continuous page.
 * -------------------------------------------------------------------------*/
export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-svh w-full scroll-mt-gutter flex-col justify-center px-5 pr-[var(--nav-clearance)] py-rhythm-lg sm:px-8 sm:pr-[var(--nav-clearance)] lg:px-10 lg:pr-10"
    >
      <SectionHeading
        eyebrow={about.eyebrow}
        lines={about.headline}
        accentLine={2}
        lede={about.lede}
        rule
        delay={40}
      />

      {/* ---- Prose, and the figures that back it --------------------------
          One grid from `xl`: the prose column takes the slack, the ledger
          holds the right margin at a fixed 13rem, so both edges of the
          section are the same two x positions at every desktop width instead
          of the ledger drifting with the viewport.

          Below `xl` it is a single column and the ledger becomes a row of
          three figures under the prose — see the note on the rail above for
          why the split cannot happen any earlier. */}
      <div className="mx-auto mt-rhythm-lg grid w-full max-w-section gap-y-rhythm-md xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-x-12">
        <div className="max-w-measure">
          {about.paragraphs.map((text, i) => (
            <Reveal
              key={text.slice(0, 24)}
              as="p"
              delay={300 + i * 80}
              className={`text-[1rem] leading-[1.8] text-dim ${i ? 'mt-4' : ''}`}
            >
              {text}
            </Reveal>
          ))}
        </div>

        {/* `dt` before `dd`, the only order a definition list is defined in,
            and here it is also the better reading order: a label above its own
            figure is how a spec sheet is set, and the hairline above each pair
            keeps the two together at 13rem. */}
        <Reveal delay={460} className="xl:pt-1">
          <MicroLabel>Practice in numbers</MicroLabel>

          <dl className="mt-4 flex flex-wrap gap-x-9 gap-y-5 xl:mt-5 xl:flex-col xl:gap-y-0">
            {about.practice.metrics.map(({ label, stat }) => (
              <div key={label} className="min-w-[7rem] border-t border-edge pt-2.5">
                <dt className="font-mono text-[10px] font-medium uppercase leading-[1.4] tracking-[0.18em] text-dim">
                  {label}
                </dt>
                <dd className="mt-1 font-display text-[1.75rem] font-semibold leading-none tracking-[-0.02em] text-fg tabular-nums">
                  {hero.stats.find((s) => s.label === stat).value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* ---- Capabilities -------------------------------------------------
          Two by two from `sm`. The hairline above each cell is the same
          division the chapter rule and the ledger rows are cut from, so the
          whole section is one drawing system rather than four blocks that
          happen to share a palette.

          The icon sits in the title row rather than in a column of its own down
          the side of the cell. That is a measure decision as much as a visual
          one: a chip plus its gap down the side takes a ninth of a 392px cell,
          and the body beside it was landing at 32 characters a line — below the
          point where the eye can reliably find the start of the next one. In
          the lockup it costs the body nothing, and it now holds 45-48. */}
      <ol className="mx-auto mt-rhythm-md grid w-full max-w-section gap-x-12 gap-y-8 sm:grid-cols-2">
        {about.capabilities.map(({ icon, title, body }, i) => {
          const Icon = capabilityIcon[icon]

          return (
            /* `group` on the row itself, so the hover that lights the top rule
               and the icon chip is driven from the row's own box and stays put
               when the pointer crosses from the chip to the text. */
            <Reveal key={title} as="li" delay={620 + i * 80} className="group">
              <div className="border-t border-edge pt-5 transition-colors duration-300 group-hover:border-accent-400/40">
                <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] font-semibold tracking-[-0.015em] text-fg">
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-accent-300 transition-colors duration-300 group-hover:border-accent-400/30 group-hover:text-accent-200"
                    aria-hidden="true"
                  >
                    <Icon className="size-4" strokeWidth={1.5} />
                  </span>

                  {/* The numeral is `aria-hidden` and set immediately before its
                      title: the `<ol>` already carries the ordering, and an
                      index pushed to the far edge of the cell would be a second
                      thing to read, 300px from the word it numbers. */}
                  <span
                    aria-hidden="true"
                    className="font-mono text-[10px] font-medium tabular-nums tracking-[0.18em] text-accent-400/85"
                  >
                    0{i + 1}
                  </span>

                  {title}
                </h3>

                <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-dim">{body}</p>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}
