import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently in view, for nav highlighting.
 * Uses a scroll listener rather than IntersectionObserver because we need the
 * section whose top edge has passed the middle of the viewport.
 */
export function useActiveSection(ids, offset = 140) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      let current = ids[0] ?? ''

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset <= 0) current = id
      }

      // At the very bottom of the page, favour the last section.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        current = ids[ids.length - 1] ?? current
      }

      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return active
}
