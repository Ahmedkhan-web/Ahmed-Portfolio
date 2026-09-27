import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element the first time it scrolls into view.
 * Uses IntersectionObserver so it stays off the main thread.
 */
export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null)
  // If the browser has no IntersectionObserver, start revealed rather than
  // flipping to visible from inside the effect.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, visible]
}
