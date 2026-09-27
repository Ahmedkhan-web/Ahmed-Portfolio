/**
 * Infinite horizontal capability strip. The track is duplicated so the -50%
 * translate loops seamlessly, and it pauses on hover.
 */
export default function Marquee({ items = [], className = '' }) {
  if (!items.length) return null
  const track = [...items, ...items]

  return (
    <div className={`group relative flex overflow-hidden ${className}`} aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base to-transparent" />

      <div className="flex w-max shrink-0 animate-marquee items-center gap-3 pr-3 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-edge/80 bg-surface/50 px-4 py-2 font-mono text-xs whitespace-nowrap text-dim"
          >
            <span className="size-1.5 rounded-full bg-accent-500" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
