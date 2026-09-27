import { useEffect, useRef, useState } from 'react'

const TYPE_MS = 58
const DELETE_MS = 26
const HOLD_MS = 1700

/**
 * Cycles through a list of phrases with a terminal-style typewriter effect.
 * Returns the currently visible text and whether the caret should be solid.
 *
 * Collapses to a no-op (empty text) when reduced motion is preferred — the
 * consumer is expected to render a static phrase in that case.
 */
export function useTypewriter(phrases, { enabled = true } = {}) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const phase = useRef('typing')

  useEffect(() => {
    if (!enabled || !phrases?.length) return

    const phrase = phrases[wordIndex % phrases.length]
    let timer

    if (phase.current === 'typing') {
      if (text.length < phrase.length) {
        timer = setTimeout(() => setText(phrase.slice(0, text.length + 1)), TYPE_MS)
      } else {
        timer = setTimeout(() => {
          phase.current = 'deleting'
        }, HOLD_MS)
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(phrase.slice(0, text.length - 1)), DELETE_MS)
      } else {
        phase.current = 'typing'
        timer = setTimeout(() => setWordIndex((i) => (i + 1) % phrases.length), 260)
      }
    }

    return () => clearTimeout(timer)
  }, [text, wordIndex, phrases, enabled])

  return text
}
