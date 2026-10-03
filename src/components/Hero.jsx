import { ArrowRight } from 'lucide-react'

import { hero, sparkleIcon } from '@/data/portfolio.js'
import CredentialStrip from './CredentialStrip.jsx'
import Stats from './Stats.jsx'
import TypedLine from './TypedLine.jsx'
import Button from './ui/Button.jsx'
import Reveal from './ui/Reveal.jsx'

/* ---------------------------------------------------------------------------
 *  HERO — the first section on the page.
 * ---------------------------------------------------------------------------
 *  The shell in App.jsx owns the backdrop, the navigation rail and the pinned
 *  profile card, so this file is only the content beside them. Those three hold
 *  their position because the shell pins them with `fixed` and `sticky` — not
 *  because anything here is trapped in a scroller.
 *
 *  ONE SCREEN, CENTRED. `min-h-svh` makes the section exactly one viewport tall
 *  and `justify-center` centres the column inside it, so the fold lands on the
 *  section's boundary rather than through the middle of it and the block below
 *  the fold is the next section, not the rest of this one. The column does NOT
 *  grow to fill the section (`flex-1` is deliberately absent): a stretched child
 *  swallows all the free space, which is why this hero used to sit against the
 *  top of the screen with 190px of nothing underneath it. Left at its natural
 *  height, the section's centring is what balances the space above and below.
 *
 *  Entrance order. Top-to-bottom: badge -> headline -> typed line -> calls to
 *  action -> stats -> credibility strip. The headline's two lines are offset from
 *  each other so the second lands after the first.
 * -------------------------------------------------------------------------*/
const CTA_DELAY = 420
const STATS_DELAY = 560
const STRIP_DELAY = 660

export default function Hero() {
  const Sparkle = sparkleIcon

  return (
    /* `scroll-mt-*` matters more here than anywhere else now that the document
       is the scroller: a link to `#hero` has to clear the sticky profile card's
       gutter rather than tuck the badge under it. `scroll-behavior: smooth` on
       `html` makes the journey there eased, and the reduced-motion block turns
       it into a jump. */
    <section
      id="hero"
      className="relative flex min-h-svh w-full scroll-mt-gutter flex-col justify-center px-5 pr-[var(--nav-clearance)] py-gutter sm:px-8 sm:pr-[var(--nav-clearance)] lg:px-10 lg:pr-10"
    >
      {/* The content column, centred on its own axis. `items-center` centres
          every block below as well as the text inside it, so the badge, headline,
          typed line, buttons, stats and strip all share one vertical axis rather
          than a shared left edge.

          `data-hero-column` is a stable hook for scripts/measure.mjs to check that
          axis instead of eyeballing it. */}
      <div data-hero-column className="flex min-w-0 flex-col items-center text-center">
        {/* ---- Welcome badge ---------------------------------------------
            The first thing read, so it carries more weight than a quiet tag: an
            emerald tint, a lit top edge, a glow that sits just under the pill, and
            the label itself in accent-200 rather than `dim`. */}
        <Reveal as="div" delay={120}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-accent-400/25 bg-accent-400/[0.07] px-4 py-1.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(167,243,208,0.16),0_12px_34px_-14px_rgba(52,211,153,0.55)]">
            <Sparkle className="size-3.5 shrink-0 text-accent-300" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent-200">
              {hero.badge}
            </span>
          </span>
        </Reveal>

        {/* ---- Headline -------------------------------------------------
            Each line is its own block so the two-line break is exact.
            `text-emerald-gradient` paints the accented line.

            `text-balance` is set on every h1 by the base layer, but the centred
            axis is what makes the ragged two-line stack read as deliberate: the
            widest word in each line decides the block width and both lines are
            centred against the same measure.

            The tracking is opened up a hair from -0.035em. At display sizes
            Space Grotesk's own sidebearings are already tight, and the older
            value was starting to close the counters in "Intelligent" — the line
            that carries the most meaning in the sentence. The glow on the
            gradient line is deliberately faint: enough to lift the accent off the
            near-black, not enough to read as a halo. */}
        <h1 className="mt-rhythm-sm font-display text-hero font-semibold leading-[1.03] tracking-[-0.03em]">
          {hero.headline.map(({ text, accent }, i) => (
            <Reveal
              key={text}
              as="span"
              delay={200 + i * 80}
              y={26}
              className={`block ${accent ? 'text-emerald-gradient drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}
            >
              {text}
            </Reveal>
          ))}
        </h1>

        {/* ---- Typed line -----------------------------------------------
            One animated sentence, cycling. The only moving *text* on the page,
            which is why it sits directly under the headline where it reads as
            part of it rather than as a separate block.

            `text-center` plus auto side margins puts the caret and the text in
            one centred line: without it the caret would sit at the far left of
            the measure with the sentence starting against the axis, which reads
            as two misaligned pieces rather than one line of type. */}
        <div className="mt-rhythm-sm text-center">
          <TypedLine />
        </div>

        {/* ---- Calls to action -----------------------------------------
            Inline from `sm` up. Below that they stack full-width, because two
            side-by-side buttons at 360px would leave neither of them enough
            room for its own label.

            Neither button moves on hover — colour and glow only. */}
        <div className="mt-rhythm-md flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5">
          <Button
            href={hero.primaryCta.href}
            variant="primary"
            size="lg"
            iconEnd={ArrowRight}
            delay={CTA_DELAY}
            className="w-full sm:w-auto"
          >
            {hero.primaryCta.label}
          </Button>
          <Button
            href={hero.secondaryCta.href}
            variant="secondary"
            size="lg"
            iconEnd={ArrowRight}
            delay={CTA_DELAY + 50}
            className="w-full sm:w-auto"
          >
            {hero.secondaryCta.label}
          </Button>
        </div>

        {/* ---- Stats ---------------------------------------------------
            Sits under a hairline rule that keeps the divider between the hero
            and whatever follows. The rule is `aria-hidden` because the section
            already reads as one block.

            The whole block is capped and centred rather than run to the full
            column: four cells spread across 970px of column look sparse, and the
            rule has to end exactly where the row does. The cap is wide enough
            for the longest label ("Years Experience") to hold one line in its
            cell at every size from `sm` up.

            The wrapper is a `Reveal` like every other block, so the row enters on
            the same stagger. Its counter is sequenced against that: Stats waits
            for this entrance to finish before it starts counting, so the figures
            land once the row has settled. */}
        <Reveal as="div" delay={STATS_DELAY} className="mx-auto mt-rhythm-md w-full max-w-[42rem]">
          <span
            aria-hidden="true"
            className="block h-px w-full bg-gradient-to-r from-transparent via-edge-2 to-transparent"
          />
          <div className="pt-rhythm-sm">
            <Stats />
          </div>
        </Reveal>

        {/* ---- Credibility strip ----------------------------------------
            The last thing in the hero and the quietest: a single drifting line
            of labels under the numbers, so the composition closes on something
            moving rather than on the stats grid's rule.

            It runs the full width of the column rather than the stats' narrower
            cap, because a strip that is obviously narrower than everything above
            it reads as a fragment instead of a band. It is not centred as a box —
            the motion is — so its edges are masked rather than its width
            constrained, which is what lets it reach the column's full measure
            without ever showing an end. */}
        <Reveal as="div" delay={STRIP_DELAY} className="mt-rhythm-md w-full">
          <CredentialStrip />
        </Reveal>
      </div>
    </section>
  )
}