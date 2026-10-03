import { useSyncExternalStore } from 'react'

/* ---------------------------------------------------------------------------
 *  REDUCED MOTION, as a subscription.
 *
 *  `useSyncExternalStore` rather than useState plus a matchMedia effect. The
 *  setting is external state that the browser owns, and this reads it during
 *  render without ever calling setState inside an effect body — which also means
 *  the very first paint is already correct, so there is no flash of animated
 *  content before React settles.
 *
 *  Shared by every animated part of the hero (the typewriter, the counters), so
 *  the setting is read one way in one place.
 * -------------------------------------------------------------------------*/
const reducedMotionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)')

function subscribeToReducedMotion(onChange) {
  const mq = reducedMotionQuery()
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

const getReducedSnapshot = () => reducedMotionQuery().matches
/* Server render has no matchMedia, and a false here would animate on hydration
   only to be corrected — nothing here renders on the server, but the snapshot
   contract wants both spelled out. */
const getReducedServerSnapshot = () => false

export default function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedSnapshot,
    getReducedServerSnapshot,
  )
}