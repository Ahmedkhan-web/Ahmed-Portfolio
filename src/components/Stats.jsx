import { useEffect, useReducer, useRef } from 'react'

import { hero } from '@/data/portfolio.js'
import useReducedMotion from './ui/useReducedMotion.js'

/* Timing, in ms. Long enough that the change reads as a count rather than a
   jump, short enough to land well before the eye leaves the row. */
const DURATION_MS = 1500

/* The page's own motion curve (`--ease-out-expo`), so the numbers decelerate
   into their value instead of stopping dead. Spelled out here rather than read
   from CSS because it runs inside a rAF callback, where a CSS timing function
   cannot be applied. */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

/* Fraction of the row that must be on screen before the count starts. Low
   enough that it fires as the row peeks over the fold on a phone, high enough
   that it never starts while the row is still off-screen. */
const VISIBLE_THRESHOLD = 0.35

/* ---------------------------------------------------------------------------
 *  STATS — the four numbers under the calls to action.
 *  Replaces the old scrolling marquee: same position in the composition, but a
 *  static row of figures instead of a moving strip, so nothing in the hero
 *  travels sideways any more.
 *
 *  THE COUNT. One `requestAnimationFrame` loop drives all four figures from a
 *  single 0 -> 1 progress value rather than four independent timers, which means
 *  they stay in lockstep and there is only one clock to cancel.
 *
 *  WHEN IT RUNS. Two things have to be true before the figures move, in this
 *  order: the row has to be in the viewport, and it has to have finished
 *  arriving. An IntersectionObserver supplies the first and disconnects once
 *  satisfied; the second comes from waiting on the entrance animation that the
 *  block's `Reveal` wrapper is running (`animationend` would be the same signal,
 *  read through the Web Animations API instead so it can also be awaited after
 *  the fact).
 *
 *  Waiting matters because of what the two look like together. A row that counts
 *  while it is still rising shows its final figures before it has settled, and
 *  the number you land on is the one you read while the block is still moving
 *  past it. Held until the row is still, the count reads as a separate event
 *  that happens *to* this block, in the place it ended up.
 *
 *  On a desktop the row is on screen at load and the entrance is a 560ms
 *  delay plus a 720ms rise, so the count begins about 1.3s in. On a narrow phone
 *  the row sits below the fold: the observer waits for the first scroll, and by
 *  then the entrance has long since finished — which is why the wait is on
 *  "animations currently running" rather than on a timer. `rootMargin` is
 *  deliberately absent: nothing is meant to count before it is actually visible.
 *
 *  REDUCED MOTION. With the setting on, the row renders its final figures
 *  statically on the first paint — no observer, no rAF, no intermediate value.
 *
 *  SCREEN READERS. The animating figures are `aria-hidden`, because a number
 *  changing several times a second is noise. The real values sit in a
 *  visually-hidden list beside them, so the row is announced once, in full.
 * -------------------------------------------------------------------------*/
const initial = { progress: 0 }

function reduce(state, action) {
  switch (action.type) {
    case 'final':
      return { progress: 1 }
    case 'progress':
      return { progress: action.value }
    default:
      return state
  }
}

export default function Stats() {
  const reduced = useReducedMotion()
  const rowRef = useRef(null)
  const [state, dispatch] = useReducer(reduce, initial)

  useEffect(() => {
    if (reduced) {
      dispatch({ type: 'final' })
      return
    }

    const row = rowRef.current
    if (!row) return

    let frame = 0
    let cancelled = false

    const begin = () => {
      if (cancelled) return
      const startedAt = performance.now()
      const tick = (now) => {
        /* Clamped at both ends on purpose. A rAF timestamp is the time the
           frame *began*, which can predate the `performance.now()` captured
           above, so the first frame can arrive with a negative elapsed time —
           unclamped, that renders a negative figure for one frame. */
        const t = Math.min(1, Math.max(0, (now - startedAt) / DURATION_MS))
        dispatch({ type: 'progress', value: easeOutExpo(t) })
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        /* One shot: disconnect before starting so a scroll back up and down
           cannot start a second loop over a row that has already counted. */
        observer.disconnect()

        /* `getAnimations()` returns what is running or pending right now, which
           is exactly the test wanted: an entrance still climbing shows up here,
           an entrance that finished long ago is no longer in the list and the
           count starts at once. `allSettled` rather than `all`, because a
           cancelled animation rejects `finished` and must not strand the row on
           zero.

           One frame first, though. The entrance is only created at the next
           style flush, and the observer callback that marks the block as arrived
           runs in the same task that set the attribute — so sampling straight
           away can find an empty list and start the count while the row is still
           rising, which is the exact ordering this wait exists to prevent.
           `allSettled` rather than `all` on the way out as well, because that
           frame is itself cancellable. */
        Promise.allSettled([
          new Promise((r) => requestAnimationFrame(r)),
        ]).then(() => {
          const arriving = row.closest('.reveal')?.getAnimations?.() ?? []
          return Promise.allSettled(arriving.map((a) => a.finished))
        }).then(begin)
      },
      { threshold: VISIBLE_THRESHOLD },
    )

    observer.observe(row)

    /* Cancelled rather than left running: StrictMode mounts effects twice in
       development, and a stale loop would keep dispatching into an unmounted
       tree. The flag stops the pending `begin` for the same reason. */
    return () => {
      cancelled = true
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  return (
    <>
      {/* The real values, read once and in full. */}
      <span className="sr-only">
        {hero.stats.map(({ value, label }) => `${value} ${label}`).join(', ')}
      </span>

<div
        ref={rowRef}
        data-stats
        /* Two columns on a phone, one row of four from `sm` up. No rules between
           the cells at any size: the figures are large and centred, and a line
           between each pair cut the row into four separate boxes instead of one
           figure. The gap does the separating. */
        className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-6"
      >
        {hero.stats.map(({ value, label }) => (
          <div key={label} className="flex min-w-0 flex-col items-center gap-1 px-2 text-center">
            {/* `tabular-nums` is what stops the row twitching while it counts:
                every figure then occupies the same width, so the layout does not
                shuffle as the digits change. */}
            <span
              data-stat-value={value}
              aria-hidden="true"
              className="font-display text-[2rem] font-bold leading-none tracking-[-0.03em] tabular-nums text-fg sm:text-[2.4rem] lg:text-[2.8rem]"
            >
              {Math.round(value * state.progress)}
            </span>
            <span className="font-mono text-[10.5px] font-medium uppercase leading-tight tracking-[0.18em] text-accent-300">
              {label}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}