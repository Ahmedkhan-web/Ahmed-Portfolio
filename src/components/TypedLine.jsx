import { useEffect, useReducer } from 'react'

import { hero } from '@/data/portfolio.js'
import useReducedMotion from './ui/useReducedMotion.js'

/* Timing, in ms. The hold after a sentence finishes is much longer than the
   pause after the erase, because a half-typed line reads as broken rather than
   as a pause — the reader needs longer to be sure it has finished. */
const TYPE_MS = 55
const ERASE_MS = 28
const HOLD_MS = 1900
const GAP_MS = 320

/* ---------------------------------------------------------------------------
 *  The typewriter as one reducer, so each step is a single dispatch and the
 *  state can never be half-updated — no `deleting` flag disagreeing with the
 *  `length` it is meant to be erasing.
 * -------------------------------------------------------------------------*/
const initial = { index: 0, length: 0, deleting: false }

function reduce(state, action) {
  switch (action) {
    case 'type':
      return { ...state, length: state.length + 1 }
    case 'erase':
      return { ...state, length: Math.max(0, state.length - 1), deleting: true }
    case 'next':
      return { index: (state.index + 1) % hero.typed.length, length: 0, deleting: false }
    default:
      return state
  }
}

/* ---------------------------------------------------------------------------
 *  TYPEWRITER LINE
 *  Types each sentence, holds it, erases it, moves to the next. Loops forever.
 *
 *  Three details that matter more than they look:
 *
 *  1. REDUCED MOTION. With `prefers-reduced-motion` the first sentence is shown
 *     in full, statically, and never cycles. A typewriter is exactly the kind of
 *     looping motion that setting exists to suppress.
 *
 *  2. SCREEN READERS. The visible text is `aria-hidden`, because announcing it
 *     character by character would flood a screen reader with noise. The real
 *     content sits in a visually-hidden list beside it, so the line is still
 *     read once, in full.
 *
 *  3. RESERVED HEIGHT. On a phone the box reserves two lines at every size.
 *     Without that the hero would jump on every sentence change and on every
 *     keystroke as text wrapped and unwrapped — the most noticeable way a
 *     typewriter gives away that it is scripted.
 *
 *     From `lg` the column is wide enough that the longest sentence always holds
 *     one line, so only one is reserved there. That is ~29px handed back to the
 *     hero on a laptop, which is most of the margin the strip needed, and the
 *     measure is released at the same breakpoint (`lg:max-w-none`) so the line
 *     cannot wrap into the space that reservation was holding open. The narrowest
 *     `lg` column is 504px at 1024 and the longest sentence measures 481px in it,
 *     so the single line holds with room to spare — a scrollbar on a narrower
 *     window still leaves ~489px.
 * -------------------------------------------------------------------------*/
export default function TypedLine() {
  const [state, dispatch] = useReducer(reduce, initial)
  const reduced = useReducedMotion()

  const sentence = hero.typed[state.index]
  const finished = !state.deleting && state.length === sentence.length
  const emptied = state.deleting && state.length === 0

  useEffect(() => {
    // Reduced motion renders from the snapshot above and never animates.
    if (reduced) return

    /* `length` is a dependency in its own right, not just via `finished` /
       `emptied`. Most steps of a typewriter change `length` while both of those
       stay false — typing char 3 through char 45 all look identical to the
       effect — so without it the timeout is scheduled once and never rescheduled.
       That leaves a single character on screen and a frozen caret. */
    const wait = finished ? HOLD_MS : emptied ? GAP_MS : state.deleting ? ERASE_MS : TYPE_MS
    const timer = setTimeout(
      () => dispatch(finished ? 'erase' : emptied ? 'next' : state.deleting ? 'erase' : 'type'),
      wait,
    )
    return () => clearTimeout(timer)
  }, [reduced, finished, emptied, state.deleting, state.length])

  const shown = reduced ? hero.typed[0] : sentence.slice(0, state.length)

  return (
    <>
      {/* The real content, read once. */}
      <span className="sr-only">{hero.typed.join(' ')}</span>

      <span
        data-typed
        aria-hidden="true"
        /* `mx-auto` on a full-width block, and `justify-center` on the row: the
           hero centres this block, but the caret and the sentence have to travel
           together as one centred line — without `justify-center` the caret
           would sit at the left edge of the measure with the sentence starting
           against the axis, which reads as two misaligned pieces. `max-w` gives
           the line one fixed measure, so the box does not change width as the
           sentences differ in length. The two reserved lines below are for the
           same reason: the height must not move as the text is typed and erased.
           At `lg` the cap comes off — the column is wide enough there that no
           sentence wraps, so a centred measure the width of the column is both
           the same optical result and one line instead of two of it. */
        className="mx-auto flex min-h-[3.3em] max-w-[46ch] items-start justify-center font-mono text-[0.85rem] leading-[1.65] tracking-[0.02em] text-accent-300 sm:text-[0.95rem] lg:min-h-[1.75em] lg:max-w-none lg:text-[1.02rem]"
      >
        {/* The caret. Steps rather than blinks, so it reads as a cursor driven by
            the same clock as the text rather than as decoration beside it. */}
        <span
          className="mt-[0.24em] mr-1.5 h-[1.1em] w-[2px] shrink-0 rounded-full bg-accent-400"
          style={{ animation: 'caret-blink 1.05s steps(1) infinite' }}
        />
        <span className="min-w-0">{shown}</span>
      </span>
    </>
  )
}