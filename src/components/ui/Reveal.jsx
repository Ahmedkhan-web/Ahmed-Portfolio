import { useCallback, useLayoutEffect, useRef } from 'react'

import useReducedMotion from './useReducedMotion.js'

/* ============================================================================
 *  REVEAL — entrance primitive, played once, when the element arrives.
 *  ----------------------------------------------------------------------------
 *  Wraps any element in the shared rise-and-fade entrance, held back by `delay`
 *  ms so the parts of a block land in order.
 *
 *  WHEN IT RUNS. On the viewport, not on the mount. The entrance is driven by
 *  one IntersectionObserver per element: the element starts at `opacity: 0` (see
 *  the `reveal` utility in index.css) and is marked `data-reveal="done"` at the
 *  moment it first comes into view. Without that gate the animation would play
 *  at load for the whole page at once — so About and Experience would each
 *  finish their stagger below the fold and simply be sitting there when the
 *  reader arrived.
 *
 *  ONCE, NEVER TWICE. The observer disconnects inside its own callback, so an
 *  element that has arrived cannot un-arrive and cannot replay. Scrolling back
 *  to the top and down again leaves every earlier section exactly where it was.
 *
 *  ABOVE THE FOLD ON LOAD. Measured rather than observed, in a layout effect, so
 *  it happens before the first paint. The hero and the pinned card are on screen
 *  the moment the page loads and must begin their entrance on that same frame;
 *  waiting for the observer's first callback would hold the hero invisible for a
 *  frame and shift its stagger by however long the browser took to deliver it.
 *
 *  NO STATE, NO RENDERS. The attribute is written to the node directly. A
 *  `useState` here would re-render this element's whole subtree the moment it
 *  arrived — which is exactly the subtree that is animating.
 *
 *  REDUCED MOTION. `prefers-reduced-motion` is honoured in two places. The
 *  stylesheet empties the pending state and collapses every duration, so nothing
 *  is ever hidden and nothing animates; reading it here as well means an observer
 *  is not attached at all for a visitor who will never see the result.
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
  const arrivedRef = useRef(false)
  const reduced = useReducedMotion()

  /* One-shot by construction: the second call is a no-op, which is what makes
     StrictMode's double effect run harmless. */
  const arrive = useCallback(() => {
    if (arrivedRef.current) return
    arrivedRef.current = true
    if (nodeRef.current) nodeRef.current.dataset.reveal = 'done'
  }, [])

  useLayoutEffect(() => {
    const node = nodeRef.current
    if (!node || arrivedRef.current || reduced) return

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

       The shallow bottom margin is the whole timing decision: a block starts
       arriving when its top edge is within 10% of the fold rather than at the
       exact pixel of it, so a short flick is enough to begin the stagger before
       the block is fully on screen. `threshold: 0` because the decision is made
       by the margin, not by how much of the element is showing. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        arrive()
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
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