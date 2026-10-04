import Reveal from './Reveal.jsx'

/* ---------------------------------------------------------------------------
 *  Section heading — eyebrow, display headline, optional lede.
 * ---------------------------------------------------------------------------
 *  Shared by About and Experience so the two sections cannot drift apart.
 *
 *  `Reveal` rather than a plain element because every other block on the page
 *  enters on the same rise-and-fade. The lines stagger by `lineGap` so the
 *  headline assembles rather than appearing at once.
 *
 *  `align` exists for one reason: the hero's content column is centred on its
 *  own axis, and a left-aligned heading directly beneath it would read as a
 *  different layout rather than the next section of the same one. `center` keeps
 *  the shared axis; `left` is available for a section whose body is a full-width
 *  grid and reads better flush left.
 *
 *  There is no chapter number. The headings used to carry one — 01, 02 — set
 *  into the eyebrow pill behind a divider, on the argument that a reader who has
 *  scrolled past the hero needs to be told which chapter they have reached. The
 *  eyebrow already says it: the sections are named, the rail links to them by
 *  name, and the number was a third piece of chrome counting something the
 *  reader was never asked to count. It also sat in the top-right of the reading
 *  order while labelling the thing on its left, so it was the first thing read
 *  and the least useful.
 *
 *  `rule` closes the header with the page's standard hairline: a gradient that
 *  fades out at both ends, so it reads as a division between two chapters rather
 *  than as the top edge of a box. It is `aria-hidden` and purely decorative —
 *  the heading above it already says where the section begins.
 * -------------------------------------------------------------------------*/
export default function SectionHeading({
  eyebrow,
  lines,
  lede,
  align = 'center',
  accentLine = -1,
  lineGap = 80,
  rule = false,
  delay = 0,
}) {
  const centered = align === 'center'

  return (
    <header className={centered ? 'text-center' : 'text-left'}>
      <Reveal as="div" delay={delay} className={centered ? 'flex justify-center' : undefined}>
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-400/[0.06] px-3.5 py-1 backdrop-blur-md">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-400" />
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-accent-200">
            {eyebrow}
          </span>
        </span>
      </Reveal>

      <h2
        className={`mt-rhythm-sm font-display font-semibold leading-[1.08] tracking-[-0.03em] ${
          centered ? 'text-[clamp(1.75rem,3.4vw,2.75rem)]' : 'text-[clamp(1.6rem,2.9vw,2.35rem)]'
        }`}
      >
        {lines.map((text, i) => (
          <Reveal
            key={text}
            as="span"
            delay={delay + 90 + i * lineGap}
            y={20}
            className={`block ${i === accentLine ? 'text-emerald-gradient' : 'text-fg'}`}
          >
            {text}
          </Reveal>
        ))}
      </h2>

      {lede ? (
        <Reveal
          as="p"
          delay={delay + 90 + lines.length * lineGap}
          /* One clear step above the body copy in size as well as brightness:
             the lede is the positioning statement, and it has to read as a
             different level of the page rather than as the first of three
             paragraphs of identical grey. At 1.125rem it is two steps above the
             1rem body and one below the headline, which is what makes the
             hierarchy a ramp instead of a cliff.
             `max-w-measure` on the centred measure, so the lede wraps in the
             same band as every paragraph below it. */
          className={`mt-rhythm-sm text-[1.125rem] leading-[1.6] text-fg/85 ${
            centered ? 'mx-auto max-w-measure' : 'max-w-measure'
          }`}
        >
          {lede}
        </Reveal>
      ) : null}

      {/* The chapter rule. It arrives last in the header's own stagger, so the
          heading is read before the line that closes it. */}
      {rule ? (
        <Reveal
          as="div"
          aria-hidden="true"
          delay={delay + 90 + lines.length * lineGap + (lede ? 110 : 40)}
          className={rule === 'wide' ? 'mt-rhythm-lg' : 'mt-rhythm-md'}
        >
          <span className="block h-px w-full bg-gradient-to-r from-transparent via-edge-2 to-transparent" />
        </Reveal>
      ) : null}
    </header>
  )
}