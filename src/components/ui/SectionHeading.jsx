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
 * -------------------------------------------------------------------------*/
export default function SectionHeading({
  eyebrow,
  lines,
  lede,
  align = 'center',
  accentLine = -1,
  lineGap = 80,
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
          /* One step above the body copy in both size and weight, and a stop
             brighter than it: the lede is the positioning statement, and it has
             to read as a different level of the page rather than as the first of
             three paragraphs of identical grey. */
          className={`mt-rhythm-sm text-[1.02rem] leading-[1.65] text-fg/85 ${
            centered ? 'mx-auto max-w-[38rem]' : 'max-w-[46rem]'
          }`}
        >
          {lede}
        </Reveal>
      ) : null}
    </header>
  )
}