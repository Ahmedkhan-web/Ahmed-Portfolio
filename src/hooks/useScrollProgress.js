import { useEffect, useState } from 'react'

/** 0 → 1 page scroll progress, rAF-throttled. Drives the nav progress bar. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const next = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
      setProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next))
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
  }, [])

  return progress
}
