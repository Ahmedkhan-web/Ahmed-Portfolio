import { useCallback, useLayoutEffect, useRef } from 'react'

import useReducedMotion from './useReducedMotion.js'

/* ============================================================================
 *  REVEAL — entrance primitive, played once per page load.
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
 *  ONCE, THEN NEVER AGAIN. The observer is disconnected the moment the element
 * arrives, and the attribute is never taken back off. A section therefore
 * assembles a single time, the first time the reader reaches it, and is settled
 * for the rest of the visit — scrolling past it and coming back slides past
 * finished content instead of re-running the whole stagger. The entrance is a
 * greeting, and a greeting the reader has already been given does not repeat
 * itself every time they glance back at the door.
 *
 *  The page load is the boundary of that. Nothing is written to storage, so a
 * reload starts the entrances over: each visit to the page is a fresh read from
 * the top, and it should look like one.
 *
 *  BECAUSE NOTHING RE-ARMS, the observer only ever has to answer one question —
 * has this been seen yet — so the callback acts on a single intersection and
 * ignores every report after it. An element that has not arrived is left
 * observed rather than resolved: a first callback reporting "not yet" is not a
 * verdict, and treating it as one would hide the block permanently, since the
 * pending state is `opacity: 0`. It waits for the intersection that counts.
 *
 *  ABOVE THE FOLD ON LOAD. Measured rather than observed, in a layout effect, so
 * it happens before the first paint. The hero and the pinned card are on screen
 * the moment the page loads and must begin their entrance on that same frame;
 * waiting for the observer's first callback would hold the hero invisible for a
 * frame and shift its stagger by however long the browser took to deliver it.
 * Having arrived by measurement, they need no observer at all.
 *
 *  NO STATE, NO RENDERS. The attribute is written to the node directly. A
 * `useState` here would re-render this element's whole subtree at the moment it
 * arrives — which is exactly the subtree that is animating.
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

  useLayoutEffect(() => {
    const node = nodeRef.current
    if (!node || reduced) return

    /* `documentElement.clientHeight` rather than `innerHeight`: on desktop the
       browser's own chrome eats into `innerHeight`, and a block sitting behind
       that strip is not on screen even though its rect is inside the number. */
    const height = document.documentElement.clientHeight
    const rect = node.getBoundingClientRect()
    if (rect.top < height && rect.bottom > 0) {
      arrive()
      return
    }

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

       DISCONNECTED ON ARRIVAL, which is what makes this a one-shot. The observer
       was previously left running in both directions so that leaving a block
       would re-arm it and returning would replay the entrance — and that is the
       behaviour this file no longer wants. A block that has been seen is done,
       and the cheapest way to be sure it stays done is to stop asking. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        arrive()
        observer.disconnect()
      },
      { threshold: 0, rootMargin: '0px 0px 12% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [arrive, reduced])

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
