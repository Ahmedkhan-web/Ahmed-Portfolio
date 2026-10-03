import { about, capabilityIcon } from '@/data/portfolio.js'
import Reveal from './ui/Reveal.jsx'
import SectionHeading from './ui/SectionHeading.jsx'

/* ---------------------------------------------------------------------------
 *  ABOUT
 * ---------------------------------------------------------------------------
 *  One positioning sentence, two short paragraphs and four capability rows. No
 *  imagery and nothing invented: every figure in the copy is Ahmed's own, and
 *  the capability rows restate the same full-stack + AI work the card and the
 *  headline already claim.
 *
 *  HIERARCHY, top to bottom: the display headline states the outcome, the lede
 *  states the standard at one size above the body and a stop brighter, and the
 *  two paragraphs are the detail. Each step down is smaller and dimmer, so the
 *  eye is handed a clear order rather than three blocks of similar grey text.
 *
 *  THE PARAGRAPHS RUN IN TWO COLUMNS from `md`, and each is capped on its own.
 *  A single centred measure would need roughly 900px to keep to 70 characters a
 *  line, which is the full width of the content column at the narrowest desktop
 *  size — so the copy either becomes a 130-character line or shrinks into a
 *  600px ribbon with 300px of empty space either side of it. Two columns of
 *  ~26rem hold a comfortable measure at every width from `md` up, and the block
 *  still reads as one centred mass because both columns end on the same rule.
 *
 *  THE CAPABILITY ROWS carry hairline top borders rather than boxed panels. Four
 *  boxes would make this read as a dashboard of unrelated widgets; four bordered
 *  rows under one heading read as one list. The emerald rule on each is the same
 *  light source as the buttons and the headline gradient.
 *
 *  Every block here is a `Reveal`, which runs on the viewport rather than on the
 *  mount — so this section assembles as it is scrolled to, in the order the
 *  stagger sets, and never replays on the way back up.
 *
 *  `min-h-svh` because the document is the scroller now: it gives the section a
 *  full screen of its own, so arriving at About is arriving at a section rather
 *  than at the tail of the hero. It is a minimum, not a height — on a short
 *  window, or once the copy runs longer than the screen, the section grows past
 *  one viewport and the reader simply keeps going, which is the whole point of
 *  one continuous page.
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
        delay={60}
      />

      {/* ---- Body copy ---------------------------------------------------
          `md:grid-cols-2` rather than `sm`: a 648px two-column row at 768px is
          52 characters a line, which is already tight, and below that the two
          columns would be worse still. One column until there is room for two. */}
      <div className="mx-auto mt-rhythm-md grid w-full max-w-[52rem] gap-x-10 gap-y-3.5 md:grid-cols-2">
        {about.paragraphs.map((text, i) => (
          <Reveal
            key={text.slice(0, 24)}
            as="p"
            delay={330 + i * 80}
            className="text-[0.925rem] leading-[1.75] text-dim"
          >
            {text}
          </Reveal>
        ))}
      </div>

      {/* ---- Capability rows --------------------------------------------- */}
      <ul className="mx-auto mt-rhythm-lg grid w-full max-w-[52rem] gap-x-10 gap-y-6 sm:grid-cols-2">
        {about.capabilities.map(({ icon, title, body }, i) => {
          const Icon = capabilityIcon[icon]
          return (
            <Reveal
              key={title}
              as="li"
              delay={470 + i * 80}
              className="group border-t border-edge pt-4 transition-colors duration-300 hover:border-accent-400/35"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-accent-300">
                  <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[1.02rem] font-semibold tracking-[-0.015em] text-fg">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[0.875rem] leading-[1.65] text-dim">{body}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}