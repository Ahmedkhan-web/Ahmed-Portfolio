import { hero } from '@/data/portfolio.js'

export default function TypedLine() {
  return (
    <p className="mx-auto max-w-[48ch] font-mono text-[0.82rem] font-medium leading-[1.7] tracking-[0.025em] text-accent-300 sm:text-[0.95rem]">
      <span
        aria-hidden="true"
        className="mr-2 inline-block size-1.5 rounded-full bg-accent-400 align-middle shadow-[0_0_12px_rgba(52,211,153,0.8)]"
      />
      {hero.typed[0]}
    </p>
  )
}
