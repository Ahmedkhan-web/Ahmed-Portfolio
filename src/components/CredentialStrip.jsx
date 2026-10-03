import { hero } from '@/data/portfolio.js'

/* ============================================================================
 *  CREDENTIAL STRIP — the slow drift of labels under the hero.
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 *  THE STRIP.
 *  Five short labels of what the practice is, moving slowly from right to left
 *  across the foot of the hero. It is the only horizontal motion on the page,
 *  and it is deliberately the quietest thing in the composition: small type, low
 *  contrast, no panel, no rule, no border — a line of words travelling past.
 *
 *  WHY IT IS BUILT AS A DUPLICATE LIST. A strip that animates its own offset
 *  cannot hand back to a starting state at the end of the loop, so the seam is
 *  always visible somewhere. Rendering the list twice and travelling exactly one
 *  copy's width means the second copy is already sitting where the first one
 *  began: the loop closes on a frame identical to the frame before it, and
 *  nothing to see.
 *
 *  That only works if the two copies are the same width to the pixel, so both
 *  the copy and its inner spacing are uniform — every item carries its own
 *  trailing dot and its own side padding, which means the gap between the last
 *  item of one copy and the first item of the next is the same 48px as the gap
 *  between any two items. A `gap` on the track would have made the two halves
 *  differ by half a gap and put a visible hitch at the wrap.
 *
 *  NOTHING SCROLLS. The track is wider than its window by design, and the window
 *  clips it with `overflow: hidden` — a clip, not a scrollport, so no scrollbar
 *  is created and no wheel gesture over the strip is ever swallowed.
 *
 *  THE EDGES. `.strip-mask` fades the first and last 9% so labels arrive and
 *  leave rather than being sliced off at the boundary.
 *
 *  REDUCED MOTION. The track stops moving and becomes a centred, wrapping list,
 *  and the duplicate copy is dropped — so with the setting on there are five
 *  readable labels in one or two quiet rows, rather than one copy of the list
 *  sitting off the right edge of the window with the rest of it unreadable.
 *
 *  SCREEN READERS. The duplicate copy is `aria-hidden`, so the list is announced
 *  once. The labels themselves are real text rather than an image or an
 *  `aria-label`, because they are content, not decoration — this strip is the
 *  only place some of these capabilities are named on the first screen.
 * -------------------------------------------------------------------------*/

/* Long enough that a label is comfortably readable as it travels, short enough
   that the strip reads as a surface in motion rather than as an animation
   running. Linear rather than eased: an eased marquee visibly accelerates and
   slows at the wrap point, which is the tell that it is a loop. */
const DRIFT = 'animate-[strip-drift_48s_linear_infinite]'

export default function CredentialStrip() {
  return (
    <div data-strip className="strip-mask w-full overflow-hidden">
      <div
        className={`flex w-max items-center py-1 ${DRIFT} motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:animate-none`}
      >
        {/* Two identical copies. The second exists only to close the loop and is
            hidden from assistive tech — see the note above. */}
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? 'true' : undefined}
            className={`flex shrink-0 items-center ${
              copy === 1
                ? 'motion-reduce:hidden'
                : 'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1'
            }`}
          >
            {hero.strip.map((label) => (
              <span key={label} className="flex shrink-0 items-center gap-6 px-6">
                <span className="whitespace-nowrap font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-dim">
                  {label}
                </span>
                {/* Every item ends in a separator, including the last one in a
                    copy — which is what keeps the two halves identical, and so
                    keeps the loop seamless. */}
                <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-accent-400/45" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}