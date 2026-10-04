import { useCallback, useLayoutEffect, useRef } from 'react'

import useReducedMotion from './useReducedMotion.js'

/* ============================================================================
 *  REVEAL — entrance primitive, played on every arrival in the viewport.
 *  ----------------------------------------------------------------------------
 * Wraps any element in the shared rise-and-fade entrance, held back by `delay`
 * ms so the parts of a block land in order.
 *
 *  WHEN IT RUNS. On the viewport, not on the mount. The entrance is driven by
 * one IntersectionObserver per element: the element starts at `opacity: 0` (see
 * the `reveal` utility in index.css) and is marked `data-reveal="done"` when it
 * comes into view. Without that gate the animation would play at load for the
 * whole page at once — so About and Experience would each finish their stagger
 * below the fold and simply be sitting there when the reader arrived.
 *
 *  EVERY TIME, NOT ONLY THE FIRST. The observer is never disconnected, and it
 * drives the element in both directions: arriving marks it `data-reveal="done"`
 * and starts the entrance, leaving takes the attribute away again and puts the
 * element back in its pending state. A section therefore assembles every time
 * the reader comes back to it, which is what a section that is *arrived at*
 * rather than scrolled past should do — the first arrival is not more
 * significant than the fifth, and a page whose About section is fully settled
 * while the reader is in Experience has quietly told them there is nothing to
 * come back to.
 *
 *  The reset is deliberately tied to the observer rather than to the direction
 * of the scroll: an element is re-armed when it is out of view, not when the
 * reader moves up. That is what stops a small scroll inside a section from
 * blanking half of it, and it is why the callback reads `isIntersecting` rather
 * than `boundingClientRect.deltaY`.
 *
 *  Re-arming works because the entrance is a CSS animation bound to the
 * attribute's presence. An attribute that is added, removed and added again
 * restarts the animation; setting it to a value it already holds does not. So
 * `arrive` is idempotent while it is in view, and the animation only replays
 * after a reset has genuinely undone it.
 *
 *  ABOVE THE FOLD ON LOAD. Measured rather than observed, in a layout effect, so
 * it happens before the first paint. The hero and the pinned card are on screen
 * the moment the page loads and must begin their entrance on that same frame;
 * waiting for the observer's first callback would hold the hero invisible for a
 * frame and shift its stagger by however long the browser took to deliver it.
 * The observer is attached anyway, so the hero replays like everything else.
 *
 *  NO STATE, NO RENDERS. The attribute is written to the node directly. A
 * `useState` here would re-render this element's whole subtree every time it
 * arrived or reset — which is exactly the subtree that is animating.
 *
 *  REDUCED MOTION. `prefers-reduced-motion` is honoured in two places. The
 * stylesheet empties the pending state and collapses every duration, so nothing
 * is ever hidden and nothing animates; reading it here as well means an observer
 * is not attached at all for a visitor who will never see the result.
 * ==========================================================================*/

export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  y = 22,
  className = '',
  style,
  children,
  ...rest
}) {
  const nodeRef = useRef(null)
  const reduced = useReducedMotion()

  const arrive = useCallback(() => {
    if (nodeRef.current) nodeRef.current.dataset.reveal = 'done'
  }, [])

  const reset = useCallback(() => {
    if (nodeRef.current) delete nodeRef.current.dataset.reveal
  }, [])

  useLayoutEffect(() => {
    const node = nodeRef.current
    if (!node || reduced) return

    /* `documentElement.clientHeight` rather than `innerHeight`: on desktop the
       browser's own chrome eats into `innerHeight`, and a block sitting behind
       that strip is not on screen even though its rect is inside the number. */
    const height = document.documentElement.clientHeight
    const rect = node.getBoundingClientRect()
    if (rect.top < height && rect.bottom > 0) arrive()

    /* Nothing here can afford to fail silently: the pending state is
       `opacity: 0`, so a block that never arrives never becomes visible. If the
       observer is missing, or throws, the block is simply shown. */
    if (typeof IntersectionObserver === 'undefined') {
      arrive()
      return
    }

    /* `root` is left as the viewport, which is the document — the only scroller
       on the page. It used to name the centre scroll column, and had to, because
       at `lg` that column was the scroller and sections outside it would have
       measured against a viewport they were nowhere near. Now there is one
       scroller, so `null` is simply the correct root at every size, and the same
       observer serves the desktop layout and the phone.

       The shallow bottom margin is the arrival timing: a block starts arriving
       when its top edge is within 10% of the fold rather than at the exact pixel
       of it, so a short flick is enough to begin the stagger before the block is
       fully on screen. `threshold: 0` because the decision is made by the margin,
       not by how much of the element is showing.

       TWO STATES, AND THE RECT DECIDES BETWEEN THEM. `isIntersecting` alone is
       not enough, for a reason this file's own animation causes: the entrance
       translates the element by `--reveal-y` (22px), so while it plays, the
       element sits 22px higher than where it comes to rest — and for a block
       resting just below the margin, that is the difference between inside the
       trigger line and outside it. Observed on the chapter rule: it arrived at
       the top of the fold, played, came to rest 22px lower, was reported as no
       longer intersecting, and was re-armed — a block that animated in and then
       disappeared. So a block is arrived when the observer says it is in view
       *or* when it is simply wholly on screen, and it is re-armed only once its
       own rect has left the viewport altogether. Nothing visible is ever hidden,
       and nothing hidden is ever left visible. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        const box = entry.boundingClientRect
        const vh = document.documentElement.clientHeight

        if (entry.isIntersecting || (box.top >= 0 && box.bottom <= vh)) arrive()
        else if (box.bottom <= 0 || box.top >= vh) reset()
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [arrive, reset, reduced])

  return (
    <Tag
      ref={nodeRef}
      className={`reveal ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, '--reveal-y': `${y}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}